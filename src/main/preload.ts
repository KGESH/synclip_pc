// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'authorize'
  | 'custom-auth'
  | 'is-authenticated'
  | 'read-clipboard'
  | 'write-clipboard'
  | 'app::store::get'
  | 'app::store::set'
  | 'shortcuts::store::get'
  | 'shortcuts::store::set'
  | 'shortcuts::store::set::done'
  | 'google::account::get'
  | 'google::account::done';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  // Electron App Store
  appStore: {
    get(key: string) {
      return ipcRenderer.sendSync('app::store::get', key);
    },
    set(property: string, val: any) {
      ipcRenderer.send('app::store::set', property, val);
    },
  },
  shortcutsStore: {
    get(key: string) {
      return ipcRenderer.sendSync('shortcuts::store::get', key);
    },
    set(property: string, val: any) {
      ipcRenderer.send('shortcuts::store::set', property, val);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
