import { useQuery } from '@tanstack/react-query';
import { macAddress } from '../../utils/mac';
import { getDevice } from '../../../main/services/deviceService';

export const useFetchCurrentDevice = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ['device', userId, macAddress],
    queryFn: () => getDevice({ mac: macAddress }),
  });
};
