import { z } from 'zod';
import {
  driveLocalFolderIdsSchema,
  driveRegisterSchema,
  driveSchema,
  uploadErrorSchema,
  uploadFileResponseSchema,
  uploadResponseSchema,
  uploadSuccessSchema,
} from '../schemas/googleDriveSchema';

export type IUplaodFileResponse = z.infer<typeof uploadFileResponseSchema>;

export type IUploadSuccess = z.infer<typeof uploadSuccessSchema>;

export type IUploadError = z.infer<typeof uploadErrorSchema>;

export type IUploadResponse = z.infer<typeof uploadResponseSchema>;

export type IDrive = z.infer<typeof driveSchema>;

export type IDriveRegister = z.infer<typeof driveRegisterSchema>;

export type IDriveLocalFolderIds = z.infer<typeof driveLocalFolderIdsSchema>;
