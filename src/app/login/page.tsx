"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  X,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // If already authenticated, redirect immediately based on role
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  }, [user, isAdmin, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success && result.user) {
        // Strict role-based redirection
        if (result.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      } else {
        setError(result.error || "Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 350);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest via-forest-dark to-charcoal relative overflow-hidden p-4">
      {/* Decorative background blurs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-green blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-saffron blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-forest/5">
          {/* Back link */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-light hover:text-forest transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Website
            </Link>
          </div>

          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-6 text-center">
            <Link href="/" className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-forest/5 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Ashish Foundation Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span
                className="text-xl font-semibold text-forest tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ashish Foundation
              </span>
            </Link>
            <h1
              className="text-2xl font-bold text-forest"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Account Login
            </h1>
            <p className="text-xs text-charcoal-light mt-1">
              Sign in with your email and password to access your portal
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3.5 mb-5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Common Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/15 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-charcoal uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSent(false);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-saffron hover:text-saffron-dark font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-light/60 hover:text-charcoal transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3.5 bg-forest hover:bg-forest-light text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-forest/25 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-forest/5 text-center text-xs text-charcoal-light">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-forest font-semibold hover:text-green transition-colors inline-block ml-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-charcoal-light/60 hover:text-charcoal hover:bg-forest/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6" />
              </div>

              <h2
                className="text-xl font-bold text-forest text-center mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Password Recovery
              </h2>
              <p className="text-xs text-charcoal-light text-center mb-5">
                Enter your registered email address to receive password reset instructions.
              </p>

              {forgotSent ? (
                <div className="text-center py-3">
                  <div className="w-10 h-10 rounded-full bg-green/10 text-green flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-forest mb-1">
                    Reset Instructions Sent
                  </p>
                  <p className="text-xs text-charcoal-light mb-4">
                    If an account exists for <span className="font-semibold text-charcoal">{forgotEmail}</span>, instructions have been dispatched. For immediate assistance, reach us at <span className="font-semibold text-charcoal">contact@ashishfoundation.org</span>.
                  </p>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-full transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1"
                    >
                      Registered Email
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-1/2 py-2.5 border border-forest/15 text-charcoal text-xs font-semibold rounded-full hover:bg-forest/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 bg-saffron hover:bg-saffron-dark text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
                    >
                      Send Instructions
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
