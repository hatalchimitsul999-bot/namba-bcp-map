"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface AppHeaderProps {
  title: string;
  backHref?: string;
  rightContent?: React.ReactNode;
  showLogout?: boolean;
  variant?: "store" | "admin";
}

export default function AppHeader({
  title,
  backHref,
  rightContent,
  showLogout,
  variant = "store",
}: AppHeaderProps) {
  const router = useRouter();
  const bgColor = variant === "admin" ? "bg-blue-800" : "bg-red-600";
  const hasRight = rightContent || showLogout;

  const handleLogout = async () => {
    try { localStorage.removeItem("current_store_id"); } catch { /* ignore */ }
    try { await supabase?.auth.signOut(); } catch { /* ignore */ }
    router.replace("/login");
  };

  return (
    <header
      className={`${bgColor} text-white px-4 py-3 flex items-center justify-between shadow-md`}
    >
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="text-white hover:text-white/80 text-xl font-bold"
          >
            ←
          </Link>
        )}
        <h1 className="text-base font-bold leading-tight">{title}</h1>
      </div>
      {hasRight && (
        <div className="flex items-center gap-2">
          {rightContent}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="text-white text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              ログアウト
            </button>
          )}
        </div>
      )}
    </header>
  );
}
