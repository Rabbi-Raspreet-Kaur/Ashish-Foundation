import { spawn } from "node:child_process";
import assert from "node:assert";

const PORT = 3088;
const BASE_URL = `http://127.0.0.1:${PORT}`;

console.log("=== LIVE NEXT.JS ROUTE & PROXY INTEGRATION TEST ===");
console.log(`Starting Next.js production server on port ${PORT}...`);

const serverProcess = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
  {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  }
);

serverProcess.stdout.on("data", (data) => {
  const msg = data.toString().trim();
  if (msg) console.log(`[Next.js stdout] ${msg}`);
});

serverProcess.stderr.on("data", (data) => {
  const msg = data.toString().trim();
  if (msg) console.error(`[Next.js stderr] ${msg}`);
});

async function waitForServer(maxRetries = 25, delayMs = 600) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/login`);
      if (res.status === 200) {
        console.log("Next.js server is ready and responding!\n");
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error("Next.js server failed to start in time");
}

try {
  await waitForServer();

  // Helper to fetch with manual redirect handling
  async function testRoute(path, cookie = null) {
    const headers = {};
    if (cookie) headers["Cookie"] = cookie;
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers,
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    return { status: res.status, location };
  }

  console.log("--- 1. Testing Unauthenticated Route Protection ---");

  // 1. Root / must redirect to /login
  const rootRes = await testRoute("/");
  console.log(`GET / -> status ${rootRes.status}, location: ${rootRes.location}`);
  assert.strictEqual(rootRes.status, 307, "Root path / must return 307 redirect for unauthenticated requests");
  assert.ok(rootRes.location.includes("/login"), "Root path redirect must point to /login");

  // 2. /about must redirect to /login
  const aboutRes = await testRoute("/about");
  console.log(`GET /about -> status ${aboutRes.status}, location: ${aboutRes.location}`);
  assert.strictEqual(aboutRes.status, 307, "/about must redirect to /login");
  assert.ok(aboutRes.location.includes("/login"), "/about redirect must point to /login");

  // 3. /gallery must redirect to /login
  const galleryRes = await testRoute("/gallery");
  console.log(`GET /gallery -> status ${galleryRes.status}, location: ${galleryRes.location}`);
  assert.strictEqual(galleryRes.status, 307, "/gallery must redirect to /login");

  // 4. /contact must redirect to /login
  const contactRes = await testRoute("/contact");
  console.log(`GET /contact -> status ${contactRes.status}, location: ${contactRes.location}`);
  assert.strictEqual(contactRes.status, 307, "/contact must redirect to /login");

  // 5. /transparency must redirect to /login
  const transRes = await testRoute("/transparency");
  console.log(`GET /transparency -> status ${transRes.status}, location: ${transRes.location}`);
  assert.strictEqual(transRes.status, 307, "/transparency must redirect to /login");

  // 6. /admin/dashboard must redirect to /login
  const adminDashRes = await testRoute("/admin/dashboard");
  console.log(`GET /admin/dashboard -> status ${adminDashRes.status}, location: ${adminDashRes.location}`);
  assert.strictEqual(adminDashRes.status, 307, "/admin/dashboard must redirect unauthenticated to /login");

  // 7. /user/dashboard must redirect to /login
  const userDashRes = await testRoute("/user/dashboard");
  console.log(`GET /user/dashboard -> status ${userDashRes.status}, location: ${userDashRes.location}`);
  assert.strictEqual(userDashRes.status, 307, "/user/dashboard must redirect unauthenticated to /login");

  // 8. Public login and signup must be allowed (status 200)
  const loginRes = await testRoute("/login");
  console.log(`GET /login -> status ${loginRes.status}`);
  assert.strictEqual(loginRes.status, 200, "GET /login must return 200 OK");

  const signupRes = await testRoute("/signup");
  console.log(`GET /signup -> status ${signupRes.status}`);
  assert.strictEqual(signupRes.status, 200, "GET /signup must return 200 OK");

  console.log("\n--- 2. Testing Authenticated Regular User Access ---");
  const userCookie = `af_session=${encodeURIComponent(
    JSON.stringify({
      userId: "usr-demo-123",
      email: "pooja.sharma@example.org",
      name: "Pooja Sharma",
      role: "user",
    })
  )}`;

  // Authenticated user accessing /
  const userRoot = await testRoute("/", userCookie);
  console.log(`User GET / -> status ${userRoot.status}`);
  assert.strictEqual(userRoot.status, 200, "Authenticated user can access /");

  // Authenticated user accessing /about
  const userAbout = await testRoute("/about", userCookie);
  console.log(`User GET /about -> status ${userAbout.status}`);
  assert.strictEqual(userAbout.status, 200, "Authenticated user can access /about");

  // Authenticated user accessing /user/dashboard
  const userDash = await testRoute("/user/dashboard", userCookie);
  console.log(`User GET /user/dashboard -> status ${userDash.status}`);
  assert.strictEqual(userDash.status, 200, "Authenticated user can access /user/dashboard");

  // Authenticated user attempting to access /admin/dashboard -> must be blocked & redirected to /user/dashboard
  const userAdminAttempt = await testRoute("/admin/dashboard", userCookie);
  console.log(`User GET /admin/dashboard -> status ${userAdminAttempt.status}, location: ${userAdminAttempt.location}`);
  assert.strictEqual(userAdminAttempt.status, 307, "Regular user accessing admin area must be redirected");
  assert.ok(userAdminAttempt.location.includes("/user/dashboard"), "Regular user must be redirected to /user/dashboard");

  // Authenticated user visiting /login -> redirected to /user/dashboard
  const userLoginAttempt = await testRoute("/login", userCookie);
  console.log(`User GET /login -> status ${userLoginAttempt.status}, location: ${userLoginAttempt.location}`);
  assert.strictEqual(userLoginAttempt.status, 307, "Logged-in user visiting /login must be redirected");
  assert.ok(userLoginAttempt.location.includes("/user/dashboard"), "Must redirect to /user/dashboard");

  console.log("\n--- 3. Testing Authenticated Admin Access ---");
  const adminCookie = `af_session=${encodeURIComponent(
    JSON.stringify({
      userId: "admin-master-001",
      email: "admin@ashishfoundation.org",
      name: "Ashish Foundation Admin",
      role: "admin",
    })
  )}`;

  // Admin accessing /admin/dashboard -> status 200
  const adminDash = await testRoute("/admin/dashboard", adminCookie);
  console.log(`Admin GET /admin/dashboard -> status ${adminDash.status}`);
  assert.strictEqual(adminDash.status, 200, "Admin can access /admin/dashboard");

  // Admin accessing / -> status 200
  const adminRoot = await testRoute("/", adminCookie);
  console.log(`Admin GET / -> status ${adminRoot.status}`);
  assert.strictEqual(adminRoot.status, 200, "Admin can access /");

  // Admin visiting /login -> redirected to /admin/dashboard
  const adminLoginAttempt = await testRoute("/login", adminCookie);
  console.log(`Admin GET /login -> status ${adminLoginAttempt.status}, location: ${adminLoginAttempt.location}`);
  assert.strictEqual(adminLoginAttempt.status, 307, "Logged-in admin visiting /login must be redirected");
  assert.ok(adminLoginAttempt.location.includes("/admin/dashboard"), "Must redirect to /admin/dashboard");

  console.log("\n============================================================");
  console.log("ALL 15 LIVE ROUTE & SECURITY CHECKS PASSED PERFECTLY!");
  console.log("============================================================");
} finally {
  serverProcess.kill("SIGKILL");
}

