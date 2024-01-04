// import { useCheckAuth } from '../../hooks/useCheckAuth';

const { ipcRenderer } = window.electron;

export default function AuthButton() {
  // const { isAuthenticated, checkIsLoggedIn } = useCheckAuth();
  // const login = useGoogleLogin({
  //   flow: 'auth-code',
  //   ux_mode: 'redirect',
  //   redirect_uri: 'http://localhost:1212/login',
  //   scope: GOOGLE_SCOPES.join(' '),
  //   onSuccess: (res) => {
  //     console.log('success', res);
  //     ipcRenderer.sendMessage('custom-auth', res);
  //   },
  //   onError: (err) => {
  //     console.log('AuthButton error', err);
  //   },
  //   onNonOAuthError: (err) => {
  //     console.log('AuthButton non-oauth error', err);
  //   },
  // });
  const handleClick = () => {
    // checkIsLoggedIn();
    ipcRenderer.sendMessage('authorize');
  };
  //
  // ipcRenderer.once('is-authenticated', (arg) => {
  //   console.log('ONCE is-authenticated');
  //   console.log(arg);
  // });

  return (
    // <button type="button" onClick={() => login()}>
    //   Google login
    // </button>
    <div>
      {/* {isAuthenticated && <p>You are here</p>} */}
      <button type="button" onClick={handleClick}>
        AUTH
      </button>
    </div>
  );
}
