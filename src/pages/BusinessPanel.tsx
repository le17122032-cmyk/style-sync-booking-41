import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
  id: number;
  client: string;
  service: string;
  time: string;
  duration: string;
  status: "confirmed" | "pending" | "cancelled";
}

const mockDayAppointments: Appointment[] = [
  { id: 1, client: "María García", service: "Corte de cabello", time: "09:00", duration: "45 min", status: "confirmed" },
  { id: 2, client: "Ana López", service: "Tinte completo", time: "10:00", duration: "2 hrs", status: "confirmed" },
  { id: 3, client: "Carmen Ruiz", service: "Manicure gel", time: "12:00", duration: "45 min", status: "pending" },
  { id: 4, client: "Laura Martín", service: "Pedicure spa", time: "14:00", duration: "1 hr", status: "confirmed" },
  { id: 5, client: "Sofia Torres", service: "Brushing", time: "16:00", duration: "30 min", status: "cancelled" },
  { id: 6, client: "Elena Díaz", service: "Masaje relajante", time: "17:00", duration: "1 hr", status: "confirmed" },
];

const stats = [
  { label: "Citas hoy", value: "8", icon: Calendar, change: "+2" },
  { label: "Clientes", value: "156", icon: Users, change: "+12%" },
  { label: "Ingresos", value: "$12,450", icon: DollarSign, change: "+8%" },
  { label: "Tasa éxito", value: "94%", icon: TrendingUp, change: "+3%" },
];

const statusConfig = {
  confirmed: { label: "Confirmada", className: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pendiente", className: "bg-gold-light text-gold", icon: Clock },
  cancelled: { label: "Cancelada", className: "bg-red-100 text-red-600", icon: XCircle },
};

const BusinessPanel = () => {
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const navigateDate = (direction: number) => {
    const days = viewMode === "day" ? 1 : 7;
    setCurrentDate(addDays(currentDate, direction * days));
  };

  return (
    <PageLayout>
      <div className="container px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Panel del negocio
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu agenda y clientes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl border border-border p-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-rose-light flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              <span className="text-xs font-medium text-foreground bg-secondary px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* View Toggle & Date Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("day")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                viewMode === "day"
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                viewMode === "week"
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              Semana
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
              {viewMode === "day"
                ? format(currentDate, "d 'de' MMM", { locale: es })
                : `${format(weekStart, "d MMM", { locale: es })} - ${format(addDays(weekStart, 6), "d MMM", { locale: es })}`
              }
            </span>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Week View - Day Selector */}
        {viewMode === "week" && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
            {weekDays.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => setCurrentDate(day)}
                className={cn(
                  "flex flex-col items-center min-w-[48px] py-2 px-3 rounded-xl transition-all duration-200",
                  isSameDay(day, currentDate)
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border hover:border-primary/30"
                )}
              >
                <span className="text-xs font-medium opacity-70">
                  {format(day, "EEE", { locale: es })}
                </span>
                <span className="text-lg font-bold">{format(day, "d")}</span>
              </button>
            ))}
          </div>
        )}

        {/* Day Schedule */}
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">
            Citas del día - {format(currentDate, "EEEE d 'de' MMMM", { locale: es })}
          </h2>
          {mockDayAppointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className={cn(
                "bg-card rounded-2xl border p-4 animate-fade-in",
                appointment.status === "cancelled" ? "opacity-60 border-border" : "border-border"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-primary">{appointment.time}</span>
                    <span className="text-xs text-muted-foreground">{appointment.duration}</span>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-3">
                    <h4 className="font-medium text-foreground">{appointment.client}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                    statusConfig[appointment.status].className
                  )}
                >
                  {statusConfig[appointment.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Ver clientes</span>
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Reportes</span>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default BusinessPanel;
