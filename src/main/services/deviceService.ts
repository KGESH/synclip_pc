import { BACKEND_BASE_URL } from '../constants/url';
import { IDevice } from '../types/deviceTypes';
import { deviceResponseSchema, deviceSchema } from '../schemas/deviceSchema';
import { IUser } from '../types/userTypes';
import { setDefaultCurrentDevice, store } from './storeService';

export async function getDevices({ id, email }: Pick<IUser, 'id' | 'email'>) {
  if (!id && !email) throw new Error('id or userId or email is required');

  const endpoint = new URL('/devices', BACKEND_BASE_URL);
  if (id) endpoint.searchParams.append('id', id);
  if (email) endpoint.searchParams.append('email', email);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const res = deviceResponseSchema.parse(await response.json());

  switch (res.status) {
    case 'success':
      return res.data as IDevice[];

    case 'error':
    default:
      throw new Error(`[GetCurrentDevice] Error: ${res.message}`);
  }
}

export async function getDevice(id: string) {
  const endpoint = new URL('/devices', BACKEND_BASE_URL);
  endpoint.searchParams.append('id', id);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const res = deviceResponseSchema.parse(await response.json());

  switch (res.status) {
    case 'success':
      return res.data as IDevice;

    case 'error':
    default:
      throw new Error(`[GetCurrentDevice] Error: ${res.message}`);
  }
}

export function getCurrentDeviceId() {
  const device = store.get('currentDevice');

  const { id } = deviceSchema.parse(device);

  if (!id) return null;

  return id as string;
}

export function resetCurrentDevice() {
  setDefaultCurrentDevice();
}

export function setCurrentDevice(device: IDevice) {
  resetCurrentDevice();
  store.set('currentDevice', device);
}

export function getCurrentDevice() {
  const device = store.get('currentDevice');
  return deviceSchema.parse(device);
}

export async function registerDevice(device: Omit<IDevice, 'id'>) {
  const endpoint = new URL('/devices', BACKEND_BASE_URL);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(device),
  });

  const res = deviceResponseSchema.parse(await response.json());

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
