const { ipcRenderer } = window.electron;

export default function AuthButton() {
  const handleClick = () => {
    ipcRenderer.sendMessage('authorize');
  };

  return (
    <div>
      {/* {isAuthenticated && <p>You are here</p>} */}
      <button type="button" onClick={handleClick}>
        AUTH
      </button>
    </div>
  );
}
