import { ComponentProps, ReactNode } from 'react';
import { Route } from 'electron-router-dom';
import { Navigate } from 'react-router-dom';
import { useCheckAuth } from '../components/hooks/useCheckAuth';
import LoadingPage from '../pages/Loading';

function AuthWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useCheckAuth();

  if (isLoading) return <LoadingPage />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}

type RouteProps = ComponentProps<typeof Route>;

export default function AuthRoute({ path, children }: RouteProps) {
  return <Route path={path} element={<AuthWrapper>{children}</AuthWrapper>} />;
}
