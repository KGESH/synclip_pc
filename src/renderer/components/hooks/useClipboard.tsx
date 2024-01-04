import { useEffect, useState } from 'react';

const { ipcRenderer } = window.electron;

export const useClipboard = () => {
  const [clipboardContent, setClipboardContent] = useState('');

  const writeClipboard = (content: string) =>
    ipcRenderer.sendMessage('write-clipboard', content);
  const readClipboard = () => ipcRenderer.sendMessage('read-clipboard');

  useEffect(() => {
    readClipboard();
    const handleReadClipboardContent = (content: unknown) => {
      console.log('[useClipboard] clipboard-content:', content);
      setClipboardContent(content as string);
    };

    const cleanUp = ipcRenderer.on(
      'read-clipboard',
      handleReadClipboardContent,
    );

    return cleanUp;
  }, []);

  return { clipboardContent, readClipboard, writeClipboard };
};
