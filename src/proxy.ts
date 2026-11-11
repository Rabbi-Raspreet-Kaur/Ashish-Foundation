import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Immediate bypass for Next.js internal assets, auth API, static files, and media
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/images") ||
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
  const isAdmin = session?.role === "admin";

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isUserRoute = pathname.startsWith("/user");
  const isAdminRoute = pathname.startsWith("/admin");

  // 3. Auth pages (/login, /signup):
  // - Publicly accessible when unauthenticated.
  // - If already authenticated: strictly redirect standard users to '/' and admins to '/admin/dashboard'.
  if (isLoginPage || isSignupPage) {
    if (isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. Admin protected routes (/admin and /admin/*):
  // - Requires both an active authenticated session AND role === 'admin'.
  // - If unauthenticated: redirect to /login with return URL.
  // - If authenticated standard user: redirect to '/' (home).
  if (isAdminRoute) {
    if (pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 5. User protected routes (/user and /user/*):
  // - Requires a valid logged-in session.
  // - If unauthenticated: redirect to /login with return URL.
  if (isUserRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 6. Public routes (allow unauthenticated access):
  // - '/' (Home page)
  // - Public informational pages (/about, /contact, /gallery, etc.)
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};

