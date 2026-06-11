// 管理者ルートグループのレイアウト（認証ガードは proxy.ts に集約）
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
