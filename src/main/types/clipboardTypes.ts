import { z } from 'zod';
import {
  clipboardFileContentSchema,
  clipboardContentSchema,
  clipboardErrorSchema,
  clipboardTextContentSchema,
} from '../schemas/clipboardSchema';

export type ClipboardTextContent = z.infer<typeof clipboardTextContentSchema>;

export type ClipboardFileContent = z.infer<typeof clipboardFileContentSchema>;

export type ClipboardError = z.infer<typeof clipboardErrorSchema>;

export type ClipboardContent = z.infer<typeof clipboardContentSchema>;
