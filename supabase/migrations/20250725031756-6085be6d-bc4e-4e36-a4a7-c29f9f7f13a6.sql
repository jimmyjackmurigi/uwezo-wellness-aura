-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')) DEFAULT 'moderately_active',
  health_goals TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health metrics table for real-time monitoring
CREATE TABLE public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('heart_rate', 'blood_oxygen', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'temperature', 'weight', 'sleep_hours', 'stress_level')),
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'manual', -- 'manual', 'wearable', 'api'
  device_id TEXT,
  is_anomaly BOOLEAN DEFAULT false,
  anomaly_confidence DECIMAL(5,4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily activities table
CREATE TABLE public.daily_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  steps INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  distance_km DECIMAL(10,2) DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  exercise_type TEXT,
  exercise_duration_minutes INTEGER DEFAULT 0,
  water_intake_ml INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create health journal entries table
CREATE TABLE public.health_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  mood_emoji TEXT,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  symptoms TEXT[],
  notes TEXT,
  medication_taken TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('activity', 'nutrition', 'sleep', 'stress', 'medical', 'general')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  action_taken BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health alerts table
CREATE TABLE public.health_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('heart_rate_high', 'heart_rate_low', 'blood_oxygen_low', 'irregular_pattern', 'medication_reminder', 'checkup_reminder')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical', 'emergency')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metric_id UUID REFERENCES public.health_metrics(id),
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  emergency_contact_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gamification system tables
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('activity', 'consistency', 'health_improvement', 'milestone')),
  points INTEGER NOT NULL DEFAULT 0,
  criteria JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  level_number INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create doctor/admin access table
CREATE TABLE public.doctor_patient_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL CHECK (access_level IN ('view_only', 'full_access')),
  granted_by UUID NOT NULL REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(doctor_id, patient_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_patient_access ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for health metrics
CREATE POLICY "Users can view their own health metrics" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own health metrics" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health metrics" ON public.health_metrics FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for daily activities
CREATE POLICY "Users can view their own activities" ON public.daily_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities" ON public.daily_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activities" ON public.daily_activities FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for health journal
CREATE POLICY "Users can view their own journal" ON public.health_journal FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own journal" ON public.health_journal FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journal" ON public.health_journal FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journal" ON public.health_journal FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for AI recommendations
CREATE POLICY "Users can view their own recommendations" ON public.ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own recommendations" ON public.ai_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for health alerts
CREATE POLICY "Users can view their own alerts" ON public.health_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.health_alerts FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Create RLS policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user points
CREATE POLICY "Users can view their own points" ON public.user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own points" ON public.user_points FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own points" ON public.user_points FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for doctor access (placeholder for now)
CREATE POLICY "Users can view doctor access for themselves" ON public.doctor_patient_access FOR SELECT USING (auth.uid() = patient_id);

-- Create indexes for better performance
CREATE INDEX idx_health_metrics_user_id_type ON public.health_metrics(user_id, metric_type);
CREATE INDEX idx_health_metrics_recorded_at ON public.health_metrics(recorded_at);
CREATE INDEX idx_daily_activities_user_date ON public.daily_activities(user_id, date);
CREATE INDEX idx_health_journal_user_date ON public.health_journal(user_id, date);
CREATE INDEX idx_ai_recommendations_user_created ON public.ai_recommendations(user_id, created_at);
CREATE INDEX idx_health_alerts_user_created ON public.health_alerts(user_id, created_at);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_activities_updated_at BEFORE UPDATE ON public.daily_activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_journal_updated_at BEFORE UPDATE ON public.health_journal FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, category, points, criteria) VALUES
('First Steps', 'Record your first daily activity', '👟', 'milestone', 10, '{"type": "first_activity"}'),
('Heart Monitor', 'Record 7 days of heart rate data', '❤️', 'consistency', 50, '{"type": "heart_rate_streak", "days": 7}'),
('Water Champion', 'Drink 8 glasses of water in a day', '💧', 'activity', 25, '{"type": "daily_water", "amount": 2000}'),
('Early Bird', 'Log morning workouts for 5 consecutive days', '🌅', 'consistency', 75, '{"type": "morning_workout_streak", "days": 5}'),
('Health Journal', 'Write 30 journal entries', '📝', 'consistency', 100, '{"type": "journal_entries", "count": 30}'),
('Step Master', 'Walk 10,000 steps in a day', '🚶', 'activity', 30, '{"type": "daily_steps", "count": 10000}'),
('Wellness Warrior', 'Complete 100 health activities', '🏆', 'milestone', 500, '{"type": "total_activities", "count": 100}');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  
  -- Initialize user points
  INSERT INTO public.user_points (user_id, points, total_points, level_number)
  VALUES (NEW.id, 0, 0, 1);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();