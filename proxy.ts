/**
 * 認証ガードミドルウェア
 * 認証情報とロールに応じてそれぞれのURLへリダイレクト
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * 認証ガード（URLへの侵入を防ぐ）
 */

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // 認証済みならオブジェクト(true), 未認証ならNull
  const isLoggedIn = req.auth;
  const isAdmin = req.auth?.user.isAdmin;

  // 未認証 → ログイン画面へ
  // 未認証ユーザーがログイン画面へ遷移する場合だけ通過（無限ループ防止）
  if (!isLoggedIn && !(pathname === "/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 認証済み → ロールに応じて別々のページへリダイレクト
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/register", req.url),
    );
  }

  // スタッフの管理者画面遷移ブロック
  if (!isAdmin && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // 管理者のレジ画面遷移ブロック
  if (isAdmin && pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/register/:path*", "/admin/:path*"],
};
