import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Search, Scissors, Sparkles, Heart, Star, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { seedServicesIfEmpty, type DBService } from "@/lib/indexedDB";

const categories = [
  { id: "all", name: "Todos", icon: Sparkles },
  { id: "barber", name: "Barbería", icon: User },
  { id: "hair", name: "Cabello", icon: Scissors },
  { id: "nails", name: "Uñas", icon: Heart },
  { id: "spa", name: "Spa", icon: Star },
];

const services = [
  // Barbería
  { id: 1, name: "Corte clásico", category: "barber", duration: "30 min", price: 180, popular: true },
  { id: 2, name: "Corte fade", category: "barber", duration: "45 min", price: 220, popular: true },
  { id: 3, name: "Barba completa", category: "barber", duration: "30 min", price: 150, popular: true },
  { id: 4, name: "Corte + Barba", category: "barber", duration: "1 hr", price: 320, popular: true },
  { id: 5, name: "Diseño de cejas", category: "barber", duration: "15 min", price: 80, popular: false },
  { id: 6, name: "Afeitado tradicional", category: "barber", duration: "30 min", price: 180, popular: false },
  // Cabello
  { id: 7, name: "Corte de cabello dama", category: "hair", duration: "45 min", price: 350, popular: true },
  { id: 8, name: "Tinte completo", category: "hair", duration: "2 hrs", price: 800, popular: true },
  { id: 9, name: "Mechas/Balayage", category: "hair", duration: "3 hrs", price: 1200, popular: false },
  { id: 10, name: "Brushing", category: "hair", duration: "30 min", price: 200, popular: false },
  { id: 11, name: "Tratamiento capilar", category: "hair", duration: "1 hr", price: 450, popular: false },
  { id: 12, name: "Alisado keratina", category: "hair", duration: "3 hrs", price: 1500, popular: false },
  // Uñas
  { id: 13, name: "Manicure clásico", category: "nails", duration: "30 min", price: 180, popular: true },
  { id: 14, name: "Manicure gel", category: "nails", duration: "45 min", price: 280, popular: false },
  { id: 15, name: "Pedicure spa", category: "nails", duration: "1 hr", price: 320, popular: true },
  { id: 16, name: "Uñas acrílicas", category: "nails", duration: "1.5 hrs", price: 500, popular: false },
  // Spa
  { id: 17, name: "Masaje relajante", category: "spa", duration: "1 hr", price: 600, popular: true },
  { id: 18, name: "Facial hidratante", category: "spa", duration: "1 hr", price: 550, popular: false },
  { id: 19, name: "Exfoliación corporal", category: "spa", duration: "45 min", price: 400, popular: false },
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Seed services to IndexedDB on mount
  useEffect(() => {
    const dbServices: DBService[] = services.map(({ id, name, category, duration, price, popular }) => ({
      id, name, category, duration, price, popular,
    }));
    seedServicesIfEmpty(dbServices);
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="container px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Nuestros servicios
          </h1>
          <p className="text-muted-foreground">
            Descubre todo lo que tenemos para ti
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar servicio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200",
                selectedCategory === category.id
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.map((service, index) => (
            <Link
              key={service.id}
              to={`/agendar?service=${service.id}`}
              className="block bg-card rounded-2xl p-4 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{service.name}</h3>
                    {service.popular && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-gold-light text-gold rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-primary">
                    ${service.price}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rose-light flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron servicios</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 p-6 bg-card rounded-2xl border border-border text-center">
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Contáctanos y te ayudaremos a encontrar el servicio perfecto
          </p>
          <Button variant="outline">Contactar</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Services;
