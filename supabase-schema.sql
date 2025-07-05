-- Supabase Database Schema for Mini Sağlık Takipçi
-- Bu dosya Supabase SQL Editor'da çalıştırılmalıdır

-- Supabase Database Schema for Mini Sağlık Takipçi
-- Bu dosya Supabase SQL Editor'da çalıştırılmalıdır

-- Create tables
-- 1. Families table
CREATE TABLE IF NOT EXISTS families (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Family members table (users in families)
CREATE TABLE IF NOT EXISTS family_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('parent', 'guardian', 'caregiver', 'other')),
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- 3. Children table
CREATE TABLE IF NOT EXISTS children (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    allergies TEXT,
    medications TEXT,
    conditions TEXT,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    birth_date DATE,
    photo_url TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('medication', 'appointment', 'temperature', 'routine', 'growth', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_important BOOLEAN DEFAULT FALSE,
    action VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Daily routines table
CREATE TABLE IF NOT EXISTS daily_routines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('sleep', 'hygiene', 'activities', 'mood')),
    activity VARCHAR(50) NOT NULL,
    time TIME NOT NULL,
    duration INTEGER, -- minutes
    mood VARCHAR(20) CHECK (mood IN ('very_happy', 'happy', 'normal', 'sad', 'angry', 'energetic')),
    quality VARCHAR(20) CHECK (quality IN ('excellent', 'good', 'average', 'poor', 'very_poor')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Growth records table
CREATE TABLE IF NOT EXISTS growth_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    head_circumference DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255),
    date DATE NOT NULL,
    time TIME,
    reason TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Seizure records table
CREATE TABLE IF NOT EXISTS seizure_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME,
    duration INTEGER NOT NULL, -- seconds (changed from minutes)
    type VARCHAR(50) NOT NULL,
    symptoms TEXT,
    post_seizure_state TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Allergies table
CREATE TABLE IF NOT EXISTS allergies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
    symptoms TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Health history table
CREATE TABLE IF NOT EXISTS health_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    condition VARCHAR(255) NOT NULL,
    diagnosis_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'chronic')),
    description TEXT NOT NULL,
    treatment TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Physical activities table
CREATE TABLE IF NOT EXISTS physical_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    intensity VARCHAR(20) CHECK (intensity IN ('low', 'moderate', 'high')),
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    test_type VARCHAR(50) NOT NULL,
    test_date DATE NOT NULL,
    result_summary TEXT NOT NULL,
    normal_range VARCHAR(100),
    actual_value VARCHAR(100),
    doctor_notes TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME,
    description TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'missed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Medication records table
CREATE TABLE IF NOT EXISTS medication_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Nutrition records table
CREATE TABLE IF NOT EXISTS nutrition_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    meal_type VARCHAR(50),
    food_items TEXT,
    quantity VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Temperature records table
CREATE TABLE IF NOT EXISTS temperature_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    temperature DECIMAL(4,1) NOT NULL,
    date DATE NOT NULL,
    time TIME,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE seizure_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_records ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Families policies
CREATE POLICY "Users can view families they belong to" ON families
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = families.id 
            AND family_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert families" ON families
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update families they belong to" ON families
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = families.id 
            AND family_members.user_id = auth.uid()
            AND family_members.is_primary = true
        )
    );

CREATE POLICY "Users can delete families they belong to" ON families
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = families.id 
            AND family_members.user_id = auth.uid()
            AND family_members.is_primary = true
        )
    );

-- Family members policies
CREATE POLICY "Users can view family members of their families" ON family_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = family_members.family_id 
            AND fm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert family members to their families" ON family_members
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = family_members.family_id 
            AND fm.user_id = auth.uid()
            AND fm.is_primary = true
        )
    );

CREATE POLICY "Users can update family members of their families" ON family_members
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = family_members.family_id 
            AND fm.user_id = auth.uid()
            AND fm.is_primary = true
        )
    );

CREATE POLICY "Users can delete family members of their families" ON family_members
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = family_members.family_id 
            AND fm.user_id = auth.uid()
            AND fm.is_primary = true
        )
    );

