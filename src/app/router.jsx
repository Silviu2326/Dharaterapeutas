import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Loader } from '../components/Loader';

// Feature Pages
import { Login } from '../features/auth/Login';
import { Dashboard } from '../features/dashboard/Dashboard.page';
import { ProfessionalProfile } from '../features/professionalProfile/ProfessionalProfile.page';
import { Verification } from '../features/verification/Verification.page';
import { PlansSubscription } from '../features/plansSubscription/PlansSubscription.page';
import { Availability } from '../features/availability/Availability.page';
import { Bookings } from '../features/bookings/Bookings.page';
import { Clients } from '../features/clients/Clients.page';
import { ClientDetailPage } from '../features/clients/components/ClientDetailPage';
import { Chat } from '../features/chat/Chat.page';
import { DocumentsMaterials } from '../features/documentsMaterials/DocumentsMaterials.page';
import { Reviews } from '../features/reviews/Reviews.page';
import { Payments } from '../features/payments/Payments.page';
import { Notifications } from '../features/notifications/Notifications.page';
import { Integrations } from '../features/integrations/Integrations.page';
import { HelpCenter } from '../features/helpCenter/HelpCenter.page';
import { AccountSettings } from '../features/accountSettings/AccountSettings.page';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil-profesional" element={<ProfessionalProfile />} />
        <Route path="verificacion" element={<Verification />} />
        <Route path="planes-suscripcion" element={<PlansSubscription />} />
        <Route path="disponibilidad" element={<Availability />} />
        <Route path="reservas" element={<Bookings />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="clients/:clientId" element={<ClientDetailPage />} />
        <Route path="chat" element={<Chat />} />
        <Route path="documentos-materiales" element={<DocumentsMaterials />} />
        <Route path="reseñas" element={<Reviews />} />
        <Route path="pagos" element={<Payments />} />
        <Route path="notificaciones" element={<Notifications />} />
        <Route path="integraciones" element={<Integrations />} />
        <Route path="centro-ayuda" element={<HelpCenter />} />
        <Route path="configuracion-cuenta" element={<AccountSettings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};