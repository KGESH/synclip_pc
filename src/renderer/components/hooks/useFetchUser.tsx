import { useEffect, useState } from 'react';
import { IUser } from '../../../main/types/userTypes';
import { getUser } from '../../../main/services/userService';
import { IDevice } from '../../../main/types/deviceTypes';
import { getDevices } from '../../../main/services/deviceService';

const { ipcRenderer } = window.electron;

export type IGoogleAccount = {
  email: string;
};

export const useFetchUser = () => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [user, setUser] = useState<IUser | null>();
  const [devices, setDevices] = useState<IDevice[]>([]);

  useEffect(() => {
    const handleGetGoogleAccountResponse = async (args: unknown) => {
      const account = args as IGoogleAccount | null;

      if (account) {
        const foundUser = await getUser({ email: account.email });
        setUser(foundUser);

        if (foundUser) {
          const userDevices = await getDevices({ userId: foundUser.id });
          setDevices(userDevices);
        }
      }

      setIsLoading(false);
    };

    const cleanUp = ipcRenderer.on(
      'google::account::done',
      handleGetGoogleAccountResponse,
    );

    ipcRenderer.sendMessage('google::account::get');

    return cleanUp;
  }, []);

  return { user, devices, isLoading };
};
