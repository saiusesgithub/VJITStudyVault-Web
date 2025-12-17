import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoredSelections, saveSelection, clearSelections } from '@/lib/storage';

interface NavigationState {
  regulation: string | null;
  branch: string | null;
  year: string | null;
  semester: string | null;
  subject: string | null;
  subjectId: string | null;
  materialType: string | null;
  materialTypeId: string | null;
  selectedUnit: number | null;  // For Notes/YouTube Videos
}

interface NavigationContextType {
  state: NavigationState;
  setRegulation: (value: string) => void;
  setBranch: (value: string) => void;
  setYear: (value: string) => void;
  setSemester: (value: string) => void;
  setSubject: (value: string, id: string) => void;
  setMaterialType: (value: string, id: string, hasUnits: boolean) => void;
  setSelectedUnit: (unit: number) => void;
  reset: () => void;
  getBreadcrumb: () => string;
}

const initialState: NavigationState = {
  regulation: null,
  branch: null,
  year: null,
  semester: null,
  subject: null,
  subjectId: null,
  materialType: null,
  materialTypeId: null,
  selectedUnit: null,
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>(() => {
    // Load from localStorage on init
    return { ...initialState, ...getStoredSelections() };
  });

  const setRegulation = (value: string) => {
    setState(prev => ({ ...prev, regulation: value }));
    saveSelection('regulation', value);
  };

  const setBranch = (value: string) => {
    setState(prev => ({ ...prev, branch: value }));
    saveSelection('branch', value);
  };

  const setYear = (value: string) => {
    setState(prev => ({ ...prev, year: value }));
    saveSelection('year', value);
  };

  const setSemester = (value: string) => {
    setState(prev => ({ ...prev, semester: value }));
    saveSelection('semester', value);
  };

  const setSubject = (value: string, id: string) => {
    setState(prev => ({ ...prev, subject: value, subjectId: id }));
    saveSelection('subject', value);
    saveSelection('subjectId', id);
  };

  const setMaterialType = (value: string, id: string, hasUnits: boolean) => {
    setState(prev => ({ ...prev, materialType: value, materialTypeId: id }));
    saveSelection('materialType', value);
    saveSelection('materialTypeId', id);
    // Clear selected unit when changing material type
    if (!hasUnits) {
      setState(prev => ({ ...prev, selectedUnit: null }));
      saveSelection('selectedUnit', null);
    }
  };

  const setSelectedUnit = (unit: number) => {
    setState(prev => ({ ...prev, selectedUnit: unit }));
    saveSelection('selectedUnit', unit.toString());
  };

  const reset = () => {
    setState(initialState);
    clearSelections();
  };

  const getBreadcrumb = () => {
    const parts = [state.regulation, state.branch, state.year, state.semester].filter(Boolean);
    return parts.join(' • ');
  };

  return (
    <NavigationContext.Provider value={{
      state,
      setRegulation,
      setBranch,
      setYear,
      setSemester,
      setSubject,
      setMaterialType,
      setSelectedUnit,
      reset,
      getBreadcrumb,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
