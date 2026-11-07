"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Calendar,
  Users,
  ImageIcon,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  Sparkles,
  BarChart3,
  FileText,
  Settings,
  ShieldAlert,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Donations", href: "/admin/donations", icon: Heart },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Programmes", href: "/admin/programmes", icon: BookOpen },
  { label: "Stories", href: "/admin/stories", icon: Sparkles },
  { label: "Impact Stats", href: "/admin/impact", icon: BarChart3 },
  { label: "Transparency", href: "/admin/transparency", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Protect all admin routes
    if (!loading && !isLoginPage) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        // Automatically redirect normal user to their user dashboard
        const timer = setTimeout(() => {
          router.push("/user/dashboard");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user, loading, router, isLoginPage, isAdmin]);

  // If on /admin/login, render without the admin sidebar or shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-forest/20 border-t-forest rounded-full animate-spin" />
          <span className="text-xs text-charcoal-light font-medium tracking-wide">
            Verifying administrator access...
          </span>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirecting to /admin/login
  if (!user) {
    return null;
  }

  // Logged in as standard visitor (not admin) -> Strict Access Denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-forest/5">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1
            className="text-2xl font-bold text-forest mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Administrator Privileges Required
          </h1>
          <p className="text-sm text-charcoal-light mb-6">
            You are signed in as <span className="font-semibold text-charcoal">{user.email}</span> with standard user access. This administrative portal is restricted to authorized Ashish Foundation personnel. Redirecting to your dashboard...
          </p>
          <div className="space-y-3">
            <Link
              href="/user/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest hover:bg-forest-light text-white font-medium rounded-full transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to User Dashboard
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-forest/20 text-charcoal hover:bg-forest/5 font-medium rounded-full transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-forest fixed top-0 left-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Ashish Foundation"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span
                className="text-white font-semibold text-sm block"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ashish Foundation
              </span>
              <span className="text-saffron text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <link.icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-saffron" : "text-white/60 group-hover:text-white"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">
                {user.name || "Administrator"}
              </p>
              <p className="text-[10px] text-white/50 truncate">{user.email}</p>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-saffron text-forest">
              Admin
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="View Public Site"
            >
              <Home className="w-3.5 h-3.5" />
              Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 text-white/80 hover:text-red-300 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-forest text-white px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
            <Image
              src="/images/logo.png"
              alt="Ashish Foundation"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <span className="font-semibold text-sm">Ashish Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside
            className="w-64 bg-forest h-full flex flex-col pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-white bg-white/10 rounded-lg"
              >
                <Home className="w-3.5 h-3.5" />
                Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-white bg-white/10 hover:bg-red-500/20 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <div className="p-4 md:p-8 pt-20 lg:pt-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
