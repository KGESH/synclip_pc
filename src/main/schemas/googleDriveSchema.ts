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

export const driveSchema = z.object({
  id: z.string(),
  userId: z.string(),
  baseFolderId: z.string(),
  textFolderId: z.string(),
  fileFolderId: z.string(),
});

export const driveRegisterSchema = driveSchema.omit({
  id: true,
});

export const driveLocalFolderIdsSchema = driveSchema.pick({
  baseFolderId: true,
  textFolderId: true,
  fileFolderId: true,
});

export const registerFoldersSuccessSchema = z.object({
  status: z.literal('success'),
  data: driveSchema,
});

export const registerFoldersErrorSchema = z.object({
  status: z.union([z.literal('not_found'), z.literal('error')]),
  message: z.string(),
});

export const registerFoldersResponseSchema = z.union([
  registerFoldersSuccessSchema,
  registerFoldersErrorSchema,
]);
