// LocalStorage utility functions for persisting user selections

const STORAGE_KEY = 'vjit-study-vault';

export interface StoredSelections {
  regulation: string | null;
  branch: string | null;
  year: string | null;
  semester: string | null;
  subject: string | null;
  materialType: string | null;
  selectedUnit: number | null;
  yearOptional: string | null; // For PYQ year filter
}

const defaultSelections: StoredSelections = {
  regulation: null,
  branch: null,
  year: null,
  semester: null,
  subject: null,
  materialType: null,
  selectedUnit: null,
  yearOptional: null,
};

// Cleanup function to fix corrupted localStorage from previous versions
export const cleanupStoredSelections = (): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Fix empty string yearOptional (should be null)
      if (data.yearOptional === '') {
        data.yearOptional = null;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    }
  } catch (error) {
    console.error('Error cleaning localStorage:', error);
  }
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
