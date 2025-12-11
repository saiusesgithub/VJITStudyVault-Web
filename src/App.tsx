import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationProvider } from "@/contexts/NavigationContext";

import RegulationSelection from "./pages/RegulationSelection";
import BranchSelection from "./pages/BranchSelection";
import YearSelection from "./pages/YearSelection";
import SemesterSelection from "./pages/SemesterSelection";
import SubjectSelection from "./pages/SubjectSelection";
import MaterialTypeSelection from "./pages/MaterialTypeSelection";
import SubCategoryPage from "./pages/SubCategoryPage";
import PDFListPage from "./pages/PDFListPage";
import Labs from "./pages/Labs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <NavigationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RegulationSelection />} />
              <Route path="/branch" element={<BranchSelection />} />
              <Route path="/year" element={<YearSelection />} />
              <Route path="/semester" element={<SemesterSelection />} />
              <Route path="/subjects" element={<SubjectSelection />} />
              <Route path="/materials" element={<MaterialTypeSelection />} />
              <Route path="/subcategory" element={<SubCategoryPage />} />
              <Route path="/pdfs" element={<PDFListPage />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NavigationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
