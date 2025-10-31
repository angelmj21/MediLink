import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MedicalHistory from "./pages/MedicalHistory";
import Medications from "./pages/Medications";
import Clinics from "./pages/Clinics";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";   // ✅ Landing Page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ Landing Page at root - no Layout */}
          <Route path="/" element={<LandingPage />} />

          {/* ✅ Protected pages inside Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="history" element={<MedicalHistory />} />
                  <Route path="medications" element={<Medications />} />
                  <Route path="clinics" element={<Clinics />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
