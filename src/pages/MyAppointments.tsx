import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, MoreHorizontal, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchAppointments, cancelAppointment } from "@/lib/dataSync";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { DBAppointment } from "@/lib/indexedDB";

const statusConfig = {
  upcoming: { label: "Próxima", className: "bg-gold-light text-gold" },
  completed: { label: "Completada", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelada", className: "bg-red-100 text-red-600" },
};

const MyAppointments = () => {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [appointments, setAppointments] = useState<DBAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const filteredAppointments = appointments.filter(
    (apt) => filter === "all" || apt.status === filter
  );

  const handleCancel = async (id: string) => {
    await cancelAppointment(id);
    setAppointments(appointments.map((a) =>
      a.id === id ? { ...a, status: "cancelled" as const } : a
    ));
  };

  return (
    <PageLayout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Mis citas
            </h1>
            <p className="text-muted-foreground">
              {isOnline ? "Gestiona tus citas agendadas" : "Mostrando citas guardadas localmente"}
            </p>
          </div>
          <Button variant="hero" size="sm" asChild>
            <Link to="/agendar">
              <CalendarPlus className="w-4 h-4 mr-1" aria-hidden="true" />
              Nueva
            </Link>
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 mb-6 scrollbar-hide">
          {[
            { id: "all", label: "Todas" },
            { id: "upcoming", label: "Próximas" },
            { id: "completed", label: "Completadas" },
            { id: "cancelled", label: "Canceladas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                filter === tab.id
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-4 animate-pulse h-40" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-card rounded-2xl border border-border p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {appointment.serviceName}
                    </h3>
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 text-xs font-medium rounded-full",
                        statusConfig[appointment.status].className
                      )}
                    >
                      {statusConfig[appointment.status].label}
                    </span>
                  </div>
                  {appointment.status === "upcoming" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/agendar">Reprogramar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancelar cita
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>StyleSync Salon - Centro</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-muted-foreground text-sm">Total</span>
                  <span className="font-semibold text-primary">${appointment.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No tienes citas</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Agenda tu primera cita y comienza a disfrutar
            </p>
            <Button variant="hero" asChild>
              <Link to="/agendar">Agendar cita</Link>
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyAppointments;
