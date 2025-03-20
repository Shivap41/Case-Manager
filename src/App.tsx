
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CaseProvider } from "./context/CaseContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateCase from "./pages/CreateCase";
import CaseDetail from "./pages/CaseDetail";
import Tasks from "./pages/Tasks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CaseProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-case" element={<CreateCase />} />
            <Route path="/case/:id" element={<CaseDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            {/* Add a redirect for the /cases route to the home page */}
            <Route path="/cases" element={<Navigate to="/" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
