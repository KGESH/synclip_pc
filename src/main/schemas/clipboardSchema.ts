import { z } from 'zod';

// type ClipboardTextContent = {
//   type: 'text';
//   content: string;
// };
//
// type ClipboardBinaryContent = {
//   type: 'file';
// };
//
// type ClipboardError = {
//   type: 'error';
//   message: string;
// };
//
// type ClipboardContent = ClipboardTextContent &
//   ClipboardBinaryContent &
//   ClipboardError;
//

export const clipboardTextContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

export const clipboardFileContentSchema = z.object({
  type: z.literal('file'),
  buffers: z.instanceof(Buffer).array(),
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
