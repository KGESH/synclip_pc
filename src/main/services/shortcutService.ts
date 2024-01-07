import { Notification, globalShortcut } from 'electron';
import Store from 'electron-store';
import { readClipboard } from './clipboardService';
import { IChangeShortcut } from '../types/shortcutTypes';
import { uploadFile } from './googleDriveService';
import { notifyToServer } from './socketService';
import { showSystemNotification } from './notificationService';

const shortcutStore = new Store({
  schema: {
    // Shortcuts
    readClipboard: {
      type: 'string',
      default: 'CmdOrCtrl+Shift+C',
    },
  },
});

export function getShortcut(key: string) {
  return shortcutStore.get(key) as string;
}

export function setShortcut(key: string, value: string) {
  shortcutStore.set(key, value);
}

async function handleReadClipboard() {
  const clipboard = await readClipboard();
  if (clipboard.type === 'text') {
    const uploadResult = await uploadFile(clipboard);
    showSystemNotification({ title: 'Copied!', message: 'Send to server!' });
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
    const prevShortcut = getShortcut(event);
    globalShortcut.unregister(prevShortcut);

    setShortcut(event, newShortcut);
    globalShortcut.register(newShortcut, shortcutMapper[event as Shortcuts]);
    return true;
  } catch (e) {
    return false;
  }
}

export function registerCustomShortcuts() {
  shortcutStore.clear();
  listenToReadClipboardShortcut();
}

export function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}
