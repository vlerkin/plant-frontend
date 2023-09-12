import { z } from "zod";

export const checkUserInfo = z.object({
  name: z.string(),
  email: z.string().email(),
  photo: z.string().nullable(),
});
export type UserInfo = z.infer<typeof checkUserInfo>;

export const checkTokenInfo = z.array(
  z.object({
    token: z.string(),
    nameToken: z.string(),
    userId: z.number().int(),
    id: z.number().int(),
    startDate: z.string(),
    endDate: z.string(),
  })
);

export type AccessTokenInfo = z.infer<typeof checkTokenInfo>;
