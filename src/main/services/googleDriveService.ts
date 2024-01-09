import Store from 'electron-store';
import {
  IClipboardFileContent,
  IClipboardTextContent,
} from '../types/clipboardTypes';
import {
  driveLocalFolderIdsSchema,
  driveRegisterSchema,
  fileUploadSuccessSchema,
  registerFoldersResponseSchema,
  textUploadSuccessSchema,
  uploadFileResponseSchema,
} from '../schemas/googleDriveSchema';
import {
  IDrive,
  IDriveRegister,
  IDriveLocalFolderIds,
  IUplaodFileResponse,
} from '../types/googleDriveTypes';
import { writeClipboard } from './clipboardService';
import { getGoogleAccessToken } from './authService';
import { currentTime } from '../util';
import { BACKEND_BASE_URL } from '../constants/url';
import { IUser } from '../types/userTypes';
import { getUser } from './userService';

const defaultFolderIds: IDriveLocalFolderIds = {
  baseFolderId: '',
  textFolderId: '',
  fileFolderId: '',
};

const folderIdStore = new Store({
  schema: {
    folderIds: {
      type: 'object',
      default: defaultFolderIds,
    },
  },
});

export function resetLocalFolderIds() {
  folderIdStore.clear();
}

export function getLocalFolderIds() {
  const folderIds = folderIdStore.get('folderIds');
  return driveLocalFolderIdsSchema.parse(folderIds);
}

export function setLocalFolderIds({
  baseFolderId,
  textFolderId,
  fileFolderId,
}: IDriveLocalFolderIds) {
  folderIdStore.set('folderIds', {
    baseFolderId,
    textFolderId,
    fileFolderId,
  });
  console.log(`[SetLocalFolderIds] folderIds: `, getLocalFolderIds());
}

async function _uploadTextContent(
  args: IClipboardTextContent,
  accessToken: string,
) {
  const file = new Blob([args.text], { type: 'text/plain' });

  const { textFolderId } = driveLocalFolderIdsSchema
    .pick({ textFolderId: true })
    .parse(folderIdStore.get('folderIds'));

  const metadata = {
    name: `synclip_text_${currentTime()}.txt`, // Todo: change file name
    mimeType: 'text/plain',
    parents: [textFolderId], // Google Drive folder id
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
  );
  form.append('file', file);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
    {
      method: 'POST',
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: form,
    },
  );

  if (!response.ok) {
    console.log(await response.json());
    throw new Error('파일 업로드 실패');
  }

  const data = await response.json();
  const content = uploadFileResponseSchema.parse({
    id: data.id,
    name: data.name,
  });

  return textUploadSuccessSchema.parse({
    type: 'text',
    content,
  });
}

async function _uploadFileContents(
  { files }: IClipboardFileContent,
  accessToken: string,
) {
  const uploadResponses: IUplaodFileResponse[] = [];

  const { fileFolderId } = driveLocalFolderIdsSchema
    .pick({ fileFolderId: true })
    .parse(folderIdStore.get('folderIds'));

  for (const file of files) {
    // Assuming you know the mime type and name of the file, or you need to determine it
    const mimeType = 'application/octet-stream'; // Generic binary file mime type, change if needed

    const metadata = {
      mimeType,
      name: file.name,
      parents: [fileFolderId],
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
    );
    form.append('file', new Blob([file.buffer], { type: mimeType }));

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
      {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        body: form,
      },
    );

    if (!response.ok) {
      console.log(await response.json());
      throw new Error('File upload failed');
    }

    const data = await response.json();
    const uploadResponse = uploadFileResponseSchema.parse({
      id: data.id,
      name: data.name,
    });

    uploadResponses.push(uploadResponse);
  }

  return fileUploadSuccessSchema.parse({
    type: 'file',
    contents: uploadResponses,
  });
}

export async function getDrive({
  userId,
  email,
}: Partial<Pick<IUser, 'email'> & Pick<IDrive, 'userId'>>) {
  if (!userId && !email)
    throw new Error('[GetDrive] userId or email is required');

  const endpoint = new URL(`/drive`, BACKEND_BASE_URL);
  if (userId) endpoint.searchParams.append('userId', userId);
  if (email) endpoint.searchParams.append('email', email);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  console.log(`[GetDriveFolders] res: `, data);

  const res = registerFoldersResponseSchema.parse(data);

  switch (res.status) {
    case 'success':
      console.log(`[GetDriveFolders] success`);
      return res.data;

    case 'not_found':
      return null;

    case 'error':
    default:
      console.log(`[GetDriveFolders] error`);
      throw new Error('Unknown error');
  }
}

export async function registerDrive(args: IDriveRegister) {
  const endpoint = new URL('/drive', BACKEND_BASE_URL);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });

  const data = await response.json();
  console.log(`[RegisterFolderIds] res: `, data);

  const res = registerFoldersResponseSchema.parse(data);

  switch (res.status) {
    case 'success':
      console.log(`[RegisterFolderIds] success`);
      return res.data;

    case 'error':
    default:
      console.log(`[RegisterFolderIds] error`);
      throw new Error('[RegisterFolder] Unknown error');
  }
}

export async function createFolder({
  type,
  parentFolderId,
  accessToken,
}: {
  type: 'base' | 'text' | 'file';
  parentFolderId: string;
  accessToken: string;
}) {
  const folderName = `synclip_${type}`;

  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentFolderId], // Google Drive folder id
  };

  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true',
    {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(metadata),
    },
  );

  if (!response.ok) {
    throw new Error('폴더 생성 실패');
  }

  const data = await response.json();
  console.log(`[CreateFolder] data: ${data}`);

  return data;
}

/**
 * create synclip folders
 * synclip_base is under the root.
 * synclip_text and synclip_file are under the synclip_base
 */
export async function initGoogleDrive(userId: string) {
  const accessToken = await getGoogleAccessToken();

  if (!accessToken) throw new Error('[CreateFolder] No access token');

  const { id: baseFolderId } = await createFolder({
    type: 'base',
    parentFolderId: 'root',
    accessToken,
  });

  const { id: textFolderId } = await createFolder({
    type: 'text',
    parentFolderId: baseFolderId,
    accessToken,
  });

  const { id: fileFolderId } = await createFolder({
    type: 'file',
    parentFolderId: baseFolderId,
    accessToken,
  });

  const drive = driveRegisterSchema.parse({
    userId,
    baseFolderId,
    textFolderId,
    fileFolderId,
  });

  console.log(`[InitGoogleDrive] drive: `, drive);

  setLocalFolderIds(drive);

  return registerDrive(drive);
}

export async function uploadFile(
  args: IClipboardTextContent | IClipboardFileContent,
) {
  const accessToken = await getGoogleAccessToken();

  if (!accessToken) throw new Error('[UploadFile] No access token');

  if (args.type === 'text') {
    const response = await _uploadTextContent(args, accessToken);
    // Todo: notify to server

    return response;
  }

  if (args.type === 'file') {
    return await _uploadFileContents(args, accessToken);
  }

  return null;
}

// Read file from google drive. It's text file.
export async function downloadFileFromGoogleDrive(fileId: string) {
  const accessToken = await getGoogleAccessToken();

  if (!accessToken) throw new Error('[DownloadFile] No access token');

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      method: 'GET',
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    },
  );

  if (!response.ok) {
    throw new Error('파일 다운로드 실패');
  }

  const data = await response.blob();

  // Todo: remove
  console.log(`[DownloadFile] data Type: ${data.type}`);
  console.log(`[DownloadFile] data: ${data}`);
  console.log(`[DownloadFile] data size: ${data.size}`);
  console.log(`[DownloadFile] data text: ${await data.text()}`);

  if (data.type === 'text/plain') {
    writeClipboard(await data.text());

    // Todo: impl
    // showSystemNotification({
    //   title: 'Pasted!',
    //   message: 'Copied from other device!',
    // });
  }

  // Todo: impl binary file download

  return data;
}

export async function syncLocalFolderIds({ email }: { email: string }) {
  const user = await getUser({ email });

  if (!user) {
    console.log(`New account. Reset local folder ids.`);
    resetLocalFolderIds();
    return;
  }

  const drive = await getDrive({ userId: user.id });

  if (!drive) {
    await initGoogleDrive(user.id);
    return;
  }

  const { baseFolderId, textFolderId, fileFolderId } = getLocalFolderIds();

  // Sync local folder ids
  if (
    drive.baseFolderId !== baseFolderId ||
    drive.textFolderId !== textFolderId ||
    drive.fileFolderId !== fileFolderId
  ) {
    console.log(`[SyncLocalFolderIds] Sync local folder ids`);
    setLocalFolderIds(drive);
  }
}
