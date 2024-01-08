import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFetchUserWithDevices } from '../components/hooks/useFetchUserWithDevices';
import LoadingPage from './Loading';
import withAuth from '../components/auth/AuthWrapper';
import { macAddress } from '../utils/mac';

function HomePage() {
  console.log(`Render home page`);
  const navigate = useNavigate();
  const { isLoading, user, devices } = useFetchUserWithDevices();

  if (isLoading) return <LoadingPage />;

  if (!devices || devices.length === 0) {
    return (
      <Navigate
        to="/device/register"
        state={{
          userId: user!.id,
        }}
      />
    );
  }

  const currentDevice = devices.find((device) => device.mac === macAddress);

  return (
    <div>
      <h1>Hello {user?.nickname} !</h1>
      <h2>Current Device</h2>
      <p>Name: {currentDevice?.alias}</p>
      <p>MAC: {currentDevice?.mac}</p>

      <button
        type="button"
        onClick={() => {
          navigate('/profile');
        }}
      >
        Profile
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/device/register', {
            state: {
              userId: user!.id,
            },
          });
        }}
      >
        Register
      </button>
    </div>
  );
}

export default withAuth(HomePage);
