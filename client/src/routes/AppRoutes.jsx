import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import InvestmentsPage from '../pages/InvestmentsPage.jsx';
import ROIHistoryPage from '../pages/ROIHistoryPage.jsx';
import ReferralIncomePage from '../pages/ReferralIncomePage.jsx';
import ReferralsPage from '../pages/ReferralsPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with dashboard layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="investments" element={<InvestmentsPage />} />
        <Route path="roi-history" element={<ROIHistoryPage />} />
        <Route path="referral-income" element={<ReferralIncomePage />} />
        <Route path="referrals" element={<ReferralsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
