/**
 * ユーザーのフォームに対してバリデーションを定義
 * PHP版ではそもそも実装していないorHTML標準の機能だけで実装していた
 */

import z from "zod";

export const loginSchema = z.object({
  loginId: z.string().regex(/^\d{4}$/, "ログインIDが正しくありません。"),
  password: z.string().regex(/^\d{4}$/, "パスワードが正しくありません。"),
});

export type LoginInput = z.infer<typeof loginSchema>;
