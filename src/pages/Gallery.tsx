import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const galleryItems = [
  { src: gallery1, alt: "Balayage profesional", category: "Cabello" },
  { src: gallery2, alt: "Corte fade perfecto", category: "Barbería" },
  { src: gallery3, alt: "Diseño de uñas artístico", category: "Uñas" },
  { src: gallery4, alt: "Ambiente spa relajante", category: "Spa" },
  { src: gallery5, alt: "Barba clásica bien cuidada", category: "Barbería" },
  { src: gallery6, alt: "Peinado con rizos definidos", category: "Cabello" },
];

const filterCategories = ["Todos", "Barbería", "Cabello", "Uñas", "Spa"];

const Gallery = () => {
  const [filter, setFilter] = useState("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "Todos"
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  return (
    <PageLayout>
      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Galería de trabajos
          </h1>
          <p className="text-muted-foreground">
            Conoce los resultados de nuestros profesionales
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 mb-6 scrollbar-hide">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium",
                filter === cat
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {filtered.map((item, index) => (
            <button
              key={index}
              onClick={() => setLightbox(index)}
              className="block w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 break-inside-avoid"
            >
              <img
                src={item.src}
                alt={item.alt}
                width={640}
                height={800}
                loading="lazy"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="p-3 bg-card text-left">
                <p className="text-sm font-medium text-foreground">{item.alt}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay imágenes en esta categoría</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-primary-foreground"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={filtered[lightbox]?.src}
            alt={filtered[lightbox]?.alt}
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
          />
        </div>
      )}
    </PageLayout>
  );
};

export default Gallery;
