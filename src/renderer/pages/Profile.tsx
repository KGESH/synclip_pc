import React from 'react';
import { useNavigate } from 'react-router-dom';
import withAuth from '../components/auth/AuthWrapper';
import { useFetchUserWithDevices } from '../components/hooks/useFetchUserWithDevices';
import LoadingPage from './Loading';

function ProfilePage() {
  const navigate = useNavigate();
  const { isLoading, user, devices } = useFetchUserWithDevices();

  if (isLoading) return <LoadingPage />;

  return (
    <div>
      <h1>Profile Page</h1>

      <h2>User Info</h2>
      <p>Email: {user?.email}</p>
      <p>{user?.nickname}</p>

      <h3>Your devices</h3>
      {devices?.map((device) => {
        return (
          <p key={device.id}>
            {device.alias} - {device.deviceType} - {device.mac}
          </p>
        );
      })}
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

export default withAuth(ProfilePage);
