import { z } from 'zod';

const { appStore } = window.electron;

export const macAddress = z.string().parse(appStore.get('macAddress'));
