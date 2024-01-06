import { BACKEND_BASE_URL } from '../constants/url';
import { IDevice } from '../types/deviceTypes';
import { deviceResponseSchema } from '../schemas/deviceSchema';
import { IUser } from '../types/userTypes';

export async function getDevices({
  userId,
  email,
}: Partial<Pick<IUser, 'email'> & Pick<IDevice, 'userId'>>) {
  if (!userId && !email) throw new Error('userId or email is required');

  const endpoint = new URL('/devices', BACKEND_BASE_URL);
  if (userId) endpoint.searchParams.append('userId', userId);
  if (email) endpoint.searchParams.append('email', email);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const res = deviceResponseSchema.parse(await response.json());

  switch (res.status) {
    case 'success':
      return res.data as IDevice[];

    case 'not_found':
      return [] as IDevice[];

    case 'error':
    default:
      throw new Error(`[GetCurrentDevice] Error: ${res.message}`);
  }
}

export async function getDevice({ id, mac }: { id?: string; mac?: string }) {
  if (!id && !mac) throw new Error('id or mac is required');

  const endpoint = new URL('/devices', BACKEND_BASE_URL);
  if (id) endpoint.searchParams.append('id', id);
  else if (mac) endpoint.searchParams.append('mac', mac);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const res = deviceResponseSchema.parse(await response.json());

  switch (res.status) {
    case 'success':
      return res.data as IDevice;

    case 'not_found':
      return null;

    case 'error':
    default:
      throw new Error(`[GetCurrentDevice] Error: ${res.message}`);
  }
}

// export function getCurrentDeviceId() {
//   const device = store.get('currentDevice');
//
//   const { id } = deviceSchema.parse(device);
//
//   if (!id) return null;
//
//   return id as string;
// }

export function resetCurrentDevice() {
  // setDefaultCurrentDevice();
}

// export function setCurrentDevice(device: IDevice) {
//   resetCurrentDevice();
// }

export async function registerDevice(device: Omit<IDevice, 'id'>) {
  const endpoint = new URL('/devices', BACKEND_BASE_URL);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(device),
  });

  const res = deviceResponseSchema.parse(await response.json());

  console.log(`Register Device Response: ${JSON.stringify(res)}`);

  switch (res.status) {
    case 'success':
      return res.data as IDevice;

    case 'error':
    default:
      throw new Error(`Unknown Error: ${res.message}`);
  }
}

export async function updateDevice(device: IDevice) {
  const endpoint = new URL('/devices', BACKEND_BASE_URL);

  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(device),
  });

  const res = deviceResponseSchema.parse(await response.json());

  switch (res.status) {
    case 'success':
      return res.data;

    case 'not_found':
      return null;

    case 'error':
    default:
      throw new Error(`Unknown Error: ${res.message}`);
  }
}
