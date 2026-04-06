const DB_NAME = "stylesync-db";
const DB_VERSION = 1;

export interface DBService {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: number;
  popular?: boolean;
}

export interface DBAppointment {
  id: string;
  serviceId: number;
  serviceName: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  price: number;
  createdAt: string;
}

export interface DBUserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("services")) {
        db.createObjectStore("services", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("appointments")) {
        const aptStore = db.createObjectStore("appointments", { keyPath: "id" });
        aptStore.createIndex("status", "status", { unique: false });
        aptStore.createIndex("date", "date", { unique: false });
      }
      if (!db.objectStoreNames.contains("userProfile")) {
        db.createObjectStore("userProfile", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic helpers
async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function getById<T>(storeName: string, id: string | number): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function put<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(data);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

async function putMany<T>(storeName: string, items: T[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    items.forEach((item) => store.put(item));
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteById(storeName: string, id: string | number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

// ─── Services ───
export const servicesDB = {
  getAll: () => getAll<DBService>("services"),
  getById: (id: number) => getById<DBService>("services", id),
  save: (service: DBService) => put("services", service),
  saveMany: (services: DBService[]) => putMany("services", services),
  delete: (id: number) => deleteById("services", id),
};

// ─── Appointments ───
export const appointmentsDB = {
  getAll: () => getAll<DBAppointment>("appointments"),
  getById: (id: string) => getById<DBAppointment>("appointments", id),
  save: (appointment: DBAppointment) => put("appointments", appointment),
  update: (appointment: DBAppointment) => put("appointments", appointment),
  delete: (id: string) => deleteById("appointments", id),
  getByStatus: async (status: DBAppointment["status"]): Promise<DBAppointment[]> => {
    const all = await getAll<DBAppointment>("appointments");
    return all.filter((a) => a.status === status);
  },
};

// ─── User Profile ───
export const userProfileDB = {
  get: () => getById<DBUserProfile>("userProfile", "current"),
  save: (profile: Omit<DBUserProfile, "id">) =>
    put("userProfile", { ...profile, id: "current" }),
  delete: () => deleteById("userProfile", "current"),
};

// ─── Seed initial data ───
export async function seedServicesIfEmpty(services: DBService[]): Promise<void> {
  const existing = await servicesDB.getAll();
  if (existing.length === 0) {
    await servicesDB.saveMany(services);
    console.log("[IndexedDB] Seeded services catalog");
  }
}
