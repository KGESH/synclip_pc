import { BACKEND_BASE_URL } from '../constants/url';
import { userResponseSchema } from '../schemas/userSchema';
import { IUser } from '../types/userTypes';

export async function getUser({
  id,
  email,
}: Partial<IUser>): Promise<IUser | null> {
  if (!id && !email) throw new Error('id or email is required');

  const endpoint = new URL('/users', BACKEND_BASE_URL);
  if (id) endpoint.searchParams.append('id', id);
  if (email) endpoint.searchParams.append('email', email);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const res = userResponseSchema.parse(await response.json());

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

export async function signUpUser(user: Omit<IUser, 'id'>) {
  const endpoint = new URL('/users', BACKEND_BASE_URL);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  const res = userResponseSchema.parse(await response.json());

  switch (res.status) {
    case 'success':
      return res.data;

    case 'error':
    default:
      throw new Error(`Unknown Error: ${res.message}`);
  }
}

export async function updateUser(user: IUser) {
  const endpoint = new URL('/users', BACKEND_BASE_URL);

  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  const res = userResponseSchema.parse(await response.json());

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
