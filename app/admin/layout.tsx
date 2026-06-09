"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/currentUser";
import { ProfileProvider } from "@/lib/auth/ProfileContext";
import type { Profile } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // undefined = 確認中 / null = 未認証またはリダイレクト中 / Profile = 認証済み
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    getCurrentProfile().then((p) => {
      if (!p) {
        router.replace("/login");
        return;
      }
      if (p.role !== "admin") {
        router.replace("/unauthorized");
        return;
      }
      setProfile(p);
    });
  }, [router]);

  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">認証確認中...</p>
        </div>
      </div>
    );
  }

  if (profile === null) return null;

  return <ProfileProvider profile={profile}>{children}</ProfileProvider>;
}
