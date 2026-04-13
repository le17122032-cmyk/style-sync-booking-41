import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Search, Scissors, Sparkles, Heart, Star, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fetchServices } from "@/lib/dataSync";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { DBService } from "@/lib/indexedDB";

import barberImg from "@/assets/service-barber.jpg";
import hairImg from "@/assets/service-hair.jpg";
import nailsImg from "@/assets/service-nails.jpg";
import spaImg from "@/assets/service-spa.jpg";

const categoryImages: Record<string, string> = {
  barber: barberImg,
  hair: hairImg,
  nails: nailsImg,
  spa: spaImg,
};

const categories = [
  { id: "all", name: "Todos", icon: Sparkles },
  { id: "barber", name: "Barbería", icon: User },
  { id: "hair", name: "Cabello", icon: Scissors },
  { id: "nails", name: "Uñas", icon: Heart },
  { id: "spa", name: "Spa", icon: Star },
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<DBService[]>([]);
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Nuestros servicios
          </h1>
          <p className="text-muted-foreground">
            {isOnline ? "Descubre todo lo que tenemos para ti" : "Mostrando servicios guardados localmente"}
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <Input
            type="text"
            placeholder="Buscar servicio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 rounded-xl"
          />
        </div>

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
              <category.icon className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                to={`/agendar?service=${service.id}`}
                className="flex bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={categoryImages[service.category] || barberImg}
                    alt={service.category}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between flex-1 p-4">
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
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {service.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-primary">
                      ${service.price}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-rose-light flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron servicios</p>
          </div>
        )}

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
