/**
 * ユーザーのフォームに対してバリデーションを定義
 * PHP版ではそもそも実装していないorHTML標準の機能だけで実装していた
 */

import z from "zod";

// ログインフォーム入力
export const loginSchema = z.object({
  loginId: z.string().regex(/^\d{4}$/, "ログインIDが正しくありません。"),
  password: z.string().regex(/^\d{4}$/, "パスワードが正しくありません。"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "カテゴリ名は必須です。")
    .max(50, "カテゴリ名が長すぎます。"),
});

export type createCategoryInput = z.infer<typeof createCategorySchema>;
