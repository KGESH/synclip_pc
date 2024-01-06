import { app, BrowserWindow } from 'electron';

type IApplicationStatus = 'init' | 'show' | 'hide' | 'quit';

type IApplication = {
  status: IApplicationStatus;
};

const application: IApplication = { status: 'init' };

export function getAppStatus() {
  return application.status;
}

export function setAppStatus(status: IApplicationStatus) {
  application.status = status;
}

export function quitApp() {
  setAppStatus('quit');
  app.quit();
}

export function isAppQuit() {
  return getAppStatus() === 'quit';
}

export function hideMainWindow(mainWindow: BrowserWindow) {
  mainWindow.hide();
  setAppStatus('hide');
}
