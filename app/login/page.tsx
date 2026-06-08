import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-white text-2xl font-bold">難波商店街</h1>
          <p className="text-red-200 text-sm mt-1">BCPマップシステム</p>
          <div className="mt-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full inline-block">
            ⚠ 災害時モード稼働中
          </div>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-gray-800 font-bold text-lg mb-5 text-center">ログイン</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                defaultValue="store1@namba.jp"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="例: store1@namba.jp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                defaultValue="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="パスワード"
              />
            </div>

            {/* 店舗ユーザーとして入る */}
            <Link
              href="/store"
              className="block w-full bg-red-600 text-white font-bold py-3 rounded-lg text-center text-base hover:bg-red-700 transition-colors mt-2"
            >
              店舗ユーザーとしてログイン
            </Link>

            {/* 管理者として入る */}
            <Link
              href="/admin"
              className="block w-full bg-blue-700 text-white font-bold py-3 rounded-lg text-center text-base hover:bg-blue-800 transition-colors"
            >
              管理者としてログイン
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            ※これはモックです。ボタンで各画面に遷移できます
          </p>
        </div>

        <p className="text-red-200 text-xs text-center mt-4">
          パスワードを忘れた場合は管理者にお問い合わせください
        </p>
      </div>
    </div>
  );
}
