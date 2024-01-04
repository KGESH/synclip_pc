/* eslint import/prefer-default-export: off */
import { app } from 'electron';
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }

  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getRootPath() {
  if (process.env.NODE_ENV === 'development')
    return resolveHtmlPath('index.html');

  return path.join(__dirname, '../renderer/index.html');
}

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export function getAssetPath(...paths: string[]): string {
  return path.join(RESOURCES_PATH, ...paths);
}

/** Check token path after packaging */
export const TOKEN_PATH = getAssetPath('credentials/token.json');
// ? path.join(app.getPath('userData'), 'token.json')
