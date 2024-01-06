import { z } from 'zod';

export const deviceTypeSchema = z.union([z.literal('PC'), z.literal('MOBILE')]);

export const deviceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mac: z.string(),
  alias: z.string().optional(),
  deviceType: deviceTypeSchema,
  fcmToken: z.string(),
});

export const deviceResponseSuccessSchema = z.object({
  status: z.literal('success'),
  data: z.union([deviceSchema, deviceSchema.array()]),
});

export const deviceResponseFailSchema = z.object({
  status: z.union([z.literal('error'), z.literal('not_found')]),
  message: z.string(),
});

export const deviceResponseSchema = z.union([
  deviceResponseSuccessSchema,
  deviceResponseFailSchema,
]);
