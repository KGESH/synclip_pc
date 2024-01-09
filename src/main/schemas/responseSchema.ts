import { z } from 'zod';

export const responseErrorSchema = z.object({
  status: z.union([z.literal('error'), z.literal('not_found')]),
  message: z.string(),
});

function createResponseSuccessSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    status: z.literal('success'),
    data: schema,
  });
}

export const createResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([createResponseSuccessSchema(schema), responseErrorSchema]);
