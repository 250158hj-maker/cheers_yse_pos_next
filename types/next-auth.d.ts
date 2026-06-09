import type { DefaultSession } from "next-auth";

/**
 * Auth.jsに組み込まれているuserにはisAdminプロパティを持っていない
 * コンパイラに覚えされるためにオーバライドしている
 */

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
