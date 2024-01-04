import * as fs from 'fs';
import * as ClipboardEx from 'electron-clipboard-ex';
import { clipboard } from 'electron';
import { ClipboardContent } from '../types/clipboardTypes';
import {
  clipboardFileContentSchema,
  clipboardErrorSchema,
  clipboardTextContentSchema,
} from '../schemas/clipboardSchema';

export async function readClipboard(): Promise<ClipboardContent> {
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
    const buffersPromise = filePaths.map((filePath) => {
      return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filePath, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            console.log(`File read: ${filePath}`);
            resolve(buffer);
          }
        });
      });
    });

    try {
      const buffers = await Promise.all(buffersPromise);

      // Todo: upload to google drive
      // Todo: notify to server
      // buffers.forEach((buffer, index) => {
      // fs.writeFileSync(path[index] + '.hello', buffer);
      // });

      console.log('All files read successfully.');
      return clipboardFileContentSchema.parse({ type: 'file', buffers });
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
