import React, { ComponentType, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useCheckAuth } from '../hooks/useCheckAuth';
import LoadingPage from '../../pages/Loading';

export default function withAuth<T extends {}>(
  WrappedComponent: ComponentType<T>,
) {
  const WithAuthComponent: React.FC<PropsWithChildren<T>> = (props) => {
    const { isAuthenticated, isLoading } = useCheckAuth();

    if (isLoading) {
      return <LoadingPage />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
}
