/**
 * DDLをDrizzleKitを用いてCLI経由で実行するためにNeonのDB情報を設定している
 * PHP版ではDDLは特定のURLにアクセスすることで実行していた
 * このファイルはアプリケーション実行には一切関係のないファイル
 */

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
