import Store from 'electron-store';

export const store = new Store({
  schema: {
    readClipboard: {
      type: 'string',
      default: 'Shift+C',
    },
  },
});
