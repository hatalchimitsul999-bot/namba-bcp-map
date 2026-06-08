"use client";
import Link from "next/link";

interface AppHeaderProps {
  title: string;
  backHref?: string;
  rightContent?: React.ReactNode;
  showLogout?: boolean;
  variant?: "store" | "admin";
}

export default function AppHeader({ title, backHref, rightContent, showLogout, variant = "store" }: AppHeaderProps) {
  const bgColor = variant === "admin" ? "bg-blue-800" : "bg-red-600";

  const hasRight = rightContent || showLogout;

  return (
    <header className={`${bgColor} text-white px-4 py-3 flex items-center justify-between shadow-md`}>
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref} className="text-white hover:text-white/80 text-xl font-bold">
            ←
          </Link>
        )}
        <h1 className="text-base font-bold leading-tight">{title}</h1>
      </div>
      {hasRight && (
        <div className="flex items-center gap-2">
          {rightContent}
          {showLogout && (
            <Link
              href="/login"
              className="text-white text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              ログアウト
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
