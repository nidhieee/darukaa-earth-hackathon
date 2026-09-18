import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthPage from '../pages/AuthPage';
import Dashboard from '../pages/Dashboard';
import CreateProjectWizard from '../pages/CreateProjectWizard';
import ProjectMap from '../pages/ProjectMap';
import SiteDetail from '../pages/SiteDetail';

export default function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects/new" element={<ProtectedRoute><CreateProjectWizard /></ProtectedRoute>} />
      <Route path="/projects/:id/map" element={<ProtectedRoute><ProjectMap /></ProtectedRoute>} />
      <Route path="/sites/:id" element={<ProtectedRoute><SiteDetail /></ProtectedRoute>} />
    </Routes>
  );
}
