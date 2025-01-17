import { clerkMiddleware, createRouteMatcher,clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import ratelimit from "./config/rateLimit";

// Define public routes (accessible without authentication)
const publicRoutes = ["/", "/quiz", "/sign-in", "/sign-up", "/api/(.*)", "/api/webhooks(.*)"];

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/doctor(.*)", "/patient(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  const { pathname } = req.nextUrl;

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rate Limit Exceeded</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f8f9fa;
            color: #333;
          }
          h1 {
            font-size: 2.5rem;
            color: #d9534f;
          }
          p {
            font-size: 1.2rem;
            margin-top: 20px;
          }
          a {
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Too Many Requests</h1>
        <p>You've made too many requests in a short period. Please try again later.</p>
        <p><a href="/">Go back to the homepage</a></p>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 429,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Handle authenticated users
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

      // Protect role-specific routes
      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (pathname.startsWith("/doctor") && role !== "doctor") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (pathname.startsWith("/patient") && role !== "patient") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Prevent authenticated users from accessing public routes
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
      return redirectToSignIn();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
