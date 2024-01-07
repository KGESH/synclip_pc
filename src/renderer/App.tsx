import React from 'react';
import { Navigate } from 'react-router-dom';
import { Router, Route } from 'electron-router-dom';
import { useCheckAuth } from './components/hooks/useCheckAuth';
import QueryProvider from './components/reactQuery/QueryProvider';
import './App.css';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import Home from './pages/Home';
import LoadingPage from './pages/Loading';
import DeviceRegisterPage from './pages/deviceRegister';

type AuthWrapperProps = {
  children: React.ReactNode;
};

function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useCheckAuth();

  console.log('AuthWrapper');
  // console.log(isAuthenticated);

  if (isLoading) return <LoadingPage />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryProvider>
      <Router
        main={
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={
                // <AuthWrapper>
                <ProfilePage />
                // </AuthWrapper>
              }
            />
            <Route
              path="/"
              element={
                // <AuthWrapper>
                <Home />
                // </AuthWrapper>
              }
            />
            <Route
              path="/device/register"
              element={
                // <AuthWrapper>
                <DeviceRegisterPage />
                // </AuthWrapper>
              }
            />
          </>
        }
      />
    </QueryProvider>
  );
}
