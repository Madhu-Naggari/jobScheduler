import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // allow auth pages
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  const token = req.cookies.get("jwtToken")?.value;

  // protect jobs route only (NOT /)
  if (!token && pathname.startsWith("/jobs")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/jobs/:path*"],
};
