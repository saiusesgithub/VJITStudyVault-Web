import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Component to reset focus on route change
const FocusResetter = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Remove focus from any active element when route changes
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location.pathname]);
  
  return null;
};

import RegulationSelection from "./pages/RegulationSelection";
import BranchSelection from "./pages/BranchSelection";
import YearSelection from "./pages/YearSelection";
import SemesterSelection from "./pages/SemesterSelection";
import SubjectSelection from "./pages/SubjectSelection";
import MaterialTypeSelection from "./pages/MaterialTypeSelection";
import SubCategoryPage from "./pages/SubCategoryPage";
import UnitSelection from "./pages/UnitSelection";
import PDFListPage from "./pages/PDFListPage";
import Labs from "./pages/Labs";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import Contribute from "./pages/Contribute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <BrowserRouter>
            <FocusResetter />
            <GoogleAnalytics />
            <Routes>
              <Route path="/" element={<RegulationSelection />} />
              <Route path="/:regulation" element={<BranchSelection />} />
              <Route path="/:regulation/:branch" element={<YearSelection />} />
              <Route path="/:regulation/:branch/:year" element={<SemesterSelection />} />
              <Route path="/:regulation/:branch/:year/:semester" element={<SubjectSelection />} />
              <Route path="/:regulation/:branch/:year/:semester/:subject" element={<MaterialTypeSelection />} />
              <Route path="/:regulation/:branch/:year/:semester/:subject/:materialType/units" element={<UnitSelection />} />
              <Route path="/:regulation/:branch/:year/:semester/:subject/:materialType/units/:unit" element={<PDFListPage />} />
              <Route path="/:regulation/:branch/:year/:semester/:subject/:materialType/years" element={<SubCategoryPage />} />
              <Route path="/:regulation/:branch/:year/:semester/:subject/:materialType/years/:yearOptional" element={<PDFListPage />} />
              <Route path="/:regulation/:branch/:year/:semester/:subject/:materialType" element={<PDFListPage />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/contribute" element={<Contribute />} />
              <Route path="/saisrujan" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
