import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (accessible without authentication)
const publicRoutes = ["/", "/sign-in", "/sign-up","/api/(.*)"];

export default authMiddleware({
  publicRoutes,
  async afterAuth(auth, req) {
    const { userId } = auth;
    const { pathname } = req.nextUrl;

    // if unauthenticated users try to access protected routes
    if (
      !userId &&
      !publicRoutes.some((route) => new RegExp(`^${route}$`).test(pathname))
    ) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // if the user is authenticated, fetch their role from Clerk
    if (userId) {
      try {
        const user = await clerkClient.users.getUser(userId);
        const role = user.publicMetadata.role as string | undefined;

        console.log("User Role:", role);
        
        if (pathname === "/") {
          if (role === "admin") {
            return NextResponse.redirect(new URL("/admin", req.url));
          } else if (role === "doctor") {
            return NextResponse.redirect(new URL("/doctor", req.url));
          } else if (role === "patient") {
            return NextResponse.redirect(new URL("/patient", req.url));
          }
        }

        // protect admin routes from non-admin users
        if (pathname.startsWith("/admin") && role !== "admin") {
          return NextResponse.redirect(new URL("/", req.url));
        }

        // protect doctor routes from non-doctor users
        if (pathname.startsWith("/doctor") && role !== "doctor") {
          return NextResponse.redirect(new URL("/", req.url));
        }

        // protect patient routes from non-patient users
        if (pathname.startsWith("/patient") && role !== "patient") {
          return NextResponse.redirect(new URL("/", req.url));
        }

        // prevent authenticated users from accessing public routes
        if (publicRoutes.includes(pathname)) {
          if (role === "admin" && pathname !== "/admin") {
            return NextResponse.redirect(new URL("/admin", req.url));
          } else if (role === "doctor" && pathname !== "/doctor") {
            return NextResponse.redirect(new URL("/doctor", req.url));
          } else if (role === "patient" && pathname !== "/patient") {
            return NextResponse.redirect(new URL("/patient", req.url));
          }
        }
      } catch (error) {
        console.error("Error fetching user data from Clerk:", error);
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)", 
  ],
};
