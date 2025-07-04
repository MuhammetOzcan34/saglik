import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: 'parent' | 'guardian' | 'caregiver' | 'other'
          relationship: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role: 'parent' | 'guardian' | 'caregiver' | 'other'
          relationship?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          role?: 'parent' | 'guardian' | 'caregiver' | 'other'
          relationship?: string | null
          is_primary?: boolean
          created_at?: string
        }
      }
      children: {
        Row: {
          id: string
          family_id: string
          name: string
          birth_date: string
          gender: 'male' | 'female' | 'other'
          weight: number | null
          height: number | null
          allergies: string | null
          medications: string | null
          conditions: string | null
          notes: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          birth_date: string
          gender: 'male' | 'female' | 'other'
          weight?: number | null
          height?: number | null
          allergies?: string | null
          medications?: string | null
          conditions?: string | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          birth_date?: string
          gender?: 'male' | 'female' | 'other'
          weight?: number | null
          height?: number | null
          allergies?: string | null
          medications?: string | null
          conditions?: string | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          birth_date: string | null
          photo_url: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          birth_date?: string | null
          photo_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          birth_date?: string | null
          photo_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          child_id: string | null
          type: 'medication' | 'appointment' | 'temperature' | 'routine' | 'growth' | 'system'
          title: string
          message: string
          is_read: boolean
          is_important: boolean
          action: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          child_id?: string | null
          type: 'medication' | 'appointment' | 'temperature' | 'routine' | 'growth' | 'system'
          title: string
          message: string
          is_read?: boolean
          is_important?: boolean
          action?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          child_id?: string | null
          type?: 'medication' | 'appointment' | 'temperature' | 'routine' | 'growth' | 'system'
          title?: string
          message?: string
          is_read?: boolean
          is_important?: boolean
          action?: string | null
          created_at?: string
        }
      }
      daily_routines: {
        Row: {
          id: string
          child_id: string
          date: string
          category: 'sleep' | 'hygiene' | 'activities' | 'mood'
          activity: string
          time: string
          duration: number | null
          mood: 'very_happy' | 'happy' | 'normal' | 'sad' | 'angry' | 'energetic' | null
          quality: 'excellent' | 'good' | 'average' | 'poor' | 'very_poor' | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          date: string
          category: 'sleep' | 'hygiene' | 'activities' | 'mood'
          activity: string
          time: string
          duration?: number | null
          mood?: 'very_happy' | 'happy' | 'normal' | 'sad' | 'angry' | 'energetic' | null
          quality?: 'excellent' | 'good' | 'average' | 'poor' | 'very_poor' | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          date?: string
          category?: 'sleep' | 'hygiene' | 'activities' | 'mood'
          activity?: string
          time?: string
          duration?: number | null
          mood?: 'very_happy' | 'happy' | 'normal' | 'sad' | 'angry' | 'energetic' | null
          quality?: 'excellent' | 'good' | 'average' | 'poor' | 'very_poor' | null
          notes?: string | null
          created_at?: string
        }
      }
      growth_records: {
        Row: {
          id: string
          child_id: string
          date: string
          weight: number | null
          height: number | null
          head_circumference: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          date: string
          weight?: number | null
          height?: number | null
          head_circumference?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          date?: string
          weight?: number | null
          height?: number | null
          head_circumference?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          child_id: string
          name: string
          specialty: string | null
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          name: string
          specialty?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          name?: string
          specialty?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          child_id: string
          doctor_id: string | null
          doctor_name: string | null
          date: string
          time: string | null
          reason: string | null
          notes: string | null
          status: 'scheduled' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          doctor_id?: string | null
          doctor_name?: string | null
          date: string
          time?: string | null
          reason?: string | null
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          doctor_id?: string | null
          doctor_name?: string | null
          date?: string
          time?: string | null
          reason?: string | null
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      seizure_records: {
        Row: {
          id: string
          child_id: string
          date: string
          time: string | null
          duration: number
          type: string
          symptoms: string | null
          post_seizure_state: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          date: string
          time?: string | null
          duration: number
          type: string
          symptoms?: string | null
          post_seizure_state?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          date?: string
          time?: string | null
          duration?: number
          type?: string
          symptoms?: string | null
          post_seizure_state?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      allergies: {
        Row: {
          id: string
          child_id: string
          type: string
          name: string
          severity: 'mild' | 'moderate' | 'severe' | null
          symptoms: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          type: string
          name: string
          severity?: 'mild' | 'moderate' | 'severe' | null
          symptoms?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          type?: string
          name?: string
          severity?: 'mild' | 'moderate' | 'severe' | null
          symptoms?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      health_history: {
        Row: {
          id: string
          child_id: string
          condition: string
          diagnosis_date: string
          status: 'active' | 'resolved' | 'chronic'
          description: string
          treatment: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          condition: string
          diagnosis_date: string
          status?: 'active' | 'resolved' | 'chronic'
          description: string
          treatment?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          condition?: string
          diagnosis_date?: string
          status?: 'active' | 'resolved' | 'chronic'
          description?: string
          treatment?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      physical_activities: {
        Row: {
          id: string
          child_id: string
          date: string
          activity_type: string
          duration: number
          intensity: 'low' | 'moderate' | 'high' | null
          description: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          date: string
          activity_type: string
          duration: number
          intensity?: 'low' | 'moderate' | 'high' | null
          description?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          date?: string
          activity_type?: string
          duration?: number
          intensity?: 'low' | 'moderate' | 'high' | null
          description?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          child_id: string
          test_type: string
          test_date: string
          result_summary: string
          normal_range: string | null
          actual_value: string | null
          doctor_notes: string | null
          file_url: string | null
          file_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          test_type: string
          test_date: string
          result_summary: string
          normal_range?: string | null
          actual_value?: string | null
          doctor_notes?: string | null
          file_url?: string | null
          file_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          test_type?: string
          test_date?: string
          result_summary?: string
          normal_range?: string | null
          actual_value?: string | null
          doctor_notes?: string | null
          file_url?: string | null
          file_name?: string | null
          created_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          child_id: string
          type: string
          title: string
          date: string
          time: string | null
          description: string | null
          notes: string | null
          status: 'pending' | 'completed' | 'missed'
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          type: string
          title: string
          date: string
          time?: string | null
          description?: string | null
          notes?: string | null
          status?: 'pending' | 'completed' | 'missed'
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          type?: string
          title?: string
          date?: string
          time?: string | null
          description?: string | null
          notes?: string | null
          status?: 'pending' | 'completed' | 'missed'
          created_at?: string
        }
      }
      medication_records: {
        Row: {
          id: string
          child_id: string
          medication_name: string
          dosage: string | null
          frequency: string | null
          start_date: string | null
          end_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          medication_name: string
          dosage?: string | null
          frequency?: string | null
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          medication_name?: string
          dosage?: string | null
          frequency?: string | null
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      nutrition_records: {
        Row: {
          id: string
          child_id: string
          meal_type: string | null
          food_items: string | null
          quantity: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          meal_type?: string | null
          food_items?: string | null
          quantity?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          meal_type?: string | null
          food_items?: string | null
          quantity?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      temperature_records: {
        Row: {
          id: string
          child_id: string
          temperature: number
          date: string
          time: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          temperature: number
          date: string
          time?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          temperature?: number
          date?: string
          time?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
} 