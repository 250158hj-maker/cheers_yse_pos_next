/**
 * Next.jsの設定
 * フレームワーク側で静的に制御委することで簡単かつ高パフォーマンスなリダイレクトを実装可能
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
