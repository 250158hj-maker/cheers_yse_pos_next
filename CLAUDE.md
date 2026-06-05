v1.0
作成日：2026-06-05
更新日：2026-06-05

---

# CLAUDE.md — YSEレジシステム（Next.js版）

## プロジェクト概要

飲食店向け小規模POSシステム（YSEレジシステム）のNext.js実装。  
PHPで実装した `cheers_yse_pos` を技術スタック移行した個人学習プロジェクト。

---

## 設計書

実装はすべて以下の設計書に基づいて行う。実装前に必ず該当箇所を確認すること。

```
docs/
├── 要件定義書.md   # システムの目的・機能要件・スコープ外・非機能要件
└── 基本設計書.md   # 画面一覧・画面遷移・ルーティング・ディレクトリ構成・ER図
```

---

## 技術スタック

|項目|内容|
|---|---|
|フレームワーク|Next.js 16 (App Router)|
|言語|TypeScript|
|スタイリング|Tailwind CSS v4 + shadcn/ui|
|ORM|Drizzle ORM|
|データベース|PostgreSQL（Neon）|
|認証|Auth.js v5|
|バリデーション|Zod|
|パッケージ管理|pnpm|
|デプロイ|Vercel|

---

## アーキテクチャの原則

### Server Component がデフォルト

Next.js のコンポーネントはデフォルトでサーバーサイドで実行される。  
`'use client'` はインタラクション（状態・イベントハンドラ）が必要な最小範囲にだけ追加する。

```
判断フロー
  データ取得・表示だけ → Server Component（'use client'不要）
  useState / onClick など → Client Component（'use client'必須）
```

### ミューテーションは Server Actions

データの作成・更新・削除は Server Actions で処理する。  
PHP の POST ファイル（`store.php`・`delete.php` など）に相当するが、  
HTTP エンドポイントではなく TypeScript の関数として定義する。

```typescript
// actions/products.ts
'use server'

export async function createProduct(data: unknown) {
  // 1. Zod でバリデーション
  // 2. auth() でセッション確認
  // 3. Drizzle で DB 操作
  // 4. revalidatePath でキャッシュ更新
}
```

### lib/db/schema.ts が Single Source of Truth

Drizzle のスキーマ定義がシステム全体の型の起点。  
テーブル定義から TypeScript の型を導出する。DB 構造の定義をこのファイル以外に書かない。

```typescript
// lib/db/schema.ts（ここだけが DB 構造の真実）
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  // ...
});

// 型はスキーマから派生させる。別途 interface を定義しない
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
```

### ルート保護は proxy.ts に集約

認証ガードは各ページに書かず、`proxy.ts` に集約する（Next.js 16）。  
PHP の `Auth.php` によるリダイレクト処理に相当する。

---

## ディレクトリ構成の原則

```
yse-pos-next/
│
├── app/                              # ルーティング（App Router）
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx             # /login — SCR-01
│   ├── (staff)/
│   │   ├── layout.tsx               # スタッフ認証レイアウト
│   │   └── register/
│   │       └── page.tsx             # /register — SCR-02
│   ├── (admin)/
│   │   ├── layout.tsx               # 管理者認証レイアウト
│   │   └── admin/
│   │       ├── page.tsx             # /admin — SCR-03
│   │       └── products/
│   │           └── page.tsx         # /admin/products — SCR-04
│   ├── layout.tsx                   # ルートレイアウト
│   └── page.tsx                     # / → /login にリダイレクト
│
├── actions/                         # Server Actions（ミューテーション）
│   ├── auth.ts                      # login / logout
│   ├── products.ts                  # 商品 CRUD
│   └── checkout.ts                  # 計上処理
│
├── components/
│   ├── ui/                          # shadcn/ui（自動生成・直接編集しない）
│   └── [feature]/                   # 機能別カスタムコンポーネント
│
├── lib/
│   ├── db/
│   │   ├── schema.ts                # Drizzle スキーマ（SSoT）
│   │   └── index.ts                 # Neon + Drizzle 接続
│   ├── auth.ts                      # Auth.js v5 設定
│   └── validations.ts               # Zod スキーマ
│
├── proxy.ts                         # ルート保護（Next.js 16）
├── .env.local                       # 環境変数（Git 管理外）
├── .env.example                     # 環境変数のサンプル（Git 管理・値なし）
└── drizzle.config.ts                # Drizzle Kit 設定
```

**PHP との対応関係**

|PHP（cheers_yse_pos）|Next.js（本プロジェクト）|
|---|---|
|`public/*.php`（画面）|`app/**/page.tsx`|
|`public/login.php`（POST）|`actions/auth.ts`（Server Action）|
|`public/*/store.php`（POST）|`actions/products.ts`（Server Action）|
|`src/Auth.php`|`lib/auth.ts` + `proxy.ts`|
|`src/Database.php`|`lib/db/index.ts`|
|`src/Product.php` / `src/Sale.php`|`actions/products.ts` / `actions/checkout.ts`|
|`views/*.php`|`components/`|
|`.htaccess`（ディレクトリ保護）|`proxy.ts`（ルート保護）|

> **重要な概念の違い：** PHP では `public/` 配下のファイルだけが外部から見える。  
> Next.js では `app/` 内の `page.tsx` だけがルートとして公開される。  
> `actions/`・`lib/`・`components/` は HTTP で直接アクセスできない。  
> アクセス制御の責務が「ファイルシステム」から「フレームワーク」に移っている。

---

## 言語・コミットルール

- **コードコメント・コミットメッセージはすべて日本語**で書く
- コミットメッセージの形式：`種別: 内容`

