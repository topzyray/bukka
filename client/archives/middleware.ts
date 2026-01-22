import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasSession =
    req.cookies.get("accessToken") || req.cookies.get("refreshToken");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Oauth/bootstrap"],
};
