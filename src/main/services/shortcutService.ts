import { globalShortcut } from 'electron';
import { readClipboard } from './clipboardService';
import { store } from './storeService';
import { IChangeShortcut } from '../types/shortcutTypes';
import { uploadFile } from './googleDriveService';
import { notifyToServer } from './socketService';

async function handleReadClipboard() {
  const clipboard = await readClipboard();
  if (clipboard.type === 'text') {
    const uploadResult = await uploadFile(clipboard);
    console.log(`==== upload result ====`);
    console.log(uploadResult);
    notifyToServer('copy', uploadResult);
  }

  if (clipboard.type === 'file') {
    await uploadFile(clipboard);
  }

  if (clipboard.type === 'error') {
    console.log(`Clipboard error:`);
    console.log(clipboard.message);
  }
}

const shortcutMapper = {
  readClipboard: handleReadClipboard,
  // sample: handleClipboardChange,
};

export type Shortcuts = keyof typeof shortcutMapper;

export function listenToReadClipboardShortcut() {
  const shortcut = store.get('readClipboard') as string;
  globalShortcut.register(shortcut, handleReadClipboard);
}

export function changeShortcut({ event, newShortcut }: IChangeShortcut) {
  try {
    const prevShortcut = store.get(event) as string;
    globalShortcut.unregister(prevShortcut);

    store.set(event, newShortcut);
    globalShortcut.register(newShortcut, shortcutMapper[event as Shortcuts]);
    return true;
  } catch (e) {
    return false;
  }
}

export function registerCustomShortcuts() {
  listenToReadClipboardShortcut();
}

export function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}
