/**
 * ユーザーのフォームに対してバリデーションを定義
 * PHP版ではそもそも実装していないorHTML標準の機能だけで実装していた
 */

import z from "zod";

export const loginSchema = z.object({
  loginId: z.string().regex(/^\d{4}$/, "ログインIDは数字4桁で入力してください"),
  password: z
    .string()
    .regex(/^\d{4}$/, "パスワードは数字4桁で入力してください"),
});

export type LoginInput = z.infer<typeof loginSchema>;
