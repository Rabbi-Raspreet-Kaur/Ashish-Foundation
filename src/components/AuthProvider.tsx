"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type AuthSession,
  getCurrentUser,
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  updateUserProfile,
  seedAdmin,
  ADMIN_CONFIG,
} from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextType {
  user: AuthSession | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string; user?: AuthSession };
  signup: (data: { name: string; email: string; password: string }) => {
    success: boolean;
    error?: string;
    user?: AuthSession;
  };
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string }) => {
    success: boolean;
    error?: string;
    user?: AuthSession;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(() => {
    if (typeof window !== "undefined") {
      seedAdmin();
      return getCurrentUser();
    }
    return null;
  });
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  const resolveRole = useCallback((email: string, appRole?: string): "admin" | "user" => {
    if (appRole === "admin") return "admin";
    if (email.toLowerCase() === ADMIN_CONFIG.email.toLowerCase()) return "admin";
    return "user"; // Safe default: NEVER default to admin
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const email = data.user.email || "";
        const role = resolveRole(email, data.user.app_metadata?.role);
        setUser({
          userId: data.user.id,
          email,
          name: data.user.user_metadata?.name || email || "User",
          role,
        });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sbSession) => {
        if (sbSession?.user) {
          const email = sbSession.user.email || "";
          const role = resolveRole(email, sbSession.user.app_metadata?.role);
          setUser({
            userId: sbSession.user.id,
            email,
            name: sbSession.user.user_metadata?.name || email || "User",
            role,
          });
        } else {
          setUser(getCurrentUser());
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [resolveRole]);

  const login = useCallback((email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }

    if (isSupabaseConfigured()) {
      supabase.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
        if (!error && data.user) {
          const userEmail = data.user.email || email;
          const role = resolveRole(userEmail, data.user.app_metadata?.role);
          setUser({
            userId: data.user.id,
            email: userEmail,
            name: data.user.user_metadata?.name || userEmail,
            role,
          });
        }
      }).catch(() => {});
    }

    return { success: result.success, error: result.error, user: result.user };
  }, [resolveRole]);

  const signup = useCallback(
    (data: { name: string; email: string; password: string }) => {
      const result = authSignup(data);
      if (result.success && result.user) {
        setUser(result.user);
      }

      if (isSupabaseConfigured()) {
        supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { name: data.name },
          },
        }).catch(() => {});
      }

      return { success: result.success, error: result.error, user: result.user };
    },
    []
  );

  const logout = useCallback(() => {
    authLogout();
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: { name?: string; phone?: string }) => {
      if (!user) return { success: false, error: "Not authenticated" };
      const res = updateUserProfile(user.userId, data);
      if (res.success && res.user) {
        setUser(res.user);
      }
      return res;
    },
    [user]
  );

  const isAdmin = user !== null && user.role === "admin";

  return (
    <AuthContext value={{ user, loading, isAdmin, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
