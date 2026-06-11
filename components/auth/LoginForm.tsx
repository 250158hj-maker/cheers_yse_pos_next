/**
 * ログインフォーム・エラー描画担当
 */

"use client";

import { login } from "@/actions/auth";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <Card>
      <CardContent>
        {/* Server Actionをフォーム送信時に実行する */}
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="loginId" className="text-sm font-medium">
              ログインID
            </label>
            <Input
              id="loginId"
              name="loginId"
              type="text"
              inputMode="numeric"
              maxLength={4}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              パスワード
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              inputMode="numeric"
              maxLength={4}
              required
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          {/* 入力データ処理中の場合にはボタンを無効化する */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
