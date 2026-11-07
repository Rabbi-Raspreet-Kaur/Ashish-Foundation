"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Heart, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-forest/95 glass shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
        role="banner"
      >
        <nav
          className="container-wide mx-auto flex items-center justify-between px-4 md:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Ashish Foundation — Home"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
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
                className="text-lg md:text-xl font-semibold tracking-tight text-white transition-colors duration-300"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ashish Foundation
              </span>
              <span
                className={`text-[10px] md:text-xs tracking-widest uppercase transition-colors duration-300 ${
                  scrolled ? "text-white/70" : "text-white/60"
                }`}
              >
                Creating Opportunities
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium rounded-lg text-white/85 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}

            {/* Common Login button for visitors */}
            {!loading && !user && (
              <Link
                href="/login"
                className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                title="Sign in to your account"
              >
                <LogIn className="w-3.5 h-3.5 text-saffron" />
                <span>Login</span>
              </Link>
            )}

            {/* User Dashboard link for authenticated normal users */}
            {!loading && user && !isAdmin && (
              <>
                <Link
                  href="/user/dashboard"
                  className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 border border-white/25 text-white hover:bg-white/20 transition-all duration-300 shadow-sm"
                  title="Go to User Dashboard"
                >
                  <UserIcon className="w-3.5 h-3.5 text-saffron" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="ml-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/20 transition-all duration-300"
                  title={`Signed in as ${user.email} - Click to Logout`}
                >
                  <LogOut className="w-3.5 h-3.5 text-saffron" />
                  Logout
                </button>
              </>
            )}

            {/* Logout button for authenticated admins (No Admin Dashboard link on public pages) */}
            {!loading && user && isAdmin && (
              <button
                onClick={() => logout()}
                className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/20 transition-all duration-300"
                title={`Signed in as ${user.email} - Click to Logout`}
              >
                <LogOut className="w-3.5 h-3.5 text-saffron" />
                Logout
              </button>
            )}

            <Link
              href="/#donate"
              className="ml-3 inline-flex items-center gap-2 px-6 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-saffron/30 hover:scale-105"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
          </div>

          {/* Mobile: Donate + Login/Dashboard + Hamburger */}
          <div className="flex lg:hidden items-center gap-2.5">
            {!loading && !user && (
              <Link
                href="/login"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-white/30 text-white text-xs font-medium rounded-full hover:bg-white/10 transition-colors"
                title="Login"
              >
                <LogIn className="w-3 h-3 text-saffron" />
                <span>Login</span>
              </Link>
            )}

            {!loading && user && !isAdmin && (
              <Link
                href="/user/dashboard"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-white/30 text-white text-xs font-medium rounded-full hover:bg-white/10 transition-colors"
                title="My Dashboard"
              >
                <UserIcon className="w-3 h-3 text-saffron" />
                <span>Dashboard</span>
              </Link>
            )}

            <Link
              href="/#donate"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-saffron hover:bg-saffron-dark text-white font-semibold text-xs rounded-full transition-all duration-300"
            >
              <Heart className="w-3.5 h-3.5" />
              Donate
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-forest/98 glass lg:hidden overflow-y-auto"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center min-h-screen py-20 px-6 gap-5"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-xl font-medium text-white/90 hover:text-saffron transition-colors duration-300"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Login option in mobile menu for visitors */}
              {!loading && !user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-white/30 text-white text-base font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-saffron" />
                    Login
                  </Link>
                </motion.div>
              )}

              {/* User Dashboard option for normal users */}
              {!loading && user && !isAdmin && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Link
                      href="/user/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="px-6 py-2.5 rounded-full bg-white/10 border border-white/30 text-white text-base font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-saffron" />
                      My Dashboard
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 }}
                  >
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="px-5 py-2 rounded-full text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4 text-saffron" />
                      Logout ({user.email})
                    </button>
                  </motion.div>
                </>
              )}

              {/* Admin logout option on public pages (No Admin Dashboard link on public pages) */}
              {!loading && user && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-base font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-saffron" />
                    Logout ({user.email})
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2"
              >
                <Link
                  href="/#donate"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-saffron hover:bg-saffron-dark text-white font-semibold text-lg rounded-full transition-all duration-300 shadow-lg shadow-saffron/30"
                >
                  <Heart className="w-5 h-5" />
                  Donate Now
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
