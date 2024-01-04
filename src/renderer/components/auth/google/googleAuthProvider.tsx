import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constant';

type Props = {
  children: React.ReactNode;
};

export default function GoogleAuthProvider({ children }: Props) {
  return (
    // eslint-disable-next-line no-undef
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
