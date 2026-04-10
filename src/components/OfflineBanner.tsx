import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed top-16 left-0 right-0 z-[60] bg-destructive text-destructive-foreground text-center text-sm py-2 px-4 flex items-center justify-center gap-2"
    >
      <WifiOff className="w-4 h-4" aria-hidden="true" />
      <span>Sin conexión — Mostrando datos guardados localmente</span>
    </div>
  );
}
