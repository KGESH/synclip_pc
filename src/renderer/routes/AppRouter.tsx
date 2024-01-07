import React from 'react';
import { Route, Router } from 'electron-router-dom';
import LoginPage from '../pages/Login';
import ProfilePage from '../pages/Profile';
import HomePage from '../pages/Home';
import DeviceRegisterPage from '../pages/DeviceRegister';

export default function AppRouter() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/device/register" element={<DeviceRegisterPage />} />
        </>
      }
    />
  );
}
