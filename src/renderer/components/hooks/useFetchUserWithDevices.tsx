import { useGoogleAccount } from './useGoogleAccount';
import { useFetchUser } from './useFetchUser';
import { useFetchDevices } from './useFetchDevices';

export const useFetchUserWithDevices = () => {
  const email = useGoogleAccount();
  const userQuery = useFetchUser({ email });
  const devicesQuery = useFetchDevices({ userId: userQuery.data?.id }); // type error. user query data is undefined

  return {
    user: userQuery.data,
    devices: devicesQuery.data,
    isLoading: userQuery.isPending || devicesQuery.isPending,
    refetchDevices: devicesQuery.refetch,
  };
};
