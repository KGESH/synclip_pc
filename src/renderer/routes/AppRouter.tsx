import React from 'react';
import { Router } from 'electron-router-dom';
import LoginPage from '../pages/Login';
import ProfilePage from '../pages/Profile';
import Home from '../pages/Home';
import DeviceRegisterPage from '../pages/deviceRegister';
import AppRoute from './Route';
import AuthRoute from './AuthRoute';

export default function AppRouter() {
  return (
    <Router
      main={
        <>
          <AppRoute path="/login">
            <LoginPage />
          </AppRoute>

          <AuthRoute path="/profile">
            <ProfilePage />
          </AuthRoute>

          <AuthRoute path="/">
            <Home />
          </AuthRoute>

          <AuthRoute path="/device/register">
            <DeviceRegisterPage />
          </AuthRoute>
        </>
      }
    />
  );
}
