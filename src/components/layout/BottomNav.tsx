import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Scissors, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Inicio" },
  { path: "/servicios", icon: Scissors, label: "Servicios" },
  { path: "/agendar", icon: Calendar, label: "Agendar" },
  { path: "/mis-citas", icon: User, label: "Mis Citas" },
  { path: "/panel", icon: LayoutDashboard, label: "Panel" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-area-pb" aria-label="Navegación principal">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary bg-rose-light"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "animate-pulse-soft")} aria-hidden="true" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
