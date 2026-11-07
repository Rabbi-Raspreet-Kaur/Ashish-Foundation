"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signup, user, isAdmin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect safely according to role
  if (user) {
    if (isAdmin) {
      router.push("/admin/dashboard");
    } else {
      router.push("/user/dashboard");
    }
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // signup enforces role: "user" on the backend/auth utility
      const result = signup({ name, email, password });
      if (result.success) {
        // Normal public accounts are redirected to their User Dashboard, NEVER to admin
        router.push("/user/dashboard");
      } else {
        setError(result.error || "Signup failed.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest via-forest-dark to-charcoal relative overflow-hidden p-4">
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-light hover:text-forest transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Public Website
          </Link>

          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-forest/5">
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
              Create Account
            </h1>
            <p className="text-xs text-charcoal-light mt-1">
              Join our community of supporters
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-11 py-3 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-light/60 hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/15 transition-all"
                />
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
                  <UserPlus className="w-4 h-4" />
                  Register
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-charcoal-light">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green font-medium hover:text-forest transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
