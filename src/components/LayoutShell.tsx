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
  const isUserRoute = pathname.startsWith("/user");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = isUserRoute || isAdminRoute;
  const hideShell = HIDE_SHELL_ROUTES.some((route) => pathname.startsWith(route));

  // Client-side route protection guard with fixed, stable dependencies
  useEffect(() => {
    if (!loading) {
      const isUser = pathname.startsWith("/user");
      const isAdminPath = pathname.startsWith("/admin");
      const userIsAdmin = user?.role === "admin";

      if (isAuthPage && user) {
        // Authenticated users cannot stay on login/signup -> redirect to dashboard (admin) or home (user)
        if (userIsAdmin) {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/");
        }
      } else if (isAdminPath) {
        if (!user) {
          router.replace("/login");
        } else if (!userIsAdmin) {
          router.replace("/");
        }
      } else if (isUser && !user) {
        router.replace("/login");
      }
    }
  }, [loading, isAuthPage, user, router, pathname]);

  // While checking auth on protected routes (/user/*, /admin/*), show clean loader to prevent content flash
  if (loading && isProtectedRoute) {
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

  // Prevent flash of protected content while redirecting unauthenticated users
  if (!loading && !user && isProtectedRoute) {
    return null;
  }

  // Prevent flash if standard user is attempting to access admin route
  if (!loading && user && isAdminRoute && !isAdmin && user.role !== "admin") {
    return null;
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
