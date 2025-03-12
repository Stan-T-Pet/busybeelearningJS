import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Allow authentication and public pages
  if (
    pathname.startsWith("/api/auth") || 
    pathname === "/login" || 
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  // ✅ Get user session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Redirect to login if user is not authenticated
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Role-Based Access Control (RBAC)
  const userRole = token.role;

  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/parent") && userRole !== "parent") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/child") && userRole !== "child") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to protect specific routes
export const config = {
  matcher: [
    "/dashboard",
    "/admin/:path*",
    "/parent/:path*",
    "/child/:path*",
  ],
};