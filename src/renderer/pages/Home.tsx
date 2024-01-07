import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useClipboard } from '../components/hooks/useClipboard';
import { useFetchUserWithDevices } from '../components/hooks/useFetchUserWithDevices';
import LoadingPage from './Loading';

export default function Home() {
  const navigate = useNavigate();
  const { clipboardContent, readClipboard, writeClipboard } = useClipboard();
  const { isLoading, user, devices } = useFetchUserWithDevices();

  if (isLoading) return <LoadingPage />;

  if (devices!.length === 0) return <Navigate to="/device/register" />;

  return (
    <div>
      <h1>
        Hello {user?.email} {user?.name}!!
      </h1>
      <h2>
        Your devices:{' '}
        {devices!.map((device) => {
          return (
            <div key={device.id}>
              {device.mac} - {device.deviceType}
            </div>
          );
        })}
      </h2>
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
