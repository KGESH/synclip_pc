import Store from 'electron-store';
import { getMacAddress } from '../util';

export const appStore = new Store({
  schema: {
    macAddress: {
      type: 'string',
      default: getMacAddress(),
    },
  },
});
