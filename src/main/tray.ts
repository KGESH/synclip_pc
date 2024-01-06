import { app, BrowserWindow, Menu, Tray } from 'electron';
import { getAssetPath } from './util';

export default class TrayBuilder {}

//
// try {
//   tray = new Tray(getAssetPath('icon.png'));
//   tray.setImage(getAssetPath('icon.png'));
//   tray.setPressedImage(getAssetPath('icon.png'));
//   const contextMenu = Menu.buildFromTemplate([
//     {
//       label: 'Show/Hide App',
//       click: () => {
//         if (mainWindow?.isVisible()) {
//           mainWindow?.hide();
//         } else {
//           mainWindow?.show();
//         }
//       },
//     },
//     {
//       label: 'Quit',
//       click: () => {
//         isQuitApp = true;
//         app.quit();
//       },
//     },
//   ]);
//   tray.setToolTip('This is my application.');
//   tray.setContextMenu(contextMenu);
// } catch (e) {
//   console.log(`Tray error`);
//   console.error(e);
// }
