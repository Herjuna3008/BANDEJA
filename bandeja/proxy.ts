import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const path = nextUrl.pathname;

  // Public routes
  if (path === "/" || path === "/login") {
    return NextResponse.next();
  }

  // All protected routes require login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Admin only
  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Venue owner dashboard - requires VENUE_OWNER role (approval checked in page)
  if (path.startsWith("/venue-owner") && role !== "VENUE_OWNER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Coach dashboard - requires COACH role (approval checked in page)
  if (path.startsWith("/coach-dashboard") && role !== "COACH" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
