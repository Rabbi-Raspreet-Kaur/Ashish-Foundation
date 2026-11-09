import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public static assets, images, next internal files, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookie
  const sessionCookie = request.cookies.get("af_session")?.value;
  let session: { userId: string; email: string; role: string; name?: string } | null = null;

  if (sessionCookie) {
    try {
      const decoded = decodeURIComponent(sessionCookie);
      session = JSON.parse(decoded);
    } catch {
      try {
        session = JSON.parse(sessionCookie);
      } catch {
        session = null;
      }
    }
  }

  const isAuthenticated = !!(
    session &&
    typeof session === "object" &&
    session.role &&
    session.email
  );
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  // 3. Unauthenticated route protection:
  // ONLY /login and /signup are accessible without authenticating first.
  // The landing page (/) and all internal application routes MUST NOT be accessible.
  // Any unauthenticated attempt via URL bar or direct navigation immediately redirects to /login.
  if (!isAuthenticated) {
    if (isLoginPage || isSignupPage) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 4. Authenticated access to auth pages:
  // If already authenticated and visiting /login or /signup,
  // redirect immediately based on role: admin -> /admin/dashboard, user -> /
  if (isLoginPage || isSignupPage) {
    if (session?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5. Role-based Route Authorization:
  // Admin portal routes (/admin and /admin/*) are strictly restricted for Admin only.
  // If a standard regular user attempts to access any admin section, redirect to /user/dashboard.
  if (pathname.startsWith("/admin") && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

