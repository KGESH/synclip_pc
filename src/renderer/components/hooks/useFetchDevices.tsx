import { useQuery } from '@tanstack/react-query';
import { getDevices } from '../../../main/services/deviceService';

export const useFetchDevices = ({ userId }: { userId?: string }) => {
  return useQuery({
    queryKey: ['devices', userId],
    queryFn: () => getDevices({ userId }),
    enabled: !!userId,
  });
};
