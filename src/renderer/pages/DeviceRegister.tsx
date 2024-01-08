import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Navigate, useLocation } from 'react-router-dom';
import withAuth from '../components/auth/AuthWrapper';
import { useRegisterDevice } from '../components/hooks/useRegisterDevice';
import { macAddress } from '../utils/mac';
import LoadingPage from './Loading';

const navigateStateSchema = z.object({
  userId: z.string({ required_error: 'User id is required' }),
});

const inputSchema = z.object({
  alias: z.string({ required_error: 'Alias is required' }),
  fcmToken: z.string({ required_error: 'FCM Token is required' }),
});

type Inputs = z.infer<typeof inputSchema>;

function DeviceRegisterPage() {
  console.log(`Render Register page`);
  const { state } = useLocation();
  const { userId } = navigateStateSchema.parse(state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate, isSuccess, isPending } = useRegisterDevice();

  const onSubmit = handleSubmit((input) => {
    const isValid = inputSchema.safeParse(input).success;
    if (!isValid) return;

    mutate({
      userId,
      mac: macAddress,
      alias: input.alias,
      fcmToken: 'SAMPLE_FCM_TOKEN',
      deviceType: 'PC',
    });
  });

  if (isSuccess) return <Navigate to="/" />;

  if (isPending) return <LoadingPage />;

  return (
    <div>
      <h1>Register Device Page</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="alias">Alias</label>
          <input
            id="alias"
            type="text"
            placeholder="Alias"
            {...register('alias', { required: true })}
          />
          {errors.alias && <span>This field is required</span>}
        </div>

        <div>
          <label htmlFor="fcmToken">FCM Token</label>
          <input
            id="fcmToken"
            type="text"
            placeholder="FCM Token"
            {...register('fcmToken', { required: true })}
          />
          {errors.fcmToken && <span>This field is required</span>}
        </div>

        <button type="submit">Register device</button>
      </form>
    </div>
  );
}
export default withAuth(DeviceRegisterPage);
