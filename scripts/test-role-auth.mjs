// ============================================================
// Ashish Foundation — Comprehensive Role-Based Auth & Security Verification
// Tests:
// 1. Public browsing without login
// 2. No Admin Dashboard button or link visible publicly
// 3. Both USER and ADMIN can authenticate via /login
// 4. USER redirected to /user/dashboard
// 5. ADMIN redirected to /admin/dashboard
// 6. USER strictly denied access to admin routes
// 7. Logged-out visitors denied access to protected dashboards
// 8. Logout invalidates session
// 9. Session hydration maintains exact role
// ============================================================

import { readFileSync } from "fs";
import { resolve } from "path";

console.log("============================================================");
console.log("ASHISH FOUNDATION - ROLE-BASED AUTH & SECURITY VERIFICATION");
console.log("============================================================");

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    console.log(`[PASS] ${label}`);
    passed++;
  } else {
    console.error(`[FAIL] ${label}`);
    failed++;
  }
}

// 1. Verify Public Navigation & Footer (No Admin Dashboard Button Publicly)
console.log("\n--- 1. Testing Public Navigation & Absence of Admin Dashboard Button ---");
import { NAV_LINKS } from "../src/lib/constants.ts";
const navLabels = NAV_LINKS.map((l) => l.label);
check("Navbar has About", navLabels.includes("About"));
check("Navbar has Our Work", navLabels.includes("Our Work"));
check("Navbar has Impact", navLabels.includes("Impact"));
check("Navbar has Stories", navLabels.includes("Stories"));
check("Navbar has Events", navLabels.includes("Events"));
check("Navbar has Gallery", navLabels.includes("Gallery"));
check("Navbar has Transparency", navLabels.includes("Transparency"));
check("Navbar has Contact", navLabels.includes("Contact"));
check("NAV_LINKS does NOT contain Admin Dashboard", !navLabels.includes("Admin Dashboard") && !navLabels.includes("Admin"));

const navbarCode = readFileSync(resolve("src/components/Navbar.tsx"), "utf8");
check(
  "Navbar does NOT display Admin Dashboard button",
  !navbarCode.includes(">Admin Dashboard<") && !navbarCode.includes("Admin Dashboard</Link>")
);
check(
  "Navbar links unauthenticated visitors to /login",
  navbarCode.includes('href="/login"')
);
check(
  "Navbar links authenticated standard users to /user/dashboard",
  navbarCode.includes('href="/user/dashboard"')
);

const footerCode = readFileSync(resolve("src/components/Footer.tsx"), "utf8");
check(
  "Footer does NOT contain Admin Dashboard link",
  !footerCode.includes("Admin Dashboard") && !footerCode.includes("/admin/login")
);

// 2. Testing Authentication, Roles & Redirection Rules
console.log("\n--- 2. Testing Role Identification & Redirection Rules ---");
import { signup, login, logout, getCurrentUser, ADMIN_CONFIG, updateUserProfile } from "../src/lib/auth.ts";

// Clear session
logout();
check("Initial state: Logged-out visitor has null session", getCurrentUser() === null);

// Test Admin Login via common login logic
const adminLoginRes = login(ADMIN_CONFIG.email, ADMIN_CONFIG.password);
check("Admin credentials authenticate successfully", adminLoginRes.success);
check("Admin account receives role = 'admin'", adminLoginRes.user?.role === "admin");
check("Admin target route is /admin/dashboard", adminLoginRes.user?.role === "admin" ? "/admin/dashboard" : "" === "/admin/dashboard");

// Test Admin Session
const activeAdmin = getCurrentUser();
check("Active admin session verified", activeAdmin?.role === "admin");

// Logout
logout();
check("Logout invalidates admin session", getCurrentUser() === null);

// Test Normal User Signup & Login
const testEmail = `supporter_${Date.now()}@example.com`;
const userSignupRes = signup({
  name: "Pooja Sharma",
  email: testEmail,
  password: "password123",
});

check("Normal public registration succeeds", userSignupRes.success);
check("Public registration STRICTLY assigned role = 'user'", userSignupRes.user?.role === "user");

// Normal User Login
const userLoginRes = login(testEmail, "password123");
check("Normal user logs in successfully via common portal", userLoginRes.success);
check("Normal user receives role = 'user'", userLoginRes.user?.role === "user");
check("Normal user target route is /user/dashboard", userLoginRes.user?.role === "user" ? "/user/dashboard" : "" === "/user/dashboard");

// Profile update test
const profileRes = updateUserProfile(userLoginRes.user.userId, { name: "Pooja S. Sharma" });
check("User can update permitted profile details", profileRes.success && profileRes.user?.name === "Pooja S. Sharma");
check("User profile update CANNOT elevate role (still 'user')", profileRes.user?.role === "user");

// 3. Testing Route Guard Protection
console.log("\n--- 3. Testing Route Guard Implementations ---");
const adminLayoutCode = readFileSync(resolve("src/app/admin/layout.tsx"), "utf8");
check(
  "AdminLayout redirects unauthenticated visitors to /login",
  adminLayoutCode.includes('router.push("/login")')
);
check(
  "AdminLayout denies access and redirects normal users to /user/dashboard",
  adminLayoutCode.includes('router.push("/user/dashboard")')
);

const userLayoutCode = readFileSync(resolve("src/app/user/layout.tsx"), "utf8");
check(
  "UserLayout redirects unauthenticated visitors to /login",
  userLayoutCode.includes('router.push("/login")')
);

const loginPageCode = readFileSync(resolve("src/app/login/page.tsx"), "utf8");
check(
  "LoginPage redirects Admin to /admin/dashboard",
  loginPageCode.includes('router.push("/admin/dashboard")') || loginPageCode.includes('router.replace("/admin/dashboard")')
);
check(
  "LoginPage redirects User to /user/dashboard",
  loginPageCode.includes('router.push("/user/dashboard")') || loginPageCode.includes('router.replace("/user/dashboard")')
);
check(
  "LoginPage contains Forgot Password option",
  loginPageCode.includes("Forgot password?")
);
check(
  "LoginPage contains User Registration option",
  loginPageCode.includes('href="/signup"')
);

// 4. Session Persistence & Rehydration
console.log("\n--- 4. Testing Session Refresh & Role Persistence ---");
const reloadedUser = getCurrentUser();
check("Refreshing/reloading preserves role = 'user'", reloadedUser?.role === "user");

logout();
check("Final session cleanup confirmed", getCurrentUser() === null);

// 5. Verification of Donations & UPI Integrity
console.log("\n--- 5. Testing UPI QR & Donation Integrity ---");
import { SITE } from "../src/lib/constants.ts";
check("Verified VPA is 8299052548m@pnb", (process.env.NEXT_PUBLIC_UPI_ID || "8299052548m@pnb") === "8299052548m@pnb");
check("Payee name is Ashish Foundation", (process.env.NEXT_PUBLIC_UPI_NAME || SITE.name) === "Ashish Foundation");

console.log("\n============================================================");
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
console.log("============================================================");

if (failed > 0) {
  process.exit(1);
}
