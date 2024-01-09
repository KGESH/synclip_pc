import { z } from 'zod';
import { createResponseSchema } from './responseSchema';

export const shortcutsSchema = z.object({
  readClipboard: z.string(),
});

// event is key of shortcutsSchema
export const changeShortcutSchema = z.object({
  event: z.string(),
  newShortcut: z.string(),
});

export const shortcutsResponseSchema = createResponseSchema(shortcutsSchema);
