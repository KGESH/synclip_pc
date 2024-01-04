import { z } from 'zod';
import {
  clipboardFileContentSchema,
  clipboardContentSchema,
  clipboardErrorSchema,
  clipboardTextContentSchema,
  fileSchema,
} from '../schemas/clipboardSchema';

export type IFile = z.infer<typeof fileSchema>;

export type IClipboardTextContent = z.infer<typeof clipboardTextContentSchema>;

export type IClipboardFileContent = z.infer<typeof clipboardFileContentSchema>;

export type IClipboardError = z.infer<typeof clipboardErrorSchema>;

export type IClipboardContent = z.infer<typeof clipboardContentSchema>;
