import { supabase } from "@/integrations/supabase/client";
import { servicesDB, appointmentsDB, type DBService, type DBAppointment } from "@/lib/indexedDB";

/**
 * Fetch services from API, cache in IndexedDB, fallback to local on error.
 */
export async function fetchServices(): Promise<DBService[]> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("id");

    if (error) throw error;

    const services: DBService[] = (data ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      duration: s.duration,
      price: s.price,
      popular: s.popular ?? false,
    }));

    // Cache in IndexedDB
    await servicesDB.saveMany(services);
    console.log("[Sync] Services fetched from API and cached locally");
    return services;
  } catch (err) {
    console.warn("[Sync] API unavailable, loading services from IndexedDB", err);
    const cached = await servicesDB.getAll();
    if (cached.length > 0) return cached;

    // Hardcoded fallback if IndexedDB is also empty
    return getDefaultServices();
  }
}

/**
 * Fetch user appointments from API, cache in IndexedDB, fallback to local.
 */
export async function fetchAppointments(): Promise<DBAppointment[]> {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const appointments: DBAppointment[] = (data ?? []).map((a) => ({
      id: a.id,
      serviceId: a.service_id ?? 0,
      serviceName: a.service_name,
      date: a.date,
      time: a.time,
      status: a.status as DBAppointment["status"],
      price: a.price,
      createdAt: a.created_at,
    }));

    // Cache in IndexedDB
    for (const apt of appointments) {
      await appointmentsDB.save(apt);
    }
    console.log("[Sync] Appointments fetched from API and cached locally");
    return appointments;
  } catch (err) {
    console.warn("[Sync] API unavailable, loading appointments from IndexedDB", err);
    return appointmentsDB.getAll();
  }
}

/**
 * Create an appointment — saves to API if online, always saves to IndexedDB.
 */
export async function createAppointment(
  appointment: Omit<DBAppointment, "id" | "createdAt">
): Promise<DBAppointment> {
  const localId = crypto.randomUUID();
  const now = new Date().toISOString();

  const localAppointment: DBAppointment = {
    ...appointment,
    id: localId,
    createdAt: now,
  };

  // Always save locally first
  await appointmentsDB.save(localAppointment);

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          service_id: appointment.serviceId,
          service_name: appointment.serviceName,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          price: appointment.price,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (!error && data) {
        // Update local with server ID
        await appointmentsDB.delete(localId);
        const synced: DBAppointment = {
          id: data.id,
          serviceId: data.service_id ?? 0,
          serviceName: data.service_name,
          date: data.date,
          time: data.time,
          status: data.status as DBAppointment["status"],
          price: data.price,
          createdAt: data.created_at,
        };
        await appointmentsDB.save(synced);
        return synced;
      }
    }
  } catch (err) {
    console.warn("[Sync] Created appointment offline, will sync later", err);
  }

  return localAppointment;
}

/**
 * Cancel an appointment — updates API if online, always updates IndexedDB.
 */
export async function cancelAppointment(id: string): Promise<void> {
  // Update locally
  const apt = await appointmentsDB.getById(id);
  if (apt) {
    await appointmentsDB.update({ ...apt, status: "cancelled" });
  }

  try {
    await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id);
  } catch (err) {
    console.warn("[Sync] Cancelled offline, will sync later", err);
  }
}

function getDefaultServices(): DBService[] {
  return [
    { id: 1, name: "Corte clásico", category: "barber", duration: "30 min", price: 180, popular: true },
    { id: 2, name: "Corte fade", category: "barber", duration: "45 min", price: 220, popular: true },
    { id: 3, name: "Barba completa", category: "barber", duration: "30 min", price: 150, popular: true },
    { id: 4, name: "Corte + Barba", category: "barber", duration: "1 hr", price: 320, popular: true },
    { id: 5, name: "Diseño de cejas", category: "barber", duration: "15 min", price: 80, popular: false },
    { id: 6, name: "Afeitado tradicional", category: "barber", duration: "30 min", price: 180, popular: false },
    { id: 7, name: "Corte de cabello dama", category: "hair", duration: "45 min", price: 350, popular: true },
    { id: 8, name: "Tinte completo", category: "hair", duration: "2 hrs", price: 800, popular: true },
    { id: 9, name: "Mechas/Balayage", category: "hair", duration: "3 hrs", price: 1200, popular: false },
    { id: 10, name: "Brushing", category: "hair", duration: "30 min", price: 200, popular: false },
    { id: 11, name: "Tratamiento capilar", category: "hair", duration: "1 hr", price: 450, popular: false },
    { id: 12, name: "Alisado keratina", category: "hair", duration: "3 hrs", price: 1500, popular: false },
    { id: 13, name: "Manicure clásico", category: "nails", duration: "30 min", price: 180, popular: true },
    { id: 14, name: "Manicure gel", category: "nails", duration: "45 min", price: 280, popular: false },
    { id: 15, name: "Pedicure spa", category: "nails", duration: "1 hr", price: 320, popular: true },
    { id: 16, name: "Uñas acrílicas", category: "nails", duration: "1.5 hrs", price: 500, popular: false },
    { id: 17, name: "Masaje relajante", category: "spa", duration: "1 hr", price: 600, popular: true },
    { id: 18, name: "Facial hidratante", category: "spa", duration: "1 hr", price: 550, popular: false },
    { id: 19, name: "Exfoliación corporal", category: "spa", duration: "45 min", price: 400, popular: false },
  ];
}
