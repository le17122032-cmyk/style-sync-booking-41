// Local user credentials store (separate IndexedDB database)

export interface LocalUser {
  email: string;
  name: string;
  passwordHash: string;
}

// We need to add a "users" store to IndexedDB
const STORE_NAME = "users";

async function getDB(): Promise<IDBDatabase> {
  // Use a separate DB for user credentials to avoid version conflicts
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("stylesync-auth", 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "email" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const localUsersDB = {
  getByEmail: async (email: string): Promise<LocalUser | undefined> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(email.toLowerCase());
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  },

  save: async (user: LocalUser): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({ ...user, email: user.email.toLowerCase() });
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    });
  },

  getAll: async (): Promise<LocalUser[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  },
};
