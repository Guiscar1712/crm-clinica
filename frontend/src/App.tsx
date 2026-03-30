import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Layout } from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import NewPatient from "@/pages/NewPatient";
import PatientDetail from "@/pages/PatientDetail";
import Appointments from "@/pages/Appointments";
import NewAppointment from "@/pages/NewAppointment";
import Users from "@/pages/Users";
import TenantSettings from "@/pages/TenantSettings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/new" element={<NewPatient />} />
                <Route path="/patients/:id" element={<PatientDetail />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/new" element={<NewAppointment />} />

                <Route element={<PrivateRoute requiredPermission="users:read" />}>
                  <Route path="/users" element={<Users />} />
                </Route>
                <Route element={<PrivateRoute requiredPermission="tenant:manage" />}>
                  <Route path="/settings" element={<TenantSettings />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
