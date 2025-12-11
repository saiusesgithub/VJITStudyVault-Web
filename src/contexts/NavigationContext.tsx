import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationState {
  regulation: string | null;
  branch: string | null;
  year: string | null;
  semester: string | null;
  subject: string | null;
  materialType: string | null;
}

interface NavigationContextType {
  state: NavigationState;
  setRegulation: (value: string) => void;
  setBranch: (value: string) => void;
  setYear: (value: string) => void;
  setSemester: (value: string) => void;
  setSubject: (value: string) => void;
  setMaterialType: (value: string) => void;
  reset: () => void;
  getBreadcrumb: () => string;
}

const initialState: NavigationState = {
  regulation: null,
  branch: null,
  year: null,
  semester: null,
  subject: null,
  materialType: null,
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>(initialState);

  const setRegulation = (value: string) => setState(prev => ({ ...prev, regulation: value }));
  const setBranch = (value: string) => setState(prev => ({ ...prev, branch: value }));
  const setYear = (value: string) => setState(prev => ({ ...prev, year: value }));
  const setSemester = (value: string) => setState(prev => ({ ...prev, semester: value }));
  const setSubject = (value: string) => setState(prev => ({ ...prev, subject: value }));
  const setMaterialType = (value: string) => setState(prev => ({ ...prev, materialType: value }));
  const reset = () => setState(initialState);

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
