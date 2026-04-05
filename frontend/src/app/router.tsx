import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { AuthPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TasksPage } from '../pages/TasksPage';
import { UnderDevelopmentPage } from '../pages/UnderDevelopmentPage';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <Outlet />;
}

function PublicAuthRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicAuthRoute />}>
        <Route path="/auth/sign-in" element={<AuthPage />} />
        <Route path="/auth/sign-up" element={<AuthPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/projects" element={<UnderDevelopmentPage />} />
        <Route path="/calendar" element={<UnderDevelopmentPage />} />
        <Route path="/team" element={<UnderDevelopmentPage />} />
        <Route path="/reports" element={<UnderDevelopmentPage />} />
        <Route path="/settings" element={<UnderDevelopmentPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
