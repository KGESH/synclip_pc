import React from 'react';
import { useNavigate } from 'react-router-dom';
import withAuth from '../components/auth/AuthWrapper';

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

export default withAuth(ProfilePage);
