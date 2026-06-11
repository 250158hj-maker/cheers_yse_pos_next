/**
 * ログインフォーム・エラー描画担当
 */

"use client";

import { login } from "@/actions/auth";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div>
      <form action="post" method="post">
        <input type="text" name="loginId" />
        <input type="password" name="password" />
      </form>
    </div>
  );
}
