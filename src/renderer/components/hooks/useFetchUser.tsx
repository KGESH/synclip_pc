import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../../main/services/userService';

export const useFetchUser = ({ email }: { email?: string }) => {
  return useQuery({
    queryKey: ['user', email],
    queryFn: () => getUser({ email }),
    enabled: !!email,
  });
};
