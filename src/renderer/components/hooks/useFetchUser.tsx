import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../../main/services/userService';

export const useFetchUser = ({ email }: { email?: string }) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['user', email],
    queryFn: async () => {
      const user = await getUser({ email });

      if (user) return user;

      alert('User not found.\nPlease login again.');
      navigate('/login');
      throw new Error('User not found. Please login again.');
    },
    enabled: !!email,
  });
};
