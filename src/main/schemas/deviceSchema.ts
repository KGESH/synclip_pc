import { z } from 'zod';
import { createResponseSchema } from './responseSchema';

export const deviceTypeSchema = z.union([z.literal('PC'), z.literal('MOBILE')]);

export const deviceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mac: z.string(),
  alias: z.string(),
  deviceType: deviceTypeSchema,
  fcmToken: z.string(),
});

export const devicesSchema = deviceSchema.array();

export const deviceResponseSchema = createResponseSchema(
  z.union([deviceSchema, devicesSchema]),
);
