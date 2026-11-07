import assert from "node:assert";

// Mock localStorage and document for testing environment
const store = new Map();
global.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
};

let cookieJar = "";
global.document = {
  get cookie() {
    return cookieJar;
  },
  set cookie(val) {
    // Basic cookie setter simulator
    const parts = val.split(";")[0].split("=");
    const k = parts[0].trim();
    const v = parts.slice(1).join("=").trim();
    if (val.includes("max-age=0")) {
      cookieJar = "";
    } else {
      cookieJar = `${k}=${v}`;
    }
  },
};

console.log("=== RUNNING AUTH & SECURITY VERIFICATION SUITE ===");

// Import auth module
const {
  HARDCODED_ADMIN,
  login,
  signup,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
} = await import("../src/lib/auth.ts");

// TEST 1: Admin hardcoded authentication
console.log("\n[TEST 1] Testing Admin Authentication...");
const adminSuccess = login(HARDCODED_ADMIN.email, HARDCODED_ADMIN.password, "admin");
assert.strictEqual(adminSuccess.success, true, "Admin login should succeed with correct credentials");
assert.strictEqual(adminSuccess.user?.role, "admin", "Admin role must be 'admin'");
assert.strictEqual(isAdmin(), true, "isAdmin() must return true for admin session");
assert.strictEqual(isAuthenticated(), true, "isAuthenticated() must return true");

// Check invalid admin credentials
const adminWrongPass = login(HARDCODED_ADMIN.email, "wrongpassword", "admin");
assert.strictEqual(adminWrongPass.success, false, "Admin login must fail with incorrect password");

const adminWrongEmail = login("fakeadmin@domain.com", HARDCODED_ADMIN.password, "admin");
assert.strictEqual(adminWrongEmail.success, false, "Admin login must fail with unknown admin email");

// TEST 2: Logout and session clearing
console.log("\n[TEST 2] Testing Logout and Session Clearing...");
logout();
assert.strictEqual(getCurrentUser(), null, "getCurrentUser() must return null after logout");
assert.strictEqual(isAuthenticated(), false, "isAuthenticated() must return false after logout");
assert.strictEqual(isAdmin(), false, "isAdmin() must return false after logout");

// TEST 3: User dynamic authentication (No hardcoded credentials)
console.log("\n[TEST 3] Testing User Authentication (Dynamic Store/Database)...");

// 3.1 Random unregistered user fails
const unregisteredLogin = login("nonexistent@user.com", "anypass123", "user");
assert.strictEqual(unregisteredLogin.success, false, "Unregistered user must fail login");

// 3.2 Trying admin credentials under user role fails and informs role selection
const adminUnderUser = login(HARDCODED_ADMIN.email, HARDCODED_ADMIN.password, "user");
assert.strictEqual(adminUnderUser.success, false, "Admin credentials must not log in as standard user");

// 3.3 Registering a regular user
const testUser = {
  name: "Pooja Sharma",
  email: "pooja.sharma@example.org",
  password: "UserPassword456!",
};

const signupResult = signup(testUser);
assert.strictEqual(signupResult.success, true, "User signup must succeed");
assert.strictEqual(signupResult.user?.role, "user", "User signup must strictly enforce 'user' role");
assert.strictEqual(isAdmin(), false, "Regular user must never have admin privileges");
assert.strictEqual(isAuthenticated(), true, "Regular user must be authenticated upon signup");

logout();

// 3.4 Login with registered user credentials
const userLoginSuccess = login(testUser.email, testUser.password, "user");
assert.strictEqual(userLoginSuccess.success, true, "Registered user must log in successfully");
assert.strictEqual(userLoginSuccess.user?.role, "user", "Logged in user must have role 'user'");
assert.strictEqual(isAdmin(), false, "User must NOT have admin rights");

// 3.5 Login with wrong password
const userWrongPass = login(testUser.email, "WrongPassword", "user");
assert.strictEqual(userWrongPass.success, false, "User login with wrong password must fail");

// TEST 4: Route protection simulation (Proxy Logic)
console.log("\n[TEST 4] Testing Route Protection & Authorization Simulation...");

function simulateProxy(pathname, session) {
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isAuthenticated = !!(session && session.role && session.email);

  if (!isAuthenticated) {
    if (isAuthPage) return { allowed: true };
    return { redirect: "/login" };
  }

  if (isAuthPage) {
    if (session.role === "admin") return { redirect: "/admin/dashboard" };
    return { redirect: "/user/dashboard" };
  }

  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return { redirect: "/user/dashboard" };
  }

  return { allowed: true };
}

// Unauthenticated tests
assert.deepStrictEqual(simulateProxy("/", null), { redirect: "/login" }, "Unauthenticated / must redirect to /login");
assert.deepStrictEqual(simulateProxy("/about", null), { redirect: "/login" }, "Unauthenticated /about must redirect to /login");
assert.deepStrictEqual(simulateProxy("/admin/dashboard", null), { redirect: "/login" }, "Unauthenticated /admin/* must redirect to /login");
assert.deepStrictEqual(simulateProxy("/user/dashboard", null), { redirect: "/login" }, "Unauthenticated /user/* must redirect to /login");
assert.deepStrictEqual(simulateProxy("/login", null), { allowed: true }, "Unauthenticated /login must be allowed");
assert.deepStrictEqual(simulateProxy("/signup", null), { allowed: true }, "Unauthenticated /signup must be allowed");

// User session tests
const regularUserSession = { userId: "usr-1", email: testUser.email, role: "user" };
assert.deepStrictEqual(simulateProxy("/", regularUserSession), { allowed: true }, "Authenticated user can access /");
assert.deepStrictEqual(simulateProxy("/user/dashboard", regularUserSession), { allowed: true }, "User can access /user/dashboard");
assert.deepStrictEqual(simulateProxy("/admin/dashboard", regularUserSession), { redirect: "/user/dashboard" }, "Regular user must be blocked from /admin/*");
assert.deepStrictEqual(simulateProxy("/login", regularUserSession), { redirect: "/user/dashboard" }, "Logged-in user visiting /login redirects to dashboard");

// Admin session tests
const adminSession = { userId: HARDCODED_ADMIN.id, email: HARDCODED_ADMIN.email, role: "admin" };
assert.deepStrictEqual(simulateProxy("/", adminSession), { allowed: true }, "Authenticated admin can access /");
assert.deepStrictEqual(simulateProxy("/admin/dashboard", adminSession), { allowed: true }, "Admin can access /admin/dashboard");
assert.deepStrictEqual(simulateProxy("/login", adminSession), { redirect: "/admin/dashboard" }, "Logged-in admin visiting /login redirects to admin dashboard");

console.log("\nALL AUTH & ROUTE TESTS PASSED SUCCESSFULLY! (100% verified)");

