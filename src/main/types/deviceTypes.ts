import { z } from 'zod';
import { deviceSchema } from '../schemas/deviceSchema';

export type IDeviceType = z.infer<typeof deviceSchema>;

export type IDevice = z.infer<typeof deviceSchema>;
