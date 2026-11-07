"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";

const HIDE_SHELL_ROUTES = ["/admin", "/user", "/login", "/signup"];

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const hideShell = HIDE_SHELL_ROUTES.some((route) => pathname.startsWith(route));

  // Client-side route protection guard
  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthPage) {
        // Unauthenticated access -> immediately redirect to login
        router.replace("/login");
      } else if (user && isAuthPage) {
        // Authenticated users cannot stay on login/signup -> redirect to dashboard
        if (isAdmin) {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      }
    }
  }, [user, loading, isAuthPage, isAdmin, router]);

  // While checking auth on protected routes, show clean loader to prevent content flash
  if (loading && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-white/70 tracking-wide font-medium">
            Verifying secure session...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated and not on an auth page, prevent rendering protected content while redirect completes
  if (!user && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-white/70 tracking-wide font-medium">
            Redirecting to login...
          </span>
        </div>
      </div>
    );
  }

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
