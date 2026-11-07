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
const SESSION_KEY = "af_session";

// In-memory fallback for SSR and test environments
let memoryUsers: User[] = [];
let memorySession: AuthSession | null = null;

// Admin configuration: Server/Env or default verified admin
export const ADMIN_CONFIG = {
  id: "admin-001",
  name: "Ashish Foundation Admin",
  email: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_EMAIL) || "admin@ashishfoundation.org",
  // Default fallback password for local demo/development
  password: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_PASSWORD) || "admin123",
  role: "admin" as const,
};

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
 * Seed default admin account if not already present.
 * Ensures the admin role is explicitly assigned and existing user accounts retain 'user' role.
 */
export function seedAdmin(): void {
  const users = getUsers();
  const existingAdminIdx = users.findIndex(
    (u) => u.email.toLowerCase() === ADMIN_CONFIG.email.toLowerCase()
  );

  if (existingAdminIdx === -1) {
    users.push({
      id: ADMIN_CONFIG.id,
      name: ADMIN_CONFIG.name,
      email: ADMIN_CONFIG.email.toLowerCase(),
      password: ADMIN_CONFIG.password,
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    setUsers(users);
  } else {
    // Ensure the designated admin email always has the admin role
    if (users[existingAdminIdx].role !== "admin") {
      users[existingAdminIdx].role = "admin";
      setUsers(users);
    }
  }
}

/**
 * Public registration: ALWAYS assigns role = 'user'.
 * Prevents privilege escalation and payload tampering.
 */
export function signup(data: {
  name: string;
  email: string;
  password: string;
}): { success: boolean; error?: string; user?: AuthSession } {
  seedAdmin();
  const users = getUsers();
  const emailNorm = data.email.trim().toLowerCase();

  if (users.find((u) => u.email.toLowerCase() === emailNorm)) {
    return { success: false, error: "An account with this email already exists." };
  }

  if (emailNorm === ADMIN_CONFIG.email.toLowerCase()) {
    return { success: false, error: "This email address is reserved." };
  }

  if (data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const newUser: User = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: data.name.trim(),
    email: emailNorm,
    password: data.password,
    role: "user", // strictly enforce 'user' role for all public signups
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
  }

  return { success: true, user: session };
}

/**
 * Log in an existing user or admin
 */
export function login(
  email: string,
  password: string
): {
  success: boolean;
  error?: string;
  user?: AuthSession;
} {
  seedAdmin();
  const users = getUsers();
  const emailNorm = email.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === emailNorm && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  // Double check admin role enforcement: only verified admin email gets admin
  const resolvedRole: UserRole =
    user.email.toLowerCase() === ADMIN_CONFIG.email.toLowerCase() ? "admin" : (user.role || "user");

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: resolvedRole,
  };

  memorySession = session;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {}
  }

  return { success: true, user: session };
}

/** Log out and clear session */
export function logout(): void {
  memorySession = null;
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

/** Get current authenticated session */
export function getCurrentUser(): AuthSession | null {
  if (typeof window === "undefined") return memorySession;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return memorySession;
    const session: AuthSession = JSON.parse(raw);
    if (session.role !== "admin" && session.role !== "user") {
      session.role = "user";
    }
    return session;
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

  let updatedName = data.name?.trim();

  if (idx !== -1) {
    if (updatedName) {
      users[idx].name = updatedName;
    }
    setUsers(users);
  }

  const current = getCurrentUser();
  if (current && (current.userId === userId || !idx)) {
    if (updatedName) {
      current.name = updatedName;
    }
    memorySession = current;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(current));
      } catch {}
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
    }
    return { success: true, user: session };
  }

  return { success: false, error: "User session not found." };
}
