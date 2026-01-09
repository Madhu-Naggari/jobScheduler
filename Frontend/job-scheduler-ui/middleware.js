"use client";
import { NextResponse } from "next/server";
import { default as Cookies } from "js-cookie";

export function middleware(req) {
  const token = Cookies.get("jwtToken");

  const protectedPaths = ["/", "/dashboard"];

  if (!token && protectedPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
