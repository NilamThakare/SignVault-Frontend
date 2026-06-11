import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
import SuperAdminRoute from './routes/SuperAdminRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailOtpPage from './pages/EmailOtpPage';
import PhoneOtpPage from './pages/PhoneOtpPage';
import FingerprintPage from './pages/FingerprintPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import Dashboard from './pages/Dashboard';
import CreateContractPage from './pages/CreateContractPage';
import MyContractsPage from './pages/MyContractsPage';
import ContractDetailPage from './pages/ContractDetailPage';
import VerifyContractPage from './pages/VerifyContractPage';
import MailboxInboxPage from './pages/MailboxInboxPage';
import MailboxOutboxPage from './pages/MailboxOutboxPage';
import NotificationsPage from './pages/NotificationsPage';
import VaultPage from './pages/VaultPage';
import ProfilePage from './pages/ProfilePage';
import AuditLogPage from './pages/AuditLogPage';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminPage from './pages/SuperAdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* Public */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/verify/email" element={<EmailOtpPage />} />
          <Route path="/verify/phone" element={<PhoneOtpPage />} />
          <Route path="/register/fingerprint" element={<FingerprintPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/verify/:contractId" element={<VerifyContractPage />} />

          {/* Private - all logged in users */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/contracts" element={<PrivateRoute><MyContractsPage /></PrivateRoute>} />
          <Route path="/contracts/create" element={<PrivateRoute><CreateContractPage /></PrivateRoute>} />
          <Route path="/contracts/:contractId" element={<PrivateRoute><ContractDetailPage /></PrivateRoute>} />
          <Route path="/contracts/:contractId/audit" element={<PrivateRoute><AuditLogPage /></PrivateRoute>} />
          <Route path="/mailbox/inbox" element={<PrivateRoute><MailboxInboxPage /></PrivateRoute>} />
          <Route path="/mailbox/outbox" element={<PrivateRoute><MailboxOutboxPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/vault" element={<PrivateRoute><VaultPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          {/* Admin - ROLE_ADMIN and ROLE_SUPERADMIN */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* SuperAdmin only - ROLE_SUPERADMIN */}
          <Route path="/superadmin" element={<SuperAdminRoute><SuperAdminPage /></SuperAdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}