import { BACKEND_BASE_URL } from '../constants/url';
import { IDevice } from '../types/deviceTypes';
import { deviceResponseSchema } from '../schemas/deviceSchema';

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
      return res.data;

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
