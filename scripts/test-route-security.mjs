#!/usr/bin/env node
/**
 * Ashish Foundation — Route Security Verification Test Suite
 *
 * Runs unauthenticated and authenticated route checks against http://localhost:3000
 *
 * Usage:
 *   node scripts/test-route-security.mjs
 *   TARGET_URL=http://localhost:3001 node scripts/test-route-security.mjs
 */

const TARGET_URL = (process.env.TARGET_URL || process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

// Mock Session Cookies matching af_session JSON structure
const USER_COOKIE = `af_session=${encodeURIComponent(
  JSON.stringify({
    userId: "usr-test-001",
    email: "supporter@ashishfoundation.org",
    name: "Standard Supporter",
    role: "user",
  })
)}`;

const ADMIN_COOKIE = `af_session=${encodeURIComponent(
  JSON.stringify({
    userId: "adm-test-001",
    email: "admin@ashishfoundation.org",
    name: "Platform Administrator",
    role: "admin",
  })
)}`;

async function testEndpoint(path, cookie = null) {
  const headers = {};
  if (cookie) {
    headers["Cookie"] = cookie;
  }

  const res = await fetch(`${TARGET_URL}${path}`, {
    method: "GET",
    headers,
    redirect: "manual", // Prevent following redirects so we can inspect status codes (307/308)
  });

  return {
    status: res.status,
    location: res.headers.get("location") || "",
  };
}

async function verifyServerAvailable() {
  try {
    const res = await fetch(TARGET_URL, { redirect: "manual" });
    return res.status > 0;
  } catch (err) {
    return false;
  }
}

async function runSecuritySuite() {
  console.log("=".repeat(88));
  console.log("                   ASHISH FOUNDATION - ROUTE SECURITY TEST SUITE");
  console.log("=".repeat(88));
  console.log(`Target Base URL: ${TARGET_URL}`);
  console.log(`Executed At:     ${new Date().toISOString()}`);
  console.log("-".repeat(88));

  const isUp = await verifyServerAvailable();
  if (!isUp) {
    console.error(`\n❌ Could not connect to server at ${TARGET_URL}.`);
    console.error("   Please start your Next.js server first using:");
    console.error("     npm run dev   (or 'npm run start' for production build)\n");
    process.exit(1);
  }

  const results = [];

  // Helper to record test results
  function recordResult({ category, route, expected, actual, passed, details = "" }) {
    results.push({
      category,
      route,
      expected,
      actual: details ? `${actual} (${details})` : String(actual),
      passed,
    });
  }

  // =========================================================================
  // 1. UNAUTHENTICATED CHECKS
  // =========================================================================

  // 1.1 GET / -> 200 OK
  try {
    const res = await testEndpoint("/");
    recordResult({
      category: "Unauthenticated",
      route: "GET /",
      expected: "200 OK",
      actual: `${res.status}`,
      passed: res.status === 200,
    });
  } catch (err) {
    recordResult({ category: "Unauthenticated", route: "GET /", expected: "200 OK", actual: err.message, passed: false });
  }

  // 1.2 GET /about -> 200 OK
  try {
    const res = await testEndpoint("/about");
    recordResult({
      category: "Unauthenticated",
      route: "GET /about",
      expected: "200 OK",
      actual: `${res.status}`,
      passed: res.status === 200,
    });
  } catch (err) {
    recordResult({ category: "Unauthenticated", route: "GET /about", expected: "200 OK", actual: err.message, passed: false });
  }

  // 1.3 GET /login -> 200 OK
  try {
    const res = await testEndpoint("/login");
    recordResult({
      category: "Unauthenticated",
      route: "GET /login",
      expected: "200 OK",
      actual: `${res.status}`,
      passed: res.status === 200,
    });
  } catch (err) {
    recordResult({ category: "Unauthenticated", route: "GET /login", expected: "200 OK", actual: err.message, passed: false });
  }

  // 1.4 GET /user/dashboard -> 307/308 redirect or blocked (redirect to /login)
  try {
    const res = await testEndpoint("/user/dashboard");
    const isRedirect = (res.status === 307 || res.status === 308) && res.location.includes("/login");
    const isBlocked = res.status === 401 || res.status === 403;
    const passed = isRedirect || isBlocked;
    recordResult({
      category: "Unauthenticated",
      route: "GET /user/dashboard",
      expected: "307/308 -> /login",
      actual: `${res.status}`,
      passed,
      details: res.location ? `-> ${res.location}` : "Blocked",
    });
  } catch (err) {
    recordResult({ category: "Unauthenticated", route: "GET /user/dashboard", expected: "307/308 -> /login", actual: err.message, passed: false });
  }

  // 1.5 GET /admin/dashboard -> 307/308 redirect or blocked (redirect to /login)
  try {
    const res = await testEndpoint("/admin/dashboard");
    const isRedirect = (res.status === 307 || res.status === 308) && res.location.includes("/login");
    const isBlocked = res.status === 401 || res.status === 403;
    const passed = isRedirect || isBlocked;
    recordResult({
      category: "Unauthenticated",
      route: "GET /admin/dashboard",
      expected: "307/308 -> /login",
      actual: `${res.status}`,
      passed,
      details: res.location ? `-> ${res.location}` : "Blocked",
    });
  } catch (err) {
    recordResult({ category: "Unauthenticated", route: "GET /admin/dashboard", expected: "307/308 -> /login", actual: err.message, passed: false });
  }

  // 1.6 Protected API routes -> 401/403 or redirect
  try {
    const res = await testEndpoint("/api/admin");
    const passed = res.status === 401 || res.status === 403 || res.status === 307 || res.status === 308 || res.status === 404;
    recordResult({
      category: "Unauthenticated",
      route: "GET /api/admin",
      expected: "401/403/Redir/404",
      actual: `${res.status}`,
      passed,
      details: res.location ? `-> ${res.location}` : "Restricted",
    });
  } catch (err) {
    recordResult({ category: "Unauthenticated", route: "GET /api/admin", expected: "401/403 or Redir", actual: err.message, passed: false });
  }

  // =========================================================================
  // 2. AUTHENTICATED STANDARD USER CHECKS (Mock user session)
  // =========================================================================

  // 2.1 Authenticated standard user -> /user/dashboard -> 200 OK
  try {
    const res = await testEndpoint("/user/dashboard", USER_COOKIE);
    recordResult({
      category: "User Authenticated",
      route: "GET /user/dashboard",
      expected: "200 OK",
      actual: `${res.status}`,
      passed: res.status === 200,
      details: "Authorized",
    });
  } catch (err) {
    recordResult({ category: "User Authenticated", route: "GET /user/dashboard", expected: "200 OK", actual: err.message, passed: false });
  }

  // 2.2 Authenticated standard user -> /admin/dashboard -> 401/403 or redirect away from admin
  try {
    const res = await testEndpoint("/admin/dashboard", USER_COOKIE);
    const isRedirectAway = (res.status === 307 || res.status === 308) && !res.location.includes("/admin");
    const isForbidden = res.status === 401 || res.status === 403;
    const passed = isRedirectAway || isForbidden;
    recordResult({
      category: "User Authenticated",
      route: "GET /admin/dashboard",
      expected: "307/308 away or 403",
      actual: `${res.status}`,
      passed,
      details: res.location ? `-> ${res.location}` : "Access Denied",
    });
  } catch (err) {
    recordResult({ category: "User Authenticated", route: "GET /admin/dashboard", expected: "Redirect away / 403", actual: err.message, passed: false });
  }

  // 2.3 Authenticated standard user -> /login -> redirects to / (Home)
  try {
    const res = await testEndpoint("/login", USER_COOKIE);
    const isRedirectToHome = (res.status === 307 || res.status === 308) && (res.location === "/" || res.location.endsWith("/"));
    recordResult({
      category: "User Authenticated",
      route: "GET /login",
      expected: "307/308 -> /",
      actual: `${res.status}`,
      passed: isRedirectToHome,
      details: res.location ? `-> ${res.location}` : "",
    });
  } catch (err) {
    recordResult({ category: "User Authenticated", route: "GET /login", expected: "307/308 -> /", actual: err.message, passed: false });
  }

  // =========================================================================
  // 3. AUTHENTICATED ADMINISTRATOR CHECKS (Mock admin session)
  // =========================================================================

  // 3.1 Authenticated admin -> /admin/dashboard -> 200 OK
  try {
    const res = await testEndpoint("/admin/dashboard", ADMIN_COOKIE);
    recordResult({
      category: "Admin Authenticated",
      route: "GET /admin/dashboard",
      expected: "200 OK",
      actual: `${res.status}`,
      passed: res.status === 200,
      details: "Admin Authorized",
    });
  } catch (err) {
    recordResult({ category: "Admin Authenticated", route: "GET /admin/dashboard", expected: "200 OK", actual: err.message, passed: false });
  }

  // =========================================================================
  // PRINT CLEAN SUMMARY TABLE
  // =========================================================================

  // Column width calculations
  const colCategory = 20;
  const colRoute = 24;
  const colExpected = 22;
  const colActual = 26;
  const colStatus = 8;

  function pad(str, len) {
    const s = String(str || "");
    return s.length > len ? s.slice(0, len - 1) + "…" : s.padEnd(len);
  }

  console.log("\n" + "┌" + "─".repeat(colCategory + 2) + "┬" + "─".repeat(colRoute + 2) + "┬" + "─".repeat(colExpected + 2) + "┬" + "─".repeat(colActual + 2) + "┬" + "─".repeat(colStatus + 2) + "┐");
  console.log(`│ ${pad("CATEGORY", colCategory)} │ ${pad("ROUTE", colRoute)} │ ${pad("EXPECTED", colExpected)} │ ${pad("ACTUAL", colActual)} │ ${pad("RESULT", colStatus)} │`);
  console.log("├" + "─".repeat(colCategory + 2) + "┼" + "─".repeat(colRoute + 2) + "┼" + "─".repeat(colExpected + 2) + "┼" + "─".repeat(colActual + 2) + "┼" + "─".repeat(colStatus + 2) + "┤");

  let passedCount = 0;
  let failedCount = 0;

  for (const r of results) {
    if (r.passed) passedCount++;
    else failedCount++;

    const statusStr = r.passed ? "✔ PASS" : "✖ FAIL";
    console.log(
      `│ ${pad(r.category, colCategory)} │ ${pad(r.route, colRoute)} │ ${pad(r.expected, colExpected)} │ ${pad(r.actual, colActual)} │ ${pad(statusStr, colStatus)} │`
    );
  }

  console.log("└" + "─".repeat(colCategory + 2) + "┴" + "─".repeat(colRoute + 2) + "┴" + "─".repeat(colExpected + 2) + "┴" + "─".repeat(colActual + 2) + "┴" + "─".repeat(colStatus + 2) + "┘");

  console.log("-".repeat(88));
  console.log(`TOTAL: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log("=".repeat(88));

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSecuritySuite();

