import { BrowserWindow } from 'electron';
import { createFileRoute, createURLRoute } from 'electron-router-dom';
import { getRootPath } from '../util';

type NavigateOptions = {
  window: BrowserWindow;
  id: string;
  path: string;
  query?: Record<string, string>;
};
export function navigateTo({ window, id, path, query }: NavigateOptions) {
  const isDebug = process.env.NODE_ENV === 'development';

  if (isDebug) {
    let devServerURL = createURLRoute(getRootPath(), id) + path;

    if (query) {
      devServerURL += '?';
      for (const key in query) {
        devServerURL += `${key}=${query[key]}&`;
      }
      devServerURL = devServerURL.slice(0, devServerURL.length - 1); // remove last '&'
    }

    console.log(`devServerURL: ${devServerURL}`);
    window.loadURL(devServerURL);
    return;
  }

  // Todo: check after packaging.
  const [fileRoute, loadOptions] = createFileRoute(getRootPath(), id);

  if (path !== '/') loadOptions.hash += path;

  if (query) loadOptions.query = { ...loadOptions.query, ...query };

  window.loadFile(fileRoute, loadOptions);
}
