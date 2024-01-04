import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
});

export const userResponseSuccessSchema = z.object({
  status: z.literal('success'),
  data: userSchema,
});

export const userResponseFailSchema = z.object({
  status: z.union([z.literal('error'), z.literal('not_found')]),
  message: z.string(),
});

export const userResponseSchema = z.union([
  userResponseSuccessSchema,
  userResponseFailSchema,
]);
