import { BrowserWindow, Menu, Tray } from 'electron';
import { quitApp } from './services/appService';

export default class TrayBuilder {
  private readonly mainWindow: BrowserWindow;

  private readonly tray: Tray;

  constructor(mainWindow: BrowserWindow, tray: Tray) {
    this.mainWindow = mainWindow;
    this.tray = tray;
  }

  buildTray(): Tray {
    try {
      if (!this.tray) throw new Error('Tray is not defined');

      this.tray.setToolTip('Synclip');
      this.setContextMenu();
      // this.handleTrayClick(); // Todo: handle tray click event
    } catch (e) {
      console.error('Tray setup failed:', e);
    }

    return this.tray;
  }

  private setContextMenu(): void {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          quitApp();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  // private handleTrayClick(): void {
  //   this.tray.on('click', () => {
  //     // Tray click event
  //   });
  // }
}
