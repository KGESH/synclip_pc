// import { google } from 'googleapis';
//
// // const KEY_FILE_PATH = path.join(__dirname, 'cred.json');
//
// export default async function GoogleDriveClient() {
//   try {
//     // const accessToken = token;
//     const auth = new google.auth.OAuth2({
//       clientId:
//         '783314884462-f8hatqio96as20jcmbpq0tn1eqm3ak04.apps.googleusercontent.com',
//       clientSecret: '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',
//       redirectUri: 'http://localhost:1212',
//     });
//
//     const accessToken = await auth.getAccessToken();
//
//     const fileContent = new Date().toISOString(); // fileContent can be text, or an Uint8Array, etc.
//     const file = new Blob([fileContent], { type: 'text/plain' });
//
//     const latestFolderId = 'root';
//
//     const metadata = {
//       name: 'ElectronSampleFile.txt',
//       mimeType: 'text/plain',
//       parents: [latestFolderId], // Google Drive folder id
//     };
//
//     const form = new FormData();
//     form.append(
//       'metadata',
//       new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
//     );
//     form.append('file', file);
//
//     const response = await fetch(
//       'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
//       {
//         method: 'POST',
//         headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
//         body: form,
//       },
//     );
//
//     if (!response.ok) {
//       console.log('파일 업로드 실패');
//     }
//
//     const data = await response.json();
//
//     console.log('파일 업로드 결과:', data);
//     console.log('파일 ID:', data.id);
//     console.log('파일 이름:', data.name);
//
//     return data;
//   } catch (err) {
//     console.error(err);
//   }
// }
