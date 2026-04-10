import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "@/components/OfflineBanner";

interface PageLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
}

export function PageLayout({ children, showHeader = true, showNav = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <OfflineBanner />
      <main className={`${showHeader ? "pt-16" : ""} ${showNav ? "pb-20" : ""}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
