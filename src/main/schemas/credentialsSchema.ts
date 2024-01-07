import { z } from 'zod';

export const credentialsSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string(),
});
