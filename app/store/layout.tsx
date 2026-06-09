"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/currentUser";
import { ProfileProvider } from "@/lib/auth/ProfileContext";
import type { Profile } from "@/types";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    getCurrentProfile().then((p) => {
      if (!p) {
        router.replace("/login");
        return;
      }
      if (p.role !== "store") {
        router.replace("/unauthorized");
        return;
      }
      if (!p.storeId) {
        // store ロールだが店舗未紐づけ
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
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">認証確認中...</p>
        </div>
      </div>
    );
  }

  if (profile === null) return null;

  return <ProfileProvider profile={profile}>{children}</ProfileProvider>;
}
