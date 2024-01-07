import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCheckAuth } from '../components/hooks/useCheckAuth';
import LoadingPage from '../pages/Loading';

function AuthWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useCheckAuth();

  console.log('AuthWrapper');
  // console.log(isAuthenticated);

  if (isLoading) return <LoadingPage />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}
