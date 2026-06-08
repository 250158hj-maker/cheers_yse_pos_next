import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";

export const { headers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        loginId: { label: "ログインID", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        // ログインフォーム入力バリデーション検証
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        // ログインIDでDB照合
        const { loginId, password } = validated.data;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.loginId, loginId))
          .limit(1);
        if (!user) return null;

        // パスワードハッシュ検証
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // 初回リクエスト時にJWTセッションのトークンに保持する要素群
        return {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // 初回リクエストのみCredential Providerからトークンに詰める
      if (user) {
        token.sub = user.id;
        token.isAdmin = (user as { isAdmin: boolean }).isAdmin;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});
