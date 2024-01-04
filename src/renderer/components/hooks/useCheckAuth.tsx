import { useEffect, useState } from 'react';

const { ipcRenderer } = window.electron;

export const useCheckAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const handleAuthentication = (isLogin: unknown) => {
      console.log('[useCheckAuth] is-authenticated:', isLogin);
      setIsAuthenticated(isLogin as boolean);
      setIsLoading(false);
    };

    const cleanUp = ipcRenderer.on('is-authenticated', handleAuthentication);

    ipcRenderer.sendMessage('is-authenticated');

    return cleanUp;
  }, []);

  return { isAuthenticated, isLoading };
};
