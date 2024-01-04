import { z } from 'zod';
import { changeShortcutSchema } from '../schemas/shortcutSchema';

export type IChangeShort = z.infer<typeof changeShortcutSchema>; // { event: string; newShortcut: string; }
