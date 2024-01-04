import { globalShortcut } from 'electron';
import { readClipboard } from './clipboardService';

const copyShortcut = 'CommandOrControl+C+S';

async function handleClipboardChange() {
  const clipboard = await readClipboard();
  if (clipboard.type === 'text') {
    const { text } = clipboard;
    console.log(`you copied: ${text}`);
  }

  if (clipboard.type === 'file') {
    const { buffers } = clipboard;
    console.log(`you copied a file count: ${buffers.length}`);
  }

  if (clipboard.type === 'error') {
    console.log(`Clipboard error:`);
    console.log(clipboard.message);
  }
}

export function listenToCopyShortcut() {
  globalShortcut.register('CommandOrControl', () => {
    console.log(`You press CMD\n`);
  });
  // globalShortcut.register(copyShortcut, handleClipboardChange);
}

export function registerCustomShortcuts() {
  listenToCopyShortcut();
  // const interval = setInterval(listenToClipboard, 1000);
}

export function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}
