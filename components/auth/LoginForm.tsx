/**
 * ログインフォーム・エラー描画担当
 */

"use client";

import { login } from "@/actions/auth";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div>
      <form action="post" method="post">
        <Input type="text" name="loginId" />
        <Input type="password" name="password" />
        <Button />
      </form>
    </div>
  );
}
