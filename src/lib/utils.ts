import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://depfqznkdpsqcnbxmzij.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcGZxem5rZHBzcWNuYnhtemlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Nzk3NjYsImV4cCI6MjA2NzE1NTc2Nn0.InxViBocXOni7tYPDPCA9bw9QMulzPkT6Iypl4vB7eg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
