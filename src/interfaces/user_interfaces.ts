import { z } from "zod";

export const checkAuthUser = z.object({
  name: z.string(),
  email: z.string(),
  photo: z.string().nullable(),
  is_guest: z.boolean(),
});
export type AuthUser = z.infer<typeof checkAuthUser>;
