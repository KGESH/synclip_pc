/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  BrowserWindowConstructorOptions as WindowOptions,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import { createFileRoute, createURLRoute } from 'electron-router-dom';
import * as path from 'path';
import log from 'electron-log';
import MenuBuilder from './menu';
import { getAssetPath, getMacAddress, getRootPath } from './util';
import {
  getGoogleAccessToken,
  googleAuthorization,
} from './services/authService';
import { readClipboard, writeClipboard } from './services/clipboardService';
import { store } from './services/storeService';
import { changeShortcutSchema } from './schemas/shortcutSchema';
import {
  connectToDeviceSocketServer,
  removeSocketConnection,
} from './services/socketService';
import { getCurrentDevice } from './services/deviceService';
import {
  changeShortcut,
  registerCustomShortcuts,
  unregisterShortcuts,
} from './services/shortcutService';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

function createNewWindow(id: string, options: WindowOptions = {}) {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    ...options,
  });

  // Don't forget to check if the port is the same as your dev server
  const devServerURL = createURLRoute(getRootPath(), id);

  // Todo: check after packaging.
  const fileRoute = createFileRoute(getRootPath(), id);

  if (isDebug) window.loadURL(devServerURL);
  else window.loadFile(...fileRoute);

  return window;
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('is-authenticated', async (event, args) => {
  const token = await getGoogleAccessToken();

  if (!token) return event.reply('is-authenticated', false);

  return event.reply('is-authenticated', true);
});

ipcMain.on('authorize', () => googleAuthorization(mainWindow));

ipcMain.on('read-clipboard', async (event, args) => {
  const res = await readClipboard();
  if (res.type === 'text') event.reply('read-clipboard', res.text);
});

ipcMain.on('write-clipboard', (event, args) => {
  console.log(`write clipboard content: ${args}`);
  writeClipboard(args as string);
});

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async (id: string, options: WindowOptions) => {
  const window = createNewWindow(id, options);

  // Set main window
  if (id === 'main') {
    mainWindow = window;
    if (isDebug) {
      await installExtensions();
    }

    mainWindow.on('ready-to-show', () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        mainWindow.show();
      }
    });

    mainWindow.on('closed', () => {
      console.log(`==== mainWindow closed ====`);
      mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'allow' };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
  }

  return window;
};

/**
 * Add event listeners...
 */

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});

ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.on('set::change-shortcut', (event, args) => {
  const params = changeShortcutSchema.parse(args);
  const isChanged = changeShortcut(params);
  event.reply('done::change-shortcut', isChanged);
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  unregisterShortcuts();
  // removeSocketConnection();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    registerCustomShortcuts();
    getMacAddress();
    const device = getCurrentDevice();
    console.log(`==== Current device ====`);
    console.log(device);
    if (device?.id && device?.userId) connectToDeviceSocketServer(device);

    createWindow('main', {
      show: false,
      width: 1024,
      height: 728,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        createWindow('main', {
          show: false,
          width: 1024,
          height: 728,
          icon: getAssetPath('icon.png'),
          webPreferences: {
            preload: app.isPackaged
              ? path.join(__dirname, 'preload.js')
              : path.join(__dirname, '../../.erb/dll/preload.js'),
          },
        });
      }
    });
  })
  .catch(console.log);
