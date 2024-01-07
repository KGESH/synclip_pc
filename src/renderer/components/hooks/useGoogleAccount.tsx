import { useState, useEffect } from 'react';

const { ipcRenderer } = window.electron;

export const useGoogleAccount = () => {
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    const handleGetGoogleAccountResponse = async (args: unknown) => {
      console.log(`Response from google::account::get: ${args}`);
      const account = args as { email: string } | null;
      if (account) setEmail(account.email);
    };

    const cleanUp = ipcRenderer.on(
      'google::account::done',
      handleGetGoogleAccountResponse,
    );

    ipcRenderer.sendMessage('google::account::get');

    return cleanUp;
  }, []);

  return email;
};
