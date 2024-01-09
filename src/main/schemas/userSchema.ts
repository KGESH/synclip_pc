import { z } from 'zod';
import { createResponseSchema } from './responseSchema';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  nickname: z.string().optional(),
});

export const userResponseSchema = createResponseSchema(userSchema);
