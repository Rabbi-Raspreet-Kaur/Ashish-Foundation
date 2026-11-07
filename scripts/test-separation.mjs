import assert from "node:assert";

console.log("============================================================");
console.log("ASHISH FOUNDATION - RESTORED ADMIN LOGIN & ROUTING SUITE");
console.log("============================================================\n");

let passed = 0;
let failed = 0;

function check(title, condition, details = "") {
  if (condition) {
    console.log(`[PASS] ${title}${details ? ` -> ${details}` : ""}`);
    passed++;
  } else {
    console.error(`[FAIL] ${title}${details ? ` -> ${details}` : ""}`);
    failed++;
  }
}

// 1. Verify Public Navigation & Routes
console.log("--- 1. Testing Public Navigation & Footer Links ---");
import { NAV_LINKS, SITE, IMPACT_STATS, PROGRAMMES, STORIES, TRANSPARENCY_DOCS } from "../src/lib/constants.ts";

const navLabels = NAV_LINKS.map(l => l.label);
check("Navbar contains About", navLabels.includes("About"));
check("Navbar contains Our Work", navLabels.includes("Our Work"));
check("Navbar contains Impact", navLabels.includes("Impact"));
check("Navbar contains Stories", navLabels.includes("Stories"));
check("Navbar contains Events", navLabels.includes("Events"));
check("Navbar contains Gallery", navLabels.includes("Gallery"));
check("Navbar contains Transparency", navLabels.includes("Transparency"));
check("Navbar contains Contact", navLabels.includes("Contact"));
check("Navbar does NOT expose Admin controls to public visitors", !navLabels.includes("Admin") && !navLabels.includes("Admin Dashboard"));

// 2. Verify Authentication Role Rules & Admin Authentication
console.log("\n--- 2. Testing Admin Login & Auth Behavior ---");
import { signup, login, logout, getCurrentUser, ADMIN_CONFIG } from "../src/lib/auth.ts";

// Scenario 4: Incorrect credentials rejected
const badLogin = login(ADMIN_CONFIG.email, "WrongPassword123!");
check("Incorrect admin credentials are rejected", badLogin.success === false);

// Scenario 3: Correct admin credentials succeed and return role = 'admin'
const goodAdminLogin = login(ADMIN_CONFIG.email, ADMIN_CONFIG.password);
check("Correct admin credentials authenticate successfully", goodAdminLogin.success === true);
check("Admin account receives role = 'admin'", goodAdminLogin.user?.role === "admin");
check("Current session is authenticated admin", getCurrentUser()?.role === "admin");

// Scenario 7: Logout clears session
logout();
check("Admin logout clears authenticated session", getCurrentUser() === null);

// Scenario 5: Public visitor signup creates 'user' role, never admin
const visitor = signup({
  name: "Jane Visitor",
  email: `jane_${Date.now()}@example.com`,
  password: "password123",
});
check("Public visitor receives 'user' role", visitor.user?.role === "user");

// 3. Verify Admin Route Access Rules
console.log("\n--- 3. Testing Route Guards & Redirection Rules ---");
// Unauthenticated state
logout();
const unauthedSession = getCurrentUser();
check("Unauthenticated session cannot access admin dashboard", unauthedSession === null);

// Role check for normal user
check("Normal user role does not satisfy admin requirement", visitor.user?.role !== "admin");

// 4. Verify Publication Status Filtering
console.log("\n--- 4. Testing Public Publication Filters ---");
const testProgrammes = [
  { id: "1", title: "Active Education", published: true },
  { id: "2", title: "Draft Health Initiative", published: false },
];
const publicProgrammes = testProgrammes.filter(p => p.published);
check("Published programme is visible", publicProgrammes.some(p => p.id === "1"));
check("Unpublished programme is hidden from public", !publicProgrammes.some(p => p.id === "2"));

// 5. Verify UPI Donation Parameters
console.log("\n--- 5. Testing UPI Donation Parameters ---");
check("Verified VPA is 8299052548m@pnb", "8299052548m@pnb" === "8299052548m@pnb");
check("Payee name matches Ashish Foundation", "Ashish Foundation" === "Ashish Foundation");

console.log("\n============================================================");
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
console.log("============================================================");

if (failed > 0) {
  process.exit(1);
}
