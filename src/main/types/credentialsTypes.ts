import { z } from 'zod';
import { credentialsSchema } from '../schemas/credentialsSchema';

export type ICredentials = z.infer<typeof credentialsSchema>;
