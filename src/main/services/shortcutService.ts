import { globalShortcut } from 'electron';
import { readClipboard } from './clipboardService';
import { store } from './storeService';
import { IChangeShort } from '../types/shortcutTypes';
import { uploadFile } from './googleDriveService';

// const copyShortcut = 'CommandOrControl+C+S';

const shortcutMapper = {
  readClipboard: handleReadClipboard,
  // sample: handleClipboardChange,
};

export type Shortcuts = keyof typeof shortcutMapper;

async function handleReadClipboard() {
  const clipboard = await readClipboard();
  if (clipboard.type === 'text') {
    const uploadResult = await uploadFile(clipboard);
    console.log(`==== upload result ====`);
    console.log(uploadResult);
  }

  if (clipboard.type === 'file') {
    await uploadFile(clipboard);
  }

  if (clipboard.type === 'error') {
    console.log(`Clipboard error:`);
    console.log(clipboard.message);
  }
}

export function listenToReadClipboardShortcut() {
  const shortcut = store.get('readClipboard') as string;
  globalShortcut.register(shortcut, handleReadClipboard);
  // globalShortcut.register(copyShortcut, handleClipboardChange);
}

export function changeShortcut({ event, newShortcut }: IChangeShort) {
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
