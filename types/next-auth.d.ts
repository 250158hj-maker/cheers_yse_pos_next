/**
 * Typescriptの型定義
 * Auth.jsに組み込まれているuserにはisAdminプロパティを持っていない
 * コンパイラに覚えされるためにオーバライドしている
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    isAdmin: boolean;
  }
  interface Session {
    user: {
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean;
  }
}
