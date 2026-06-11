/**
 * シードデータ投入スクリプト
 * DDL同様CLIから直接実行する
 */

import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Next.jsから実行しないので、明示的にenvファイルの読み込み
dotenv.config({ path: ".env.local" });

const seedUsers = [
  { name: "管理者", loginId: "0000", password: "0000", isAdmin: true },
  { name: "スタッフ", loginId: "1111", password: "1111", isAdmin: false },
];

async function seed() {
  // 環境変数をセットしてから読み込みたいファイルなので動的インポート
  const { db } = await import("@/lib/db");
  const { users } = await import("@/lib/db/schema");

  console.log("シードデータ投入中...");
  try {
    for (const user of seedUsers) {
      const hashed = await bcrypt.hash(user.password, 10);
      await db.insert(users).values({
        name: user.name,
        loginId: user.loginId,
        password: hashed,
        isAdmin: user.isAdmin,
      });
      console.log(`挿入完了： ${user.name} (loginId: ${user.loginId})`);
    }
    console.log("完了しました");
    process.exit(0);
  } catch (error) {
    console.error("[SEED]", error);
    process.exit(1);
  }
}

seed();
