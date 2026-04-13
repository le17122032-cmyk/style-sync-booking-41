import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Eager load Index for LCP
import Index from "./pages/Index";

// Lazy load other routes
const Auth = lazy(() => import("./pages/Auth"));
const Services = lazy(() => import("./pages/Services"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const BusinessPanel = lazy(() => import("./pages/BusinessPanel"));
const Gallery = lazy(() => import("./pages/Gallery"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
      <span className="sr-only">Cargando…</span>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/agendar" element={<BookAppointment />} />
              <Route path="/mis-citas" element={<MyAppointments />} />
              <Route path="/panel" element={<BusinessPanel />} />
              <Route path="/galeria" element={<Gallery />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
