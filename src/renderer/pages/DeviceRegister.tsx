import React from 'react';
import withAuth from '../components/auth/AuthWrapper';

function DeviceRegisterPage() {
  return (
    <div>
      <h1>Register Device Page</h1>
    </div>
  );
}
export default withAuth(DeviceRegisterPage);
