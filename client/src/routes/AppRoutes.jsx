import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Pages
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import TasksPage from "../pages/TasksPage.jsx";
import CreateTaskPage from "../pages/CreateTaskPage.jsx";
import EditTaskPage from "../pages/EditTaskPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

// Layouts
import AppLayout from "../components/layout/AppLayout.jsx";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import LoadingScreen from "../components/ui/LoadingScreen.jsx";

/** Redirect authenticated users away from public routes */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

/** Redirect unauthenticated users to login */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route
      element={
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      }
    >
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* Protected Routes */}
    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/create" element={<CreateTaskPage />} />
      <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>

    {/* Redirects */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
