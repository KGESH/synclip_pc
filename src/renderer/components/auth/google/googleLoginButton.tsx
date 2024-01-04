// // import { useGoogleLogin } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// // import { useState } from 'react';
// import { useGoogleDrive } from '../../hooks/useGoogleDrive';
//
// export default function GoogleLoginButton() {
//   // const [token, setToken] = useState('');
//   // useGoogleDrive();
//
//   return (
//     <GoogleLogin
//       useOneTap
//       auto_select
//       onSuccess={(credentialResponse) => {
//         console.log(credentialResponse);
//         // setToken(credentialResponse.credential ?? '');
//         // const accessToken = credentialResponse.credential;
//
//         // eslint-disable-next-line promise/catch-or-return
//         // drive.files
//         //   .list({
//         //     pageSize: 10,
//         //     fields: 'files(id, name)',
//         //   })
//         //   // eslint-disable-next-line promise/always-return
//         //   .then((response) => {
//         //     console.log(response);
//         //   });
//       }}
//       onError={() => {
//         console.log('Login Failed');
//       }}
//     />
//   );
// }
