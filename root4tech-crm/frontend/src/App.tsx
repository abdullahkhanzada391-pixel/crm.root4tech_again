import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CRMProvider } from '@/context/CRMContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { LeadsPage } from '@/pages/LeadsPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { QuotationsPage } from '@/pages/QuotationsPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { SalesRecordsPage } from '@/pages/SalesRecordsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TeamPage } from '@/pages/TeamPage';
import { SalesPersonPortalPage } from '@/pages/SalesPersonPortalPage';
import { MarketingManagerDashboardPage } from '@/pages/MarketingManagerDashboardPage';
import { DeveloperDashboardPage } from '@/pages/DeveloperDashboardPage';
import { HRDashboardPage } from '@/pages/HRDashboardPage';
import { DynamicRolePortalPage } from '@/pages/DynamicRolePortalPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CRMProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dedicated Sales Person Portal (accessible by Sales Person & Admin) */}
          <Route
            path="/salesperson"
            element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <SalesPersonPortalPage />
              </ProtectedRoute>
            }
          />
          <Route path="/sales-portal" element={<Navigate to="/salesperson" replace />} />
          <Route path="/portal/sales" element={<Navigate to="/salesperson" replace />} />

          {/* Dedicated Marketing Manager Dashboard (accessible by Marketing & Admin) */}
          <Route
            path="/marketing"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <MarketingManagerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/marketing-manager" element={<Navigate to="/marketing" replace />} />
          <Route path="/marketing-portal" element={<Navigate to="/marketing" replace />} />
          <Route path="/portal/marketing" element={<Navigate to="/marketing" replace />} />

          {/* Dedicated Developer Dashboard (accessible by Developer & Admin) */}
          <Route
            path="/developer"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <DeveloperDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dev" element={<Navigate to="/developer" replace />} />
          <Route path="/portal/developer" element={<Navigate to="/developer" replace />} />

          {/* Dedicated HR Dashboard (accessible by HR & Admin) */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr']}>
                <HRDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/human-resources" element={<Navigate to="/hr" replace />} />
          <Route path="/portal/hr" element={<Navigate to="/hr" replace />} />

          {/* Dynamic / Custom Role Portal (accessible by all authenticated roles) */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <DynamicRolePortalPage />
              </ProtectedRoute>
            }
          />
          <Route path="/member-dashboard" element={<Navigate to="/portal" replace />} />

          {/* Administrator CRM Layout (Restricted strictly to Admin) */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/team-members" element={<Navigate to="/team" replace />} />
            <Route path="/quotations" element={<QuotationsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/sales" element={<SalesRecordsPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </CRMProvider>
    </AuthProvider>
  );
};
