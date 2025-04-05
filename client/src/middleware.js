import { NextRequest, NextResponse } from "next/server";
import isValidJWT from "@/utils/valid_jwt";

export default async function middleware(request) {
  const JWT_COOKIE = request.cookies.get("authToken");
  const JWT_TOKEN = JWT_COOKIE ? JWT_COOKIE.value : null;
  const { pathname } = request.nextUrl;

  //  Ensure valid JWT check is awaited
  const validJWT = JWT_TOKEN ? await isValidJWT(JWT_TOKEN) : false;

  console.log("JWT Token:", JWT_TOKEN);
  console.log("Token valid:", validJWT);
  console.log("Path:", pathname);

  //  Define auth-related pages (except `/verify-email`)
  const authPaths = [
    "/account/login",
    "/account/register",
    "/account/logout",
    "/account/reset-password",
    "/account/reset-password-link",
    "/account/send-password-reset-email",
    "/user/verify-otp",
  ];

  //  Allow access to `/verify-email` without authentication
  if (pathname.startsWith("/account/verify-email")) {
    console.log(" Allowing access to email verification page");
    return NextResponse.next();
  }
  if (pathname.startsWith("/account/send-password-reset-email")) {
    console.log(" Allowing access to email verification page");
    return NextResponse.next();
  }
  if (pathname.startsWith("/account/reset-password")) {
    console.log(" Allowing access to email verification page");
    return NextResponse.next();
  }
  //  Check if the requested path is in authPaths
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  //  Allow access to Next.js static files (avoid middleware blocking static assets)
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  //  Redirect logged-in users away from authentication pages
  if (validJWT && isAuthPath) {
    console.log("🔀 Redirecting valid JWT logged-in user away from auth pages");
    return NextResponse.redirect(new URL("/", request.url));
  }

  //  Redirect unauthenticated users to login page (only for protected routes)
  if (!validJWT && !isAuthPath) {
    console.log("🔀 Redirecting unauthenticated user to /account/login");
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  return NextResponse.next();
}
