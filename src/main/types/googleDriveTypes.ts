import { z } from 'zod';
import {
  uploadErrorSchema,
  uploadFileResponseSchema,
  uploadResponseSchema,
  uploadSuccessSchema,
} from '../schemas/googleDriveSchema';

export type IUplaodFileResponse = z.infer<typeof uploadFileResponseSchema>;

export type IUploadSuccess = z.infer<typeof uploadSuccessSchema>;

export type IUploadError = z.infer<typeof uploadErrorSchema>;

export type IUploadResponse = z.infer<typeof uploadResponseSchema>;
