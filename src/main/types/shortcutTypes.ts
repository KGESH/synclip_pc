import { z } from 'zod';
import {
  changeShortcutSchema,
  shortcutsSchema,
} from '../schemas/shortcutSchema';

export type IChangeShortcut = z.infer<typeof changeShortcutSchema>;

export type IShortcuts = z.infer<typeof shortcutsSchema>;

export type IShortcutEvent = keyof IShortcuts;
