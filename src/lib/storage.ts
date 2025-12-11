// LocalStorage utility functions for persisting user selections

const STORAGE_KEY = 'vjit-study-vault';

export interface StoredSelections {
  regulation: string | null;
  branch: string | null;
  year: string | null;
  semester: string | null;
  subject: string | null;
  subjectId: string | null; // Store subject ID for fetching materials
  materialType: string | null;
  materialTypeId: string | null; // Store material type ID
  yearOptional: string | null; // For PYQ year filter
}

const defaultSelections: StoredSelections = {
  regulation: null,
  branch: null,
  year: null,
  semester: null,
  subject: null,
  subjectId: null,
  materialType: null,
  materialTypeId: null,
  yearOptional: null,
};

// Get all selections from localStorage
export const getStoredSelections = (): StoredSelections => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSelections, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return defaultSelections;
};

// Save all selections to localStorage
export const saveSelections = (selections: Partial<StoredSelections>): void => {
  try {
    const current = getStoredSelections();
    const updated = { ...current, ...selections };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Save a single selection
export const saveSelection = (key: keyof StoredSelections, value: string | null): void => {
  saveSelections({ [key]: value });
};

// Clear all selections
export const clearSelections = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Get a specific selection
export const getSelection = (key: keyof StoredSelections): string | null => {
  const selections = getStoredSelections();
  return selections[key];
};
