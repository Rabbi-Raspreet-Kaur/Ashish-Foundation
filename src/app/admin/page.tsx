"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-forest/20 border-t-forest rounded-full animate-spin" />
        <span className="text-xs text-charcoal-light font-medium">Opening Admin Dashboard...</span>
      </div>
    </div>
  );
}
