-- Supabase Şema Düzeltmeleri
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. children tablosuna eksik alanları ekle
ALTER TABLE public.children 
ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS height DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS medications TEXT,
ADD COLUMN IF NOT EXISTS conditions TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. user_profiles tablosuna eksik alanları ekle
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(100),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. family_members tablosundaki foreign key'i düzelt
-- Önce mevcut foreign key'i kaldır
ALTER TABLE public.family_members 
DROP CONSTRAINT IF EXISTS family_members_user_id_fkey;

-- Doğru foreign key'i ekle
ALTER TABLE public.family_members 
ADD CONSTRAINT family_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. notifications tablosuna eksik alanları ekle
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS type VARCHAR(50) CHECK (type IN ('medication', 'appointment', 'temperature', 'routine', 'growth', 'system')),
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_important BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS action VARCHAR(100);

-- 5. appointments tablosundaki alanları düzelt
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS time TIME;

-- 6. daily_routines tablosundaki alanları düzelt
ALTER TABLE public.daily_routines 
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS time TIME,
ADD COLUMN IF NOT EXISTS duration INTEGER,
ADD COLUMN IF NOT EXISTS mood VARCHAR(20) CHECK (mood IN ('very_happy', 'happy', 'normal', 'sad', 'angry', 'energetic')),
ADD COLUMN IF NOT EXISTS quality VARCHAR(20) CHECK (quality IN ('excellent', 'good', 'average', 'poor', 'very_poor'));

-- 7. doctors tablosundaki foreign key'i düzelt
ALTER TABLE public.doctors 
DROP CONSTRAINT IF EXISTS doctors_family_id_fkey;

ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES public.children(id) ON DELETE CASCADE;

-- 8. RLS (Row Level Security) etkinleştir
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seizure_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temperature_records ENABLE ROW LEVEL SECURITY;

-- 9. Mevcut politikaları temizle (eğer varsa)
DROP POLICY IF EXISTS "Users can view their own families" ON public.families;
DROP POLICY IF EXISTS "Users can insert families" ON public.families;
DROP POLICY IF EXISTS "Users can update their own families" ON public.families;
DROP POLICY IF EXISTS "Users can view family members of their families" ON public.family_members;
DROP POLICY IF EXISTS "Users can insert family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can view children of their families" ON public.children;
DROP POLICY IF EXISTS "Users can insert children for their families" ON public.children;
DROP POLICY IF EXISTS "Users can update children of their families" ON public.children;
DROP POLICY IF EXISTS "Users can delete children of their families" ON public.children;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert notifications for themselves" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

-- 10. RLS Politikalarını oluştur

-- Families policies
CREATE POLICY "Users can view their own families" ON public.families
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.family_members 
            WHERE family_members.family_id = families.id 
            AND family_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert families" ON public.families
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own families" ON public.families
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.family_members 
            WHERE family_members.family_id = families.id 
            AND family_members.user_id = auth.uid()
        )
    );

-- Family members policies
CREATE POLICY "Users can view family members of their families" ON public.family_members
    FOR SELECT USING (
        family_id IN (
            SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert family members" ON public.family_members
    FOR INSERT WITH CHECK (true);

-- Children policies
CREATE POLICY "Users can view children of their families" ON public.children
    FOR SELECT USING (
        family_id IN (
            SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert children for their families" ON public.children
    FOR INSERT WITH CHECK (
        family_id IN (
            SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update children of their families" ON public.children
    FOR UPDATE USING (
        family_id IN (
            SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete children of their families" ON public.children
    FOR DELETE USING (
        family_id IN (
            SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
        )
    );

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert notifications for themselves" ON public.notifications
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications" ON public.notifications
    FOR DELETE USING (user_id = auth.uid());

-- 11. Trigger fonksiyonlarını oluştur
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Mevcut trigger'ları sil ve yeniden oluştur
DROP TRIGGER IF EXISTS update_children_updated_at ON public.children;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_families_updated_at ON public.families;

-- Trigger'ları oluştur
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON public.children
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Yeni kullanıcı trigger'ı
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (NEW.id, NEW.email, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mevcut trigger'ı sil ve yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 14. İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_children_family_id ON public.children(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON public.family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_child_id ON public.notifications(child_id);

-- 15. Storage bucket oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true) 
ON CONFLICT (id) DO NOTHING;

-- 16. Storage politikaları
DROP POLICY IF EXISTS "Users can upload documents for their children" ON storage.objects;
DROP POLICY IF EXISTS "Users can view documents of their children" ON storage.objects;

CREATE POLICY "Users can upload documents for their children" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM public.children 
            WHERE family_id IN (
                SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can view documents of their children" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM public.children 
            WHERE family_id IN (
                SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
            )
        )
    ); 