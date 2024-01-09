import { useState } from 'react';

const { ipcRenderer } = window.electron;

export default function ShortcutsPage() {
  const [shortcut, setShortcut] = useState();
  return (
    <div>
      <h1>Shortcuts Page</h1>
    </div>
  );
}
