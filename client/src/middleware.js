export async function middleware(request) {
    const jwt = request.cookies.get("myTokenName")?.value;
  
    if (!jwt) {
      // Redirect to login if user is not authenticated
      if (request.nextUrl.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }
  
    try {
      await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
  
      // If user is logged in, prevent access to login page
      if (request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
  
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  // Apply middleware to relevant routes
  export const config = {
    matcher: ["/dashboard/:path*", "/login"], // Protect dashboard & control login access
  };
  