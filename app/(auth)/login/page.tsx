/**
 * ログイン画面全体レイアウト描画担当
 */

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight">
          CHEERS POS NEXTJS
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
