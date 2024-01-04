import { google, Auth } from 'googleapis';
import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import { getUser, signUpUser } from './userService';
import { GOOGLE_SCOPES } from '../constants/google';
import { navigateTo } from './navigateService';
import { getAssetPath, TOKEN_PATH } from '../util';
import { registerDevice } from './deviceService';
import { undefined } from 'zod';

type Credentials = {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
};

function loadCredentials() {
  const CREDENTIALS_PATH = getAssetPath('credentials/credentials.json');
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('Credentials file not found');
    return null;
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    console.log('Credentials loaded successfully');
    console.log(credentials);
    return credentials.web as Credentials; // Assuming the structure includes a 'web' key
  } catch (error) {
    console.error('Error reading credentials:', error);
    return null;
  }
}

export async function getGoogleAccessToken() {
  const tokenExists = fs.existsSync(TOKEN_PATH);

  // Send to renderer process.
  if (!tokenExists) return null;

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));

  const authClient = getGoogleAuthClient();
  authClient.setCredentials(token);
  authClient.on('tokens', (newToken) => {
    if (newToken.refresh_token) {
      token.refresh_token = newToken.refresh_token;
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    }
  });

  const res = await authClient.getAccessToken();

  if (!res.token) return null;

  return res.token;
}

let googleAuthClient: Auth.OAuth2Client | null = null;

export function getGoogleAuthClient() {
  if (!googleAuthClient) {
    const credentials = loadCredentials();

    if (!credentials)
      throw new Error('Failed to load Google OAuth credentials');

    const { client_secret, client_id, redirect_uris } = credentials;
    googleAuthClient = new google.auth.OAuth2({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: redirect_uris[0],
    });
  }

  return googleAuthClient;
}

export async function getGoogleAccountInfo(accessToken?: string | null) {
  if (!accessToken) throw new Error('No access token');

  const authClient = getGoogleAuthClient();

  const response = await authClient.getTokenInfo(accessToken);

  const email = response?.email;

  if (!email) throw new Error('No email in google account info');

  return { email };
}

export const googleAuthorization = (mainWindow: BrowserWindow | null) => {
  const authClient = getGoogleAuthClient();

  const authUrl = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPES,
  });

  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  authWindow.loadURL(authUrl);
  authWindow.webContents.on('will-redirect', async (event, url) => {
    const { searchParams } = new URL(url);
    const code = searchParams.get('code');

    if (!code) throw new Error('No auth code in url');

    const { tokens } = await authClient.getToken(code);

    if (!tokens) throw new Error('No tokens in response');

    authClient.setCredentials(tokens);
    authClient.on('tokens', (newToken) => {
      if (newToken.refresh_token) {
        tokens.refresh_token = newToken.refresh_token;
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      }
    });

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    /**
     *  Auth sequence with backend
     */

    const { email } = await getGoogleAccountInfo(tokens.access_token);

    const user = await getUser({ email });

    if (!user) {
      const createdUser = await signUpUser({
        email,
        name: 'New user',
      });

      console.log(`Created user: `, createdUser);

      const newDevice = await registerDevice({
        userId: createdUser.id,
        deviceType: 'PC',
        alias: 'My new desktop',
        fcmToken: 'sample_TOKEN',
      });

      console.log(`Registered device: `, newDevice);
    }

    authWindow.close();

    // Todo: redirect to home page
    if (mainWindow) {
      navigateTo({
        window: mainWindow,
        id: 'main',
        path: '/profile',
      });
    }
  });
};
