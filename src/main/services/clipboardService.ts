import * as fs from 'fs';
import * as ClipboardEx from 'electron-clipboard-ex';
import { clipboard } from 'electron';
import { IClipboardContent, IFile } from '../types/clipboardTypes';
import {
  clipboardFileContentSchema,
  clipboardErrorSchema,
  clipboardTextContentSchema,
  fileSchema,
} from '../schemas/clipboardSchema';

export async function readClipboard(): Promise<IClipboardContent> {
  const filePaths = ClipboardEx.readFilePaths();

  // Text content
  if (filePaths.length === 0) {
    const text = clipboard.readText();
    console.log(`clipboard text: ${text}`);
    return clipboardTextContentSchema.parse({
      type: 'text',
      text,
    });
  }

  // Binary content
  if (filePaths.length >= 1) {
    const filePromises = filePaths.map((filePath) => {
      return new Promise<IFile>((resolve, reject) => {
        fs.readFile(filePath, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            const file = fileSchema.parse({
              name: filePath,
              path: filePath,
              buffer,
            });
            console.log(`File read: ${file}`);
            resolve(file);
          }
        });
      });
    });

    try {
      const files = await Promise.all(filePromises);

      // Todo: upload to google drive
      // Todo: notify to server
      // buffers.forEach((buffer, index) => {
      // fs.writeFileSync(path[index] + '.hello', buffer);
      // });

      console.log('All files read successfully.');
      return clipboardFileContentSchema.parse({ type: 'file', files });
    } catch (error) {
      console.error('Error reading files:', error);
      return clipboardErrorSchema.parse({
        type: 'error',
        message: JSON.stringify(error),
      });
    }
    // Todo: upload files to google drive
  }

  return clipboardErrorSchema.parse({
    type: 'error',
    message: 'Unknown clipboard read error',
  });
}

// Todo: 푸시 알림 수신하면 구글 드라이브에서 파일 다운로드.
// 임시 로컬 디렉토리에 파일 저장.
// 클립보드에 파일 경로 저장.
// paste 이벤트 감지시 클립보드 파일 경로를 읽어서 파일 write.
export function writeFilePaths(filePaths: string[]) {
  ClipboardEx.writeFilePaths(filePaths);
}

export function writeClipboard(content: string) {
  console.log(`write clipboard content: ${content}`);

  // clipboard.writeText(content);

  // clipboardEx.writeFilePaths(filePaths);
}
