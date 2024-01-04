import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Router, Route } from 'electron-router-dom';
import AuthButton from './components/auth/google/authButton';
import { useCheckAuth } from './components/hooks/useCheckAuth';
import './App.css';
import { useClipboard } from './components/hooks/useClipboard';

type AuthWrapperProps = {
  children: React.ReactNode;
};

function LoadingPage() {
  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}

function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useCheckAuth();

  console.log('AuthWrapper');
  console.log(isAuthenticated);

  if (isLoading) return <LoadingPage />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}

function Home() {
  const navigate = useNavigate();
  const { clipboardContent, readClipboard, writeClipboard } = useClipboard();
  const currentPath = window.location.href;
  // const { isAuthenticated } = useCheckAuth();

  console.log('Home');
  console.log(currentPath);

  // console.log(isAuthenticated);

  // navigate('/#login', {
  //   replace: true,
  // });
  // if (!isAuthenticated) navigate('/#login');

  return (
    <div>
      <h1>Hello World!</h1>
      <p>Clipboard: {clipboardContent}</p>
      <button type="button" onClick={readClipboard}>
        Read clipboard
      </button>
      <button type="button" onClick={() => writeClipboard('hello')}>
        Write hello to clipboard
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/profile');
        }}
      >
        Profile
      </button>
      {/* <GoogleLoginButton /> */}
    </div>
  );
}

function LoginPage() {
  console.log('LoginPage');

  return (
    <div>
      <h1>Login Page</h1>
      <AuthButton />
    </div>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  console.log('ProfilePage');
  console.log(`href: ${window.location.href}`);

  return (
    <div>
      <h1>Profile Page</h1>
      <button
        type="button"
        onClick={() => {
          navigate('/');
        }}
      >
        Go to home
      </button>
    </div>
  );
}

function SuccessPage() {
  return (
    <div>
      <h1>Login Success Page</h1>
    </div>
  );
}

export default function App() {
  return (
    <Router
      main={
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/"
            element={
              <AuthWrapper>
                <Home />
              </AuthWrapper>
            }
          />
        </>
      }
    />
  );
}
