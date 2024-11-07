import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/api/uploadthing", "/api/webhook"], // Public routes that do not require authentication
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)", "/trpc/(.*)"], // Protect all other routes except public ones
};
