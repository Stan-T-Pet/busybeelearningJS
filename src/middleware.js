import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow requests to NextAuth API
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow public pages like login and register
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // Get user session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-Based Protection
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect non-admins
  }

  if (pathname.startsWith("/parent") && token.role !== "parent") {
    return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect non-parents
  }

  if (pathname.startsWith("/child") && token.role !== "child") {
    return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect non-children
  }

  return NextResponse.next();
}

//Apply middleware to protect specific routes
export const config = {
  matcher: [
    "/dashboard",
    "/admin/:path*",
    "/parent/:path*",
    "/child/:path*",
  ],
};
