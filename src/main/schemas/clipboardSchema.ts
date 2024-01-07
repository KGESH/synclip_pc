import { z } from 'zod';

export const clipboardTextContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

export const fileSchema = z.object({
  name: z.string(),
  path: z.string(),
  buffer: z.instanceof(Buffer),
});

export const clipboardFileContentSchema = z.object({
  type: z.literal('file'),
  files: fileSchema.array(),
});

export const clipboardErrorSchema = z.object({
  type: z.literal('error'),
  message: z.string(),
});

export const clipboardContentSchema = z.union([
  clipboardTextContentSchema,
  clipboardFileContentSchema,
  clipboardErrorSchema,
]);
