import Store from 'electron-store';

export const defaultCurrentDevice = {
  id: '',
  userId: '',
  alias: '',
  deviceType: 'PC',
  fcmToken: '',
};

export const store = new Store({
  schema: {
    currentDevice: {
      type: 'object',
      default: defaultCurrentDevice,
    },
    // Shortcuts
    readClipboard: {
      type: 'string',
      default: 'Shift+C',
    },
  },
});

export function setDefaultCurrentDevice() {
  store.set('currentDevice', defaultCurrentDevice);
}
