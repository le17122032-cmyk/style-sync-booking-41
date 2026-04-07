import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border safe-area-pt" style={{ contain: 'layout style' }}>
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2" aria-label="StyleSync - Inicio">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md" aria-hidden="true">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            StyleSync
          </span>
        </Link>
        <Link
          to="/auth"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
