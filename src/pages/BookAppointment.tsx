import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Clock, ChevronLeft, ChevronRight, Scissors, Sparkles, Heart, Star, User } from "lucide-react";

const services = [
  // Barbería
  { id: 1, name: "Corte clásico", category: "barber", duration: "30 min", price: 180, icon: User },
  { id: 2, name: "Corte fade", category: "barber", duration: "45 min", price: 220, icon: User },
  { id: 3, name: "Barba completa", category: "barber", duration: "30 min", price: 150, icon: User },
  { id: 4, name: "Corte + Barba", category: "barber", duration: "1 hr", price: 320, icon: User },
  // Salón
  { id: 5, name: "Corte dama", category: "hair", duration: "45 min", price: 350, icon: Scissors },
  { id: 6, name: "Tinte completo", category: "hair", duration: "2 hrs", price: 800, icon: Scissors },
  { id: 7, name: "Manicure", category: "nails", duration: "30 min", price: 180, icon: Heart },
  { id: 8, name: "Pedicure spa", category: "nails", duration: "1 hr", price: 320, icon: Sparkles },
  { id: 9, name: "Masaje", category: "spa", duration: "1 hr", price: 600, icon: Star },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirm = () => {
    // TODO: Implement booking confirmation
    console.log("Booking:", { selectedService, selectedDate, selectedTime });
    setStep(4);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== null;
      case 2: return selectedDate !== undefined;
      case 3: return selectedTime !== null;
      default: return false;
    }
  };

  return (
    <PageLayout>
      <div className="container px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Agendar cita
          </h1>
          <p className="text-muted-foreground">
            Selecciona tu servicio, fecha y hora
          </p>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                    s < step
                      ? "gradient-primary text-primary-foreground"
                      : s === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      "flex-1 h-1 rounded-full transition-all duration-200",
                      s < step ? "bg-primary" : "bg-secondary"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="font-semibold text-foreground mb-4">Elige tu servicio</h2>
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                  selectedService === service.id
                    ? "border-primary bg-rose-light"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    selectedService === service.id
                      ? "gradient-primary"
                      : "bg-secondary"
                  )}
                >
                  <service.icon
                    className={cn(
                      "w-6 h-6",
                      selectedService === service.id
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </p>
                </div>
                <span className="font-semibold text-primary">${service.price}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-semibold text-foreground mb-4">Selecciona una fecha</h2>
            <div className="bg-card rounded-2xl border border-border p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={es}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="pointer-events-auto"
              />
            </div>
            {selectedDate && (
              <p className="mt-4 text-center text-muted-foreground">
                Seleccionaste:{" "}
                <span className="font-medium text-foreground">
                  {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Step 3: Select Time */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-semibold text-foreground mb-4">Elige tu hora</h2>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedTime === time
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-card border border-border text-foreground hover:border-primary/30"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="text-center py-8 animate-slide-up">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              ¡Cita agendada!
            </h2>
            <p className="text-muted-foreground mb-6">
              Tu cita ha sido confirmada exitosamente
            </p>
            <div className="bg-card rounded-2xl border border-border p-6 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="font-medium text-foreground">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora</span>
                  <span className="font-medium text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-primary">${selectedServiceData?.price}</span>
                </div>
              </div>
            </div>
            <Button variant="hero" size="lg" onClick={() => window.location.href = "/mis-citas"}>
              Ver mis citas
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="fixed bottom-24 left-0 right-0 px-4 pb-4 glass border-t border-border">
            <div className="container flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Atrás
                </Button>
              )}
              <Button
                variant="hero"
                size="lg"
                onClick={step === 3 ? handleConfirm : handleNext}
                disabled={!canProceed()}
                className="flex-1"
              >
                {step === 3 ? "Confirmar cita" : "Siguiente"}
                {step < 3 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BookAppointment;