```
# 種別の例
feat: 新しい機能の追加
fix: 不具合の修正
docs: ドキュメントのみの変更
style: フォーマットの修正
refactor: リファクタリング・構造の変更
chore: 環境設定・依存関係など

# 例
feat: 商品登録フォームを追加
fix: 消費税計算の丸め誤差を修正
refactor: 計上処理を Server Action に切り出す
docs: 基本設計書に ER 図を追加
```

---

## 実装前の確認ルール

**実装に入る前に必ず以下を説明し、許可が出るまでコードを書き始めない。**  
1機能ごとに完全に止まり、許可を待つ。複数機能を一度に実装しない。

```
【実装前確認】
1. 何を実装するか（対象ファイル・機能の概要）
2. どういう方針で実装するか
   - Server Component か Client Component か
   - Server Action を使うか、route handler を使うか
   - 認証チェックが必要か
3. 設計書を参照しても不明瞭な点があれば明示する
```

設計書と実装の間に矛盾が生じた場合は**実装を止めて報告する**。自己判断で設計を変えない。

---

## コード品質の原則

### データ管理

- `lib/db/schema.ts` のスキーマ定義を型の唯一の起点とする（Single Source of Truth）
- 同じデータを複数箇所で管理しない。導出できる値は必ず導出する

### 責任の分離

- Server Component はデータ取得とレイアウトに集中する。ビジネスロジックを書かない
- Client Component はインタラクション（状態・イベント）のみを担当する
- Server Actions は `バリデーション → 認証確認 → DB操作` の順で処理する
- 1つの関数は1つのことだけ行う
- 変数・関数名は意図が伝わる名前にする（`data`・`tmp`・`flag` などは使わない）

### エラーハンドリング

- `catch` の中を空にしない
- Server Actions は `{ success, error }` の形式でエラーを返す。例外を呼び出し元に投げない

```typescript
// Server Action のエラー返却パターン
export async function createProduct(data: unknown) {
  try {
    // ...
    return { success: true };
  } catch (error) {
    // エラーログを残しつつ、クライアントには安全なメッセージを返す
    console.error('[createProduct]', error);
    return { success: false, error: '商品の登録に失敗しました' };
  }
}
```

### コメント

コードを読めばわかることは書かない。**なぜそう実装したか（理由・背景）**を書く。

```typescript
// NG：コードそのままの説明
// price を整数に変換する
const price = parseInt(rawPrice, 10);

// OK：判断の根拠を残す
// 金額は円単位の整数で管理。Drizzle スキーマも integer 型に揃えており、
// 小数点以下はここで切り捨てることで計算誤差の蓄積を防ぐ
const price = parseInt(rawPrice, 10);
```

---

## Next.js セキュリティルール

### 入力バリデーション

- Server Actions の引数は必ず Zod でバリデーションしてから DB に渡す
- Client 側のバリデーションは UX 補助。セキュリティの担保はサーバー側（Server Action）のみ

```typescript
// lib/validations.ts に Zod スキーマを定義
export const createProductSchema = z.object({
  name: z.string().min(1, '商品名は必須です').max(100),
  price: z.number().int().positive('金額は正の整数で入力してください'),
  categoryId: z.number().int().positive(),
  isTakeout: z.boolean(),
});

// actions/products.ts で使用
const validated = createProductSchema.safeParse(data);
if (!validated.success) {
  return { success: false, error: '入力値が不正です' };
}
```

### 認証・セッション

- セッション確認には `auth()` from Auth.js を使う。手動で session を操作しない
- `proxy.ts` でルート全体を保護する。各ページで個別に認証チェックを書かない

```typescript
// Server Action 内での認証確認パターン
import { auth } from '@/lib/auth';

export async function deleteProduct(id: number) {
  // DB 操作の前に必ず認証確認
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return { success: false, error: '権限がありません' };
  }
  // ...
}
```

### `'use client'` の制限

- Server Component の利点（DB 接続情報がクライアントに漏れない・SEO）を損なわないために  
    `'use client'` を安易に追加しない
- データ取得ロジックを Client Component に書かない

### 環境変数

- `NEXT_PUBLIC_` プレフィックスのない変数はサーバーサイドのみで参照される
- DB 接続文字列・Auth シークレットには `NEXT_PUBLIC_` を付けない

---

## 環境変数

以下を `.env.local` に定義する。コードに直接書かない。  
`.env.example` に変数名のみ（値なし）を記載して Git 管理する。

```
DATABASE_URL=          # Neon の接続文字列
AUTH_SECRET=           # Auth.js のシークレット（openssl rand -base64 32 で生成）
AUTH_TRUST_HOST=true   # Vercel デプロイ時に必要
```

---

## スコープ外（実装しない機能）

設計書で明示的にスコープ外とされている以下の機能は実装しない。

- 複数管理者アカウントの管理
- 在庫管理機能
- レシート印刷
- レジドロワーとの連携
- 売上の高度な分析・グラフ表示
- スマートフォン・タブレット最適化
- キャッシュレス決済の連携

---

## 禁止事項

|禁止|理由|
|---|---|
|設計書にない機能の追加|スコープ管理の破壊につながる|
|環境変数のハードコード|認証情報・接続情報の漏洩リスク|
|`'use client'` を安易に追加する|Server Component の利点を損なう|
|複数機能の同時実装|レビュー・デバッグが困難になる|
|自己判断での設計変更|設計書との整合性が崩れ、決定の記録が失われる|
|`sql` テンプレートリテラルの乱用|型安全性を失い、SQL インジェクションリスクが生まれる|
|`components/ui/` の直接編集|shadcn/ui の再インストール・アップデート時に変更が消える|