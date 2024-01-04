import { getGoogleAccessToken } from './authService';
import {
  IClipboardFileContent,
  IClipboardTextContent,
} from '../types/clipboardTypes';
import {
  fileUploadSuccessSchema,
  textUploadSuccessSchema,
  uploadFileResponseSchema,
} from '../schemas/googleDriveSchema';
import { IUplaodFileResponse } from '../types/googleDriveTypes';

async function _uploadTextContent(
  args: IClipboardTextContent,
  accessToken: string,
) {
  const file = new Blob([args.text], { type: 'text/plain' });

  const latestFolderId = 'root';
  const metadata = {
    name: 'SAMPLE_IPC_MAIN.txt', // Todo: change file name
    mimeType: 'text/plain',
    parents: [latestFolderId], // Google Drive folder id
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
  const latestFolderId = 'root'; // Google Drive folder id where files will be uploaded
  const uploadResponses: IUplaodFileResponse[] = [];

  for (const file of files) {
    // Assuming you know the mime type and name of the file, or you need to determine it
    const mimeType = 'application/octet-stream'; // Generic binary file mime type, change if needed

    const metadata = {
      name: file.name,
      mimeType: mimeType,
      parents: [latestFolderId],
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
