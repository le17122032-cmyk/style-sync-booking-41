CREATE TABLE public.services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC NOT NULL,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are publicly readable"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES public.services(id),
  service_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

INSERT INTO public.services (id, name, category, duration, price, popular) VALUES
  (1, 'Corte clásico', 'barber', '30 min', 180, true),
  (2, 'Corte fade', 'barber', '45 min', 220, true),
  (3, 'Barba completa', 'barber', '30 min', 150, true),
  (4, 'Corte + Barba', 'barber', '1 hr', 320, true),
  (5, 'Diseño de cejas', 'barber', '15 min', 80, false),
  (6, 'Afeitado tradicional', 'barber', '30 min', 180, false),
  (7, 'Corte de cabello dama', 'hair', '45 min', 350, true),
  (8, 'Tinte completo', 'hair', '2 hrs', 800, true),
  (9, 'Mechas/Balayage', 'hair', '3 hrs', 1200, false),
  (10, 'Brushing', 'hair', '30 min', 200, false),
  (11, 'Tratamiento capilar', 'hair', '1 hr', 450, false),
  (12, 'Alisado keratina', 'hair', '3 hrs', 1500, false),
  (13, 'Manicure clásico', 'nails', '30 min', 180, true),
  (14, 'Manicure gel', 'nails', '45 min', 280, false),
  (15, 'Pedicure spa', 'nails', '1 hr', 320, true),
  (16, 'Uñas acrílicas', 'nails', '1.5 hrs', 500, false),
  (17, 'Masaje relajante', 'spa', '1 hr', 600, true),
  (18, 'Facial hidratante', 'spa', '1 hr', 550, false),
  (19, 'Exfoliación corporal', 'spa', '45 min', 400, false);
