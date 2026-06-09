import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center space-y-5">
        <div className="text-5xl">🔒</div>
        <div>
          <h1 className="font-bold text-gray-800 text-xl">アクセス権限がありません</h1>
          <p className="text-sm text-gray-500 mt-2">
            このページを表示する権限がありません。
            <br />
            別のアカウントでログインしてください。
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors"
        >
          ログイン画面へ
        </Link>
      </div>
    </div>
  );
}
