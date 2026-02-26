
import { z } from 'zod';

export const CreateUserSchame = z
  .object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
  })
  .required();

export type CreateUserDto = z.infer<typeof CreateUserSchame>;

export const SignInUserSchame = z
  .object({
    email: z.email(),
    password: z.string(),
  })
  .required();

export type SignInUserDto = z.infer<typeof SignInUserSchame>;
