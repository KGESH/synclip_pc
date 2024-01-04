import { z } from 'zod';

export const changeShortcutSchema = z.object({
  event: z.string(),
  newShortcut: z.string(),
});
