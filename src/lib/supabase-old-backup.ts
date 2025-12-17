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
  regulation: number;  // 22, 25
  branch: string;
  year: number;  // 1, 2, 3, 4
  sem: number;  // 1, 2
  name: string;
  credits: number;
  created_at?: string;
}

export interface MaterialType {
  id: string;
  name: string;
  has_units: boolean;  // TRUE for Notes and YouTube Videos
  icon: string;
  created_at?: string;
}

export interface Material {
  id: string;
  subject_id: string;
  material_type_id: string;
  name: string;
  url: string;  // Drive URL or YouTube URL
  unit?: number;  // For Notes/YouTube Videos: 1, 2, 3, etc.
  year_optional?: string;  // For PYQs: '2024', '2023', etc.
  created_at?: string;
}

// Database helper functions
export const db = {
  // Get subjects based on user selections
  getSubjects: async (regulation: string, branch: string, year: string, semester: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    // Convert string values to numbers for new schema
    const regNum = parseInt(regulation.replace('R', ''));
    const yearNum = parseInt(year.replace(/\D/g, ''));
    const semNum = parseInt(semester.replace(/\D/g, ''));
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('regulation', regNum)
      .eq('branch', branch)
      .eq('year', yearNum)
      .eq('sem', semNum)
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
          has_units,
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

  // Get available units for Notes or YouTube Videos
  getAvailableUnits: async (subjectId: string, materialTypeId: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('materials')
      .select('unit')
      .eq('subject_id', subjectId)
      .eq('material_type_id', materialTypeId)
      .not('unit', 'is', null)
      .order('unit');
    
    if (error) throw error;
    
    // Get unique units
    const uniqueUnits = [...new Set(data.map(item => item.unit))].filter(Boolean);
    return uniqueUnits.sort((a, b) => a! - b!) as number[];
  },

  // Get materials (PDFs/Videos) for a subject and material type
  getMaterials: async (subjectId: string, materialTypeId: string, unit?: number, yearOptional?: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    let query = supabase
      .from('materials')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('material_type_id', materialTypeId);
    
    if (unit !== undefined) {
      query = query.eq('unit', unit);
    }
    
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
    
    const { data, error} = await supabase
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
