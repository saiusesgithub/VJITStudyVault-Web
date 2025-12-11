import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client with fallback for development without env vars
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type definitions
export interface Subject {
  id: string;
  regulation: string;
  branch: string;
  year: string;
  semester: string;
  name: string;
  code?: string;
  created_at?: string;
}

export interface MaterialType {
  id: string;
  name: string;
  has_subcategory: boolean;
  icon: string; // Icon name for the UI
  created_at?: string;
}

export interface Material {
  id: string;
  subject_id: string;
  material_type_id: string;
  name: string;
  drive_url: string;
  year_optional?: string; // For PYQs subcategory
  description?: string;
  created_at?: string;
}

// Database helper functions
export const db = {
  // Get subjects based on user selections
  getSubjects: async (regulation: string, branch: string, year: string, semester: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('regulation', regulation)
      .eq('branch', branch)
      .eq('year', year)
      .eq('semester', semester)
      .order('name');
    
    if (error) throw error;
    return data as Subject[];
  },

  // Get material types
  getMaterialTypes: async () => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('material_types')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as MaterialType[];
  },

  // Get available material types for a specific subject
  getAvailableMaterialTypes: async (subjectId: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('materials')
      .select(`
        material_type_id,
        material_types (
          id,
          name,
          has_subcategory,
          icon
        )
      `)
      .eq('subject_id', subjectId);
    
    if (error) throw error;
    
    // Remove duplicates and flatten structure
    const uniqueTypes = data.reduce((acc: MaterialType[], item: any) => {
      const type = item.material_types;
      if (type && !acc.find(t => t.id === type.id)) {
        acc.push(type);
      }
      return acc;
    }, []);
    
    return uniqueTypes;
  },

  // Get materials (PDFs) for a subject and material type
  getMaterials: async (subjectId: string, materialTypeId: string, yearOptional?: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    let query = supabase
      .from('materials')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('material_type_id', materialTypeId);
    
    if (yearOptional) {
      query = query.eq('year_optional', yearOptional);
    }
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data as Material[];
  },

  // Get unique years for PYQs subcategory
  getPYQYears: async (subjectId: string, materialTypeId: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('materials')
      .select('year_optional')
      .eq('subject_id', subjectId)
      .eq('material_type_id', materialTypeId)
      .not('year_optional', 'is', null)
      .order('year_optional', { ascending: false });
    
    if (error) throw error;
    
    // Get unique years
    const uniqueYears = [...new Set(data.map(item => item.year_optional))].filter(Boolean);
    return uniqueYears as string[];
  },
};
