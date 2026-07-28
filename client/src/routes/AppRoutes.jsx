import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
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
      {/* Public landing and auth routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes wrapped in DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/roi-history" element={<ROIHistoryPage />} />
        <Route path="/referral-income" element={<ReferralIncomePage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
      </Route>

      {/* Catch-all route redirects to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
