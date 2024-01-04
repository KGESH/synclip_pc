import { z } from 'zod';
import { userSchema } from '../schemas/userSchema';

export type IUser = z.infer<typeof userSchema>;
