import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/dashboard")) {
    const hasToken = req.cookies.has("refreshToken");

    if (!hasToken && !url.pathname.startsWith("/signin")) {
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  const headers = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    // "Referrer-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=()",
    // "Content-Security-Policy": "default-src 'self'; script-src 'self'",
  };

  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
