import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    isAdmin: boolean;
  }
  interface Session {
    user: {
      id: number;
      isAdmin: boolean;
    } & Omit<DefaultSession["user"], "id">;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean;
  }
}
