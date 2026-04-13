import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Calendar, Clock, Star, Sparkles, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-salon.jpg";
import barberImg from "@/assets/service-barber.jpg";
import hairImg from "@/assets/service-hair.jpg";
import nailsImg from "@/assets/service-nails.jpg";
import spaImg from "@/assets/service-spa.jpg";

const features = [
  {
    icon: Calendar,
    title: "Reserva fácil",
    description: "Agenda tu cita en segundos desde cualquier dispositivo",
  },
  {
    icon: Clock,
    title: "Sin esperas",
    description: "Elige el horario que mejor se adapte a tu día",
  },
  {
    icon: Star,
    title: "Los mejores servicios",
    description: "Profesionales certificados y productos premium",
  },
];

const popularServices = [
  { name: "Corte fade", duration: "45 min", price: "$220", category: "Barbería" },
  { name: "Corte + Barba", duration: "1 hr", price: "$320", category: "Barbería" },
  { name: "Corte de cabello dama", duration: "45 min", price: "$350", category: "Salón" },
  { name: "Manicure", duration: "30 min", price: "$180", category: "Salón" },
];

const categoryImages = [
  { src: barberImg, label: "Barbería", link: "/servicios?cat=barber" },
  { src: hairImg, label: "Cabello", link: "/servicios?cat=hair" },
  { src: nailsImg, label: "Uñas", link: "/servicios?cat=nails" },
  { src: spaImg, label: "Spa", link: "/servicios?cat=spa" },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero Section with image */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Interior de salón de belleza moderno"
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />

        <div className="relative z-10 container px-4 py-12">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-light text-gold mb-4">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-medium">Barbería & Salón de Belleza</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Tu estilo perfecto, a un clic de distancia
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              StyleSync conecta barbería y salón de belleza en un solo lugar.
              Agenda tu corte, barba, tinte o tratamiento en segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/agendar">
                  Agendar cita
                  <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/servicios">Ver servicios</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Images Section */}
      <section className="py-16 px-4" aria-label="Categorías de servicios">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Nuestras categorías
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Explora nuestros servicios por categoría
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryImages.map((cat) => (
              <Link
                key={cat.label}
                to={cat.link}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={cat.src}
                  alt={cat.label}
                  width={640}
                  height={640}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-lg font-semibold text-primary-foreground">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4" aria-label="Beneficios de StyleSync">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              ¿Por qué StyleSync?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              La manera más simple de mantener tu look impecable
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4" aria-hidden="true">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Preview */}
      <section className="py-16 px-4 gradient-soft" aria-label="Servicios populares">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                Servicios populares
              </h2>
              <p className="text-muted-foreground text-sm">
                Los más solicitados por nuestros clientes
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/servicios" className="text-primary">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <ul className="space-y-3" role="list">
            {popularServices.map((service) => (
              <li key={service.name}>
                <Link
                  to="/agendar"
                  className="flex items-center justify-between bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {service.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">{service.price}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 px-4" aria-label="Galería de trabajos">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Nuestros trabajos
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Conoce los resultados que nuestros profesionales logran cada día
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/galeria">
              Ver galería
              <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4" aria-label="Llamada a la acción">
        <div className="container">
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-border text-center shadow-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              ¿Lista para lucir increíble?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Únete a miles de clientes satisfechas que confían en StyleSync
              para mantener su imagen impecable.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth">
                Crear cuenta gratis
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
