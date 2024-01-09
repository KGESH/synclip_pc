import { Notification, globalShortcut } from 'electron';
import Store from 'electron-store';
import { readClipboard } from './clipboardService';
import { IChangeShortcut, IShortcuts } from '../types/shortcutTypes';
import { uploadFile } from './googleDriveService';
import { notifyToServer } from './socketService';
import { showSystemNotification } from './notificationService';
import { BACKEND_BASE_URL } from '../constants/url';
import { IUser } from '../types/userTypes';
import { shortcutsSchema } from '../schemas/shortcutSchema';

const defaultShortcuts: IShortcuts = {
  readClipboard: 'CmdOrCtrl+Shift+C',
};

export const shortcutsStore = new Store({
  schema: {
    shortcuts: {
      type: 'object',
      default: defaultShortcuts,
    },
  },
});

// export const shortcutsStore = new Store({
//   schema: {
//     // Shortcuts
//     readClipboard: {
//       type: 'string',
//       default: 'CmdOrCtrl+Shift+C',
//     },
//   },
// });

export function getShortcuts() {
  return shortcutsSchema.parse(shortcutsStore.get('shortcuts'));
}

export function getShortcut(key: keyof IShortcuts) {
  const shortcuts = getShortcuts();

  if (!shortcuts[key]) throw new Error(`[getShortcut] ${key} is not defined.`);

  return shortcuts[key];
}

export function setShortcut(key: string, value: string) {
  shortcutsStore.set(`shortcuts.${key}`, value);
  console.log(`[SetShortcut] ${key}: ${value}`);
  console.log(getShortcuts());
}

async function handleReadClipboard() {
  // Todo: Impl pricing plan
  const isMaxDeviceCount = false;
  if (isMaxDeviceCount) {
    console.log(`[handleReadClipboard] Max device count reached.`);
    return;
  }

  const clipboard = await readClipboard();
  if (clipboard.type === 'text') {
    const uploadResult = await uploadFile(clipboard);
    showSystemNotification({ title: 'Copied!', message: 'Sent to server!' });
    notifyToServer('copy', uploadResult);
  }

  if (clipboard.type === 'file') {
    await uploadFile(clipboard);
  }

  if (clipboard.type === 'error') {
    console.error(clipboard.message);
  }
}

const shortcutMapper = {
  readClipboard: handleReadClipboard,
};

export type Shortcuts = keyof typeof shortcutMapper;

export function listenToReadClipboardShortcut() {
  const shortcut = getShortcut('readClipboard');
  globalShortcut.register(shortcut, handleReadClipboard);
}

export function changeShortcut({ event, newShortcut }: IChangeShortcut) {
  try {
    const prevShortcut = getShortcut(event as keyof IShortcuts);
    globalShortcut.unregister(prevShortcut);

    setShortcut(event, newShortcut);
    globalShortcut.register(newShortcut, shortcutMapper[event as Shortcuts]);
    return true;
  } catch (e) {
    return false;
  }
}
export function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

export function registerCustomShortcuts() {
  shortcutsStore.clear();
  unregisterShortcuts();
  listenToReadClipboardShortcut();
}

async function fetchUserCustomShrotcuts({ id }: Pick<IUser, 'id'>) {
  const endpoint = new URL(`/shortcuts/${id}`, BACKEND_BASE_URL);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  const res = shortcutsSchema.parse(data);

  // Todo: schema validate

  return data;
}

export async function syncUserCustomShortcuts({ id }: Pick<IUser, 'id'>) {
  const shortcuts = await fetchUserCustomShrotcuts({ id });
  // Todo: set store
}
