import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerDevice } from '../../../main/services/deviceService';
import { IDevice } from '../../../main/types/deviceTypes';

export const useRegisterDevice = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerDevice,
    onSuccess: (device) => {
      queryClient.setQueryData(['devices'], (old: IDevice[]) => [
        ...old,
        device,
      ]);
    },
    onError: (error) => {
      console.error('Error registering device');
      alert(error.message);
      navigate('/');
    },
  });
};
