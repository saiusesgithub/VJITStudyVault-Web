import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// TYPES - Simple single table approach
// =====================================================

export interface Material {
  id: string;
  regulation: number;
  branch: string;
  year: number;
  sem: number;
  subject_name: string;
  credits: number;
  material_type: string;
  material_name: string;
  url: string;
  unit?: number;
  year_optional?: string;
  created_at: string;
}

export interface Subject {
  name: string;
  credits: number;
}

export interface MaterialTypeInfo {
  name: string;
  has_units: boolean;
}

// Material type configuration (hardcoded - no DB table needed)
const MATERIAL_TYPE_CONFIG: Record<string, { icon: string, has_units: boolean }> = {
  'Notes': { icon: 'FileText', has_units: true },
  'YouTube Videos': { icon: 'Youtube', has_units: false }, // Playlists open directly, no units
  'PYQs': { icon: 'Clock', has_units: false },
  'Question Bank': { icon: 'HelpCircle', has_units: false },
  'Important Questions': { icon: 'Star', has_units: false },
  'Syllabus': { icon: 'List', has_units: false },
  'Lab Manual': { icon: 'FlaskConical', has_units: false },
  'Reference Books': { icon: 'BookOpen', has_units: false },
  'PPTs': { icon: 'Presentation', has_units: false },
};

export const getMaterialTypeIcon = (typeName: string) => {
  return MATERIAL_TYPE_CONFIG[typeName]?.icon || 'FileText';
};

export const materialTypeHasUnits = (typeName: string) => {
  return MATERIAL_TYPE_CONFIG[typeName]?.has_units || false;
};

// =====================================================
// DATABASE HELPER FUNCTIONS
// =====================================================

export const db = {
  // Get unique subjects for a selection
  getSubjects: async (regulation: string, branch: string, year: string, semester: string): Promise<Subject[]> => {
    const regNum = parseInt(regulation.replace('R', ''));
    const yearNum = parseInt(year.replace(/\D/g, ''));
    const semNum = parseInt(semester.replace(/\D/g, ''));

    const { data, error } = await supabase
      .from('materials')
      .select('subject_name, credits')
      .eq('regulation', regNum)
      .eq('branch', branch)
      .eq('year', yearNum)
      .eq('sem', semNum);

    if (error) throw error;

    // Get unique subjects (same subject name = same subject)
    const uniqueSubjects = new Map<string, number>();
    data?.forEach(item => {
      uniqueSubjects.set(item.subject_name, item.credits);
    });

    return Array.from(uniqueSubjects.entries())
      .map(([name, credits]) => ({ name, credits }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  // Get available material types for a subject
  getAvailableMaterialTypes: async (
    regulation: string,
    branch: string,
    year: string,
    semester: string,
    subjectName: string
  ): Promise<MaterialTypeInfo[]> => {
    const regNum = parseInt(regulation.replace('R', ''));
    const yearNum = parseInt(year.replace(/\D/g, ''));
    const semNum = parseInt(semester.replace(/\D/g, ''));

    const { data, error } = await supabase
      .from('materials')
      .select('material_type')
      .eq('regulation', regNum)
      .eq('branch', branch)
      .eq('year', yearNum)
      .eq('sem', semNum)
      .eq('subject_name', subjectName);

    if (error) throw error;

    // Get unique material types
    const uniqueTypes = [...new Set(data?.map(item => item.material_type))];
    
    return uniqueTypes.map(name => ({
      name,
      has_units: materialTypeHasUnits(name)
    })).sort((a, b) => a.name.localeCompare(b.name));
  },

  // Get available units for Notes/YouTube
  getAvailableUnits: async (
    regulation: string,
    branch: string,
    year: string,
    semester: string,
    subjectName: string,
    materialType: string
  ): Promise<number[]> => {
    const regNum = parseInt(regulation.replace('R', ''));
    const yearNum = parseInt(year.replace(/\D/g, ''));
    const semNum = parseInt(semester.replace(/\D/g, ''));

    const { data, error } = await supabase
      .from('materials')
      .select('unit')
      .eq('regulation', regNum)
      .eq('branch', branch)
      .eq('year', yearNum)
      .eq('sem', semNum)
      .eq('subject_name', subjectName)
      .eq('material_type', materialType)
      .not('unit', 'is', null);

    if (error) throw error;

    const uniqueUnits = [...new Set(data?.map(item => item.unit).filter(Boolean))];
    return uniqueUnits.sort((a, b) => a! - b!) as number[];
  },

  // Get available years for PYQs
  getAvailableYears: async (
    regulation: string,
    branch: string,
    year: string,
    semester: string,
    subjectName: string
  ): Promise<string[]> => {
    const regNum = parseInt(regulation.replace('R', ''));
    const yearNum = parseInt(year.replace(/\D/g, ''));
    const semNum = parseInt(semester.replace(/\D/g, ''));

    const { data, error } = await supabase
      .from('materials')
      .select('year_optional')
      .eq('regulation', regNum)
      .eq('branch', branch)
      .eq('year', yearNum)
      .eq('sem', semNum)
      .eq('subject_name', subjectName)
      .eq('material_type', 'PYQs')
      .not('year_optional', 'is', null);

    if (error) throw error;

    const uniqueYears = [...new Set(data?.map(item => item.year_optional).filter(Boolean))];
    return uniqueYears.sort().reverse() as string[];
  },

  // Get materials
  getMaterials: async (
    regulation: string,
    branch: string,
    year: string,
    semester: string,
    subjectName: string,
    materialType: string,
    yearOptional?: string,
    unit?: number
  ): Promise<Material[]> => {
    const regNum = parseInt(regulation.replace('R', ''));
    const yearNum = parseInt(year.replace(/\D/g, ''));
    const semNum = parseInt(semester.replace(/\D/g, ''));

    let query = supabase
      .from('materials')
      .select('*')
      .eq('regulation', regNum)
      .eq('branch', branch)
      .eq('year', yearNum)
      .eq('sem', semNum)
      .eq('subject_name', subjectName)
      .eq('material_type', materialType);

    // Only filter by year_optional if provided and not empty (for PYQs with specific years)
    if (yearOptional && yearOptional.trim() !== '') {
      query = query.eq('year_optional', yearOptional);
    }

    // Only filter by unit if provided (for Notes/Videos with units)
    if (unit !== undefined) {
      query = query.eq('unit', unit);
    }

    const { data, error } = await query.order('material_name');

    if (error) throw error;
    return data || [];
  }
};
