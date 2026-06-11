/**
 * 認証ロジック本体
 * ユーザーの入力アクションに応じてリダイレクトやエラーを返す
 */

"use server";

import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function login(_prevState: unknown, formData: FormData) {
  // Zodによるフォーム入力バリデーション
  const validated = loginSchema.safeParse({
    loginId: formData.get("loginId"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return {
      success: false,
      error: "ログインIDまたはパスワードが正しくありません",
    };
  }

  // Auth.jsによる認証
  try {
    // lib/auth.ts authorizeメソッドが実行される
    await signIn("credentials", {
      ...validated.data,
      redirect: false,
    });
  } catch (error) {
    // ログイン認証エラーハンドリング
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "ログインIDまたはパスワードが正しくありません",
      };
    }
    // 汎用エラーハンドリング
    console.error("[LOGIN]", error);
    return {
      success: false,
      error: "サーバーエラーが発生しました",
    };
  }

  // proxy.tsを発動させる
  redirect("/login");
}

export async function logout() {
  // エラーハンドリング不要なのでAuth.jsにリダイレクトを任せる
  await signOut({ redirectTo: "/login" });
}