-- Children policies (updated to use family_id)
CREATE POLICY "Users can view children of their families" ON children
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = children.family_id 
            AND family_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert children to their families" ON children
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = children.family_id 
            AND family_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update children of their families" ON children
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = children.family_id 
            AND family_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete children of their families" ON children
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM family_members 
            WHERE family_members.family_id = children.family_id 
            AND family_members.user_id = auth.uid()
        )
    );

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Daily routines policies
CREATE POLICY "Users can view daily routines of their children" ON daily_routines
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = daily_routines.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert daily routines for their children" ON daily_routines
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = daily_routines.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update daily routines of their children" ON daily_routines
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = daily_routines.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete daily routines of their children" ON daily_routines
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = daily_routines.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Growth records policies
CREATE POLICY "Users can view growth records of their children" ON growth_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = growth_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert growth records for their children" ON growth_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = growth_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update growth records of their children" ON growth_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = growth_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete growth records of their children" ON growth_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = growth_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Doctors policies
CREATE POLICY "Users can view doctors of their children" ON doctors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = doctors.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert doctors for their children" ON doctors
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = doctors.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update doctors of their children" ON doctors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = doctors.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete doctors of their children" ON doctors
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = doctors.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Appointments policies
CREATE POLICY "Users can view appointments of their children" ON appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = appointments.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert appointments for their children" ON appointments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = appointments.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update appointments of their children" ON appointments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = appointments.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete appointments of their children" ON appointments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = appointments.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Seizure records policies
CREATE POLICY "Users can view seizure records of their children" ON seizure_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = seizure_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert seizure records for their children" ON seizure_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = seizure_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update seizure records of their children" ON seizure_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = seizure_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete seizure records of their children" ON seizure_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = seizure_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Allergies policies
CREATE POLICY "Users can view allergies of their children" ON allergies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = allergies.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert allergies for their children" ON allergies
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = allergies.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update allergies of their children" ON allergies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = allergies.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete allergies of their children" ON allergies
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = allergies.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Health history policies
CREATE POLICY "Users can view health history of their children" ON health_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = health_history.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert health history for their children" ON health_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = health_history.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update health history of their children" ON health_history
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = health_history.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete health history of their children" ON health_history
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = health_history.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Physical activities policies
CREATE POLICY "Users can view physical activities of their children" ON physical_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = physical_activities.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert physical activities for their children" ON physical_activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = physical_activities.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update physical activities of their children" ON physical_activities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = physical_activities.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete physical activities of their children" ON physical_activities
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = physical_activities.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Test results policies
CREATE POLICY "Users can view test results of their children" ON test_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = test_results.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert test results for their children" ON test_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = test_results.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update test results of their children" ON test_results
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = test_results.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete test results of their children" ON test_results
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = test_results.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Calendar events policies
CREATE POLICY "Users can view calendar events of their children" ON calendar_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = calendar_events.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert calendar events for their children" ON calendar_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = calendar_events.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update calendar events of their children" ON calendar_events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = calendar_events.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete calendar events of their children" ON calendar_events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = calendar_events.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Medication records policies
CREATE POLICY "Users can view medication records of their children" ON medication_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = medication_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert medication records for their children" ON medication_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = medication_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update medication records of their children" ON medication_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = medication_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete medication records of their children" ON medication_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = medication_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Nutrition records policies
CREATE POLICY "Users can view nutrition records of their children" ON nutrition_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = nutrition_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert nutrition records for their children" ON nutrition_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = nutrition_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update nutrition records of their children" ON nutrition_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = nutrition_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete nutrition records of their children" ON nutrition_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = nutrition_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Temperature records policies
CREATE POLICY "Users can view temperature records of their children" ON temperature_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = temperature_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert temperature records for their children" ON temperature_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = temperature_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update temperature records of their children" ON temperature_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = temperature_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete temperature records of their children" ON temperature_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM children 
            WHERE children.id = temperature_records.child_id 
            AND children.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_families_name ON families(name);
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_children_family_id ON children(family_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_child_id ON notifications(child_id);
CREATE INDEX IF NOT EXISTS idx_daily_routines_child_id ON daily_routines(child_id);
CREATE INDEX IF NOT EXISTS idx_daily_routines_date ON daily_routines(date);
CREATE INDEX IF NOT EXISTS idx_growth_records_child_id ON growth_records(child_id);
CREATE INDEX IF NOT EXISTS idx_doctors_child_id ON doctors(child_id);
CREATE INDEX IF NOT EXISTS idx_appointments_child_id ON appointments(child_id);
CREATE INDEX IF NOT EXISTS idx_seizure_records_child_id ON seizure_records(child_id);
CREATE INDEX IF NOT EXISTS idx_allergies_child_id ON allergies(child_id);
CREATE INDEX IF NOT EXISTS idx_health_history_child_id ON health_history(child_id);
CREATE INDEX IF NOT EXISTS idx_physical_activities_child_id ON physical_activities(child_id);
CREATE INDEX IF NOT EXISTS idx_test_results_child_id ON test_results(child_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_child_id ON calendar_events(child_id);
CREATE INDEX IF NOT EXISTS idx_medication_records_child_id ON medication_records(child_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_records_child_id ON nutrition_records(child_id);
CREATE INDEX IF NOT EXISTS idx_temperature_records_child_id ON temperature_records(child_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Create storage policies
CREATE POLICY "Users can upload documents for their children" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM children WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view documents of their children" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM children WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update documents of their children" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM children WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete documents of their children" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM children WHERE user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for families table
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for children table
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for user_profiles table
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Yeni kullanıcı kaydolduğunda user_profiles tablosuna otomatik olarak veri ekle
-- Mevcut trigger'ı sil (eğer varsa)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger fonksiyonunu sil/yeniden oluştur
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name, email)
  VALUES (NEW.id, NEW.email, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı bağla: auth.users tablosuna yeni bir kayıt eklendiğinde çalışacak.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===== SAĞLIK TAKİP UYGULAMASI İÇİN GEREKLİ TRİGGERLER =====

-- 1. İlaç Hatırlatıcıları için Trigger
CREATE OR REPLACE FUNCTION create_medication_reminder()
RETURNS TRIGGER AS $$
BEGIN
    -- İlaç kaydı eklendiğinde otomatik bildirim oluştur
    INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
    SELECT 
        c.user_id,
        NEW.child_id,
        'medication',
        'İlaç Hatırlatıcısı',
        'İlaç zamanı: ' || NEW.medication_name,
        true
    FROM children c WHERE c.id = NEW.child_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_medication_reminder 
    AFTER INSERT ON medication_records
    FOR EACH ROW EXECUTE FUNCTION create_medication_reminder();

-- 2. Randevu Hatırlatıcıları
CREATE OR REPLACE FUNCTION create_appointment_reminder()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
    SELECT 
        c.user_id,
        NEW.child_id,
        'appointment',
        'Randevu Hatırlatıcısı',
        'Yarın ' || COALESCE(NEW.time::text, 'belirtilmemiş saat') || ' saatinde ' || COALESCE(NEW.doctor_name, 'doktor') || ' ile randevunuz var',
        true
    FROM children c WHERE c.id = NEW.child_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_appointment_reminder 
    AFTER INSERT ON appointments
    FOR EACH ROW EXECUTE FUNCTION create_appointment_reminder();

-- 3. Ateş Uyarı Triggeri
CREATE OR REPLACE FUNCTION check_temperature_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.temperature > 38.0 THEN
        INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
        SELECT 
            c.user_id,
            NEW.child_id,
            'temperature',
            'Yüksek Ateş Uyarısı',
            'Ateş: ' || NEW.temperature || '°C - Doktora başvurunuz',
            true
        FROM children c WHERE c.id = NEW.child_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_temperature_alert 
    AFTER INSERT ON temperature_records
    FOR EACH ROW EXECUTE FUNCTION check_temperature_alert();

-- 4. Büyüme Takibi Triggeri
CREATE OR REPLACE FUNCTION analyze_growth_pattern()
RETURNS TRIGGER AS $$
DECLARE
    prev_weight DECIMAL(5,2);
    weight_change DECIMAL(5,2);
BEGIN
    -- Önceki ağırlık kaydını al
    SELECT weight INTO prev_weight 
    FROM growth_records 
    WHERE child_id = NEW.child_id 
    AND date < NEW.date 
    ORDER BY date DESC 
    LIMIT 1;
    
    IF prev_weight IS NOT NULL AND NEW.weight IS NOT NULL THEN
        weight_change := NEW.weight - prev_weight;
        
        -- Aşırı kilo kaybı/gain durumunda uyarı
        IF ABS(weight_change) > 2.0 THEN
            INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
            SELECT 
                c.user_id,
                NEW.child_id,
                'growth',
                'Büyüme Değişikliği',
                'Son ölçümde ' || 
                CASE WHEN weight_change > 0 THEN '+' ELSE '' END || 
                weight_change || ' kg değişim tespit edildi',
                true
            FROM children c WHERE c.id = NEW.child_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_growth_analysis 
    AFTER INSERT ON growth_records
    FOR EACH ROW EXECUTE FUNCTION analyze_growth_pattern();

-- 5. Nöbet Kaydı Triggeri
CREATE OR REPLACE FUNCTION create_seizure_alert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
    SELECT 
        c.user_id,
        NEW.child_id,
        'system',
        'Nöbet Kaydı',
        NEW.duration || ' saniye süren ' || NEW.type || ' nöbeti kaydedildi',
        true
    FROM children c WHERE c.id = NEW.child_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_seizure_alert 
    AFTER INSERT ON seizure_records
    FOR EACH ROW EXECUTE FUNCTION create_seizure_alert();

-- 6. Aile Üyesi Ekleme Triggeri
CREATE OR REPLACE FUNCTION welcome_family_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
    SELECT 
        NEW.user_id,
        c.id,
        'system',
        'Hoş Geldiniz',
        'Aile grubuna başarıyla katıldınız',
        false
    FROM children c 
    WHERE c.family_id = NEW.family_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_welcome_member 
    AFTER INSERT ON family_members
    FOR EACH ROW EXECUTE FUNCTION welcome_family_member();

-- 7. Eksik Updated_at Triggerleri
CREATE TRIGGER update_medication_records_updated_at BEFORE UPDATE ON medication_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_records_updated_at BEFORE UPDATE ON nutrition_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_temperature_records_updated_at BEFORE UPDATE ON temperature_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_growth_records_updated_at BEFORE UPDATE ON growth_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_routines_updated_at BEFORE UPDATE ON daily_routines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seizure_records_updated_at BEFORE UPDATE ON seizure_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_allergies_updated_at BEFORE UPDATE ON allergies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_history_updated_at BEFORE UPDATE ON health_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_physical_activities_updated_at BEFORE UPDATE ON physical_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at BEFORE UPDATE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Günlük Rutin Hatırlatıcısı
CREATE OR REPLACE FUNCTION create_routine_reminder()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
    SELECT 
        c.user_id,
        NEW.child_id,
        'routine',
        'Günlük Rutin Hatırlatıcısı',
        NEW.activity || ' aktivitesi zamanı geldi',
        false
    FROM children c WHERE c.id = NEW.child_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_routine_reminder 
    AFTER INSERT ON daily_routines
    FOR EACH ROW EXECUTE FUNCTION create_routine_reminder();

-- 9. Alerji Uyarısı
CREATE OR REPLACE FUNCTION create_allergy_alert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, child_id, type, title, message, is_important)
    SELECT 
        c.user_id,
        NEW.child_id,
        'system',
        'Yeni Alerji Kaydı',
        NEW.name || ' alerjisi eklendi. Şiddet: ' || COALESCE(NEW.severity, 'belirtilmemiş'),
        true
    FROM children c WHERE c.id = NEW.child_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_allergy_alert 
    AFTER INSERT ON allergies
    FOR EACH ROW EXECUTE FUNCTION create_allergy_alert(); 