import { z } from 'zod';

export const uploadFileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const textUploadSuccessSchema = z.object({
  type: z.literal('text'),
  content: uploadFileResponseSchema,
});

export const fileUploadSuccessSchema = z.object({
  type: z.literal('file'),
  contents: uploadFileResponseSchema.array(),
});

export const uploadSuccessSchema = z.object({
  status: z.literal('success'),
  response: z.union([textUploadSuccessSchema, fileUploadSuccessSchema]),
});

export const uploadErrorSchema = z.object({
  status: z.literal('error'),
  message: z.string(),
});

export const uploadResponseSchema = z.union([
  uploadSuccessSchema,
  uploadErrorSchema,
]);
