// ============================================================
// Auth Utilities — Role-based Authentication System
// Ashish Foundation: Separate Public Visitors & Private Admin
// ============================================================

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

const USERS_KEY = "af_users";
export const SESSION_KEY = "af_session";

// In-memory fallback for SSR and test environments
let memoryUsers: User[] = [];
let memorySession: AuthSession | null = null;

/**
 * Hardcoded Admin Credentials
 * Specifically hardcoded in the authentication logic for admin access testing.
 */
export const HARDCODED_ADMIN = {
  id: "admin-master-001",
  name: "Ashish Foundation Admin",
  email: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_EMAIL) || "admin@ashishfoundation.org",
  // Fallback default password for verified admin testing
  password: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_PASSWORD) || "admin123",
  role: "admin" as const,
};

// Backwards-compatible export
export const ADMIN_CONFIG = HARDCODED_ADMIN;

/** Helper to set session cookie on browser */
export function setSessionCookie(session: AuthSession): void {
  if (typeof document === "undefined") return;
  try {
    const encoded = encodeURIComponent(JSON.stringify(session));
    // 7 days expiration
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `${SESSION_KEY}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.warn("Failed to set session cookie:", err);
  }
}

/** Helper to clear session cookie */
export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${SESSION_KEY}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch (err) {
    console.warn("Failed to clear session cookie:", err);
  }
}

/** Helper to read session cookie from document.cookie */
export function getSessionCookie(): AuthSession | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp("(^|;\\s*)" + SESSION_KEY + "=([^;]*)"));
    if (!match || !match[2]) return null;
    const decoded = decodeURIComponent(match[2]);
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === "object" && parsed.role && parsed.email) {
      if (parsed.role !== "admin" && parsed.role !== "user") {
        parsed.role = "user";
      }
      return parsed as AuthSession;
    }
  } catch {}
  return null;
}

function getUsers(): User[] {
  if (typeof window === "undefined") return memoryUsers;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : memoryUsers;
  } catch {
    return memoryUsers;
  }
}

function setUsers(users: User[]): void {
  memoryUsers = users;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

/**
 * Public registration: ALWAYS assigns role = 'user'.
 * Prevents privilege escalation and registers standard users in the database / local store.
 * Regular user credentials are NOT hardcoded.
 */
export function signup(data: {
  name: string;
  email: string;
  password: string;
}): { success: boolean; error?: string; user?: AuthSession } {
  const users = getUsers();
  const emailNorm = data.email.trim().toLowerCase();

  if (users.find((u) => u.email.toLowerCase() === emailNorm)) {
    return { success: false, error: "An account with this email already exists. Please sign in." };
  }

  if (emailNorm === HARDCODED_ADMIN.email.toLowerCase()) {
    return { success: false, error: "This email address is reserved for system administration." };
  }

  if (data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const newUser: User = {
    id: "usr-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: data.name.trim(),
    email: emailNorm,
    password: data.password,
    role: "user", // strictly enforce 'user' role for all public user signups
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setUsers(users);

  const session: AuthSession = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: "user",
  };

  memorySession = session;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {}
    setSessionCookie(session);
  }

  return { success: true, user: session };
}

/**
 * Log in an existing user or admin based on selected role
 * 
 * - If selectedRole is "admin":
 *   Authenticates directly against HARDCODED_ADMIN credentials for admin access testing.
 * 
 * - If selectedRole is "user":
 *   User credentials are NOT hardcoded. Regular users are authenticated against the registered user
 *   database / backend store.
 */
export function login(
  email: string,
  password: string,
  selectedRole: UserRole = "user"
): {
  success: boolean;
  error?: string;
  user?: AuthSession;
} {
  const emailNorm = email.trim().toLowerCase();
  const passNorm = password;

  // 1. Role = ADMIN: Check directly against hardcoded Admin credentials
  if (selectedRole === "admin") {
    const isEmailValid = emailNorm === HARDCODED_ADMIN.email.toLowerCase();
    const isPasswordValid = passNorm === HARDCODED_ADMIN.password;

    if (!isEmailValid || !isPasswordValid) {
      return {
        success: false,
        error: "Invalid Admin credentials. Please check your admin email and password.",
      };
    }

    const session: AuthSession = {
      userId: HARDCODED_ADMIN.id,
      email: HARDCODED_ADMIN.email,
      name: HARDCODED_ADMIN.name,
      role: "admin",
    };

    memorySession = session;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch {}
      setSessionCookie(session);
    }

    return { success: true, user: session };
  }

  // 2. Role = USER: Check dynamically against registered users in database / store (NOT hardcoded)
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === emailNorm && u.password === passNorm
  );

  if (!user) {
    // Check if user entered admin email with user role selected
    if (emailNorm === HARDCODED_ADMIN.email.toLowerCase()) {
      return {
        success: false,
        error: "This is an administrator account. Please select the 'Admin' role option to log in.",
      };
    }

    return {
      success: false,
      error: "Invalid User credentials. If you do not have an account, please create one.",
    };
  }

  // Double check admin role enforcement: regular user login cannot grant admin role
  if (user.role === "admin" || emailNorm === HARDCODED_ADMIN.email.toLowerCase()) {
    return {
      success: false,
      error: "This is an administrator account. Please select the 'Admin' role option to log in.",
    };
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: "user",
  };

  memorySession = session;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {}
    setSessionCookie(session);
  }

  return { success: true, user: session };
}

/** Log out and clear all sessions and cookies */
export function logout(): void {
  memorySession = null;
  clearSessionCookie();
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

/** Get current authenticated session from localStorage or session cookie */
export function getCurrentUser(): AuthSession | null {
  if (typeof window === "undefined") return memorySession;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const session: AuthSession = JSON.parse(raw);
      if (session.role !== "admin" && session.role !== "user") {
        session.role = "user";
      }
      // Ensure session cookie is in sync
      setSessionCookie(session);
      return session;
    }

    // Fallback: check session cookie
    const cookieSession = getSessionCookie();
    if (cookieSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(cookieSession));
      return cookieSession;
    }

    return memorySession;
  } catch {
    return memorySession;
  }
}

/** Check if visitor is authenticated */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/** Check if current user is an authenticated admin */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user !== null && user.role === "admin";
}

/**
 * Update permitted profile details for standard users and administrators.
 * Security: NEVER permits altering the 'role' field via profile updates.
 */
export function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string }
): { success: boolean; user?: AuthSession; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);

  const updatedName = data.name?.trim();

  if (idx !== -1) {
    if (updatedName) {
      users[idx].name = updatedName;
    }
    setUsers(users);
  }

  const current = getCurrentUser();
  if (current && (current.userId === userId || idx === -1)) {
    if (updatedName) {
      current.name = updatedName;
    }
    memorySession = current;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(current));
      } catch {}
      setSessionCookie(current);
    }
    return { success: true, user: current };
  }

  if (idx !== -1) {
    const session: AuthSession = {
      userId: users[idx].id,
      email: users[idx].email,
      name: users[idx].name,
      role: users[idx].role,
    };
    memorySession = session;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch {}
      setSessionCookie(session);
    }
    return { success: true, user: session };
  }

  return { success: false, error: "User session not found." };
}
