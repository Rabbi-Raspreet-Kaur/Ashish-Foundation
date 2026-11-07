"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  LogOut,
  Globe,
  ShieldCheck,
  User,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function UserLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-forest/20 border-t-forest rounded-full animate-spin" />
          <span className="text-xs text-charcoal-light font-medium tracking-wide">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col antialiased">
      {/* Clean, Dedicated Dashboard Header */}
      <header className="sticky top-0 z-30 bg-forest text-white shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Left: Branding & Dashboard Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/user/dashboard"
                className="flex items-center gap-3 group"
                aria-label="Ashish Foundation User Dashboard"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-white/20">
                  <Image
                    src="/images/logo.png"
                    alt="Ashish Foundation Logo"
                    fill
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-base md:text-lg font-bold text-white tracking-tight leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Ashish Foundation
                  </span>
                  <span className="text-[10px] md:text-xs text-saffron font-medium tracking-wider uppercase">
                    Supporter Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Return to Public Website"
              >
                <Globe className="w-3.5 h-3.5 text-saffron" />
                <span>Public Website</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-saffron/20 border border-saffron/40 text-saffron hover:bg-saffron hover:text-white transition-all duration-200"
                  title="Switch to Admin Command Center"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {/* User Account Capsule */}
              <div className="flex items-center gap-2 pl-3 border-l border-white/15">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-saffron flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight max-w-[140px] truncate">
                    {user.name || user.email.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-white/60 capitalize">
                    {user.role === "admin" ? "Admin" : "Supporter"}
                  </span>
                </div>
              </div>

              {/* One Single Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 text-saffron" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 bg-forest-dark px-4 py-4 space-y-3"
            >
              {/* User info card in mobile */}
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-saffron">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-white truncate">
                    {user.name || user.email.split("@")[0]}
                  </span>
                  <span className="text-xs text-white/60 truncate">{user.email}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-saffron/20 text-saffron rounded-full">
                  {user.role}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/90 hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4 text-saffron" />
                  <span>Public Website</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-saffron hover:bg-white/10 transition-colors font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-white/10 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Administrator context banner (only if an admin views user dashboard) */}
        {isAdmin && (
          <div className="bg-saffron/15 border-t border-saffron/25 px-4 py-2 text-center text-xs text-saffron">
            You are logged in as Administrator. You can switch to the{" "}
            <Link href="/admin/dashboard" className="underline font-semibold hover:text-white">
              Admin Command Center
            </Link>{" "}
            at any time.
          </div>
        )}
      </header>

      {/* Main Content Area: Flexbox container starting cleanly below header */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        {children}
      </main>

      {/* Dashboard Footer */}
      <footer className="bg-white border-t border-forest/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-light">
          <p>© {new Date().getFullYear()} Ashish Foundation. Supporter Dashboard.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green" />
            <span>Standard User Account • Verified Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
