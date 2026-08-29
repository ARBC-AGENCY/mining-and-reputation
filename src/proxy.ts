import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip /studio (Sanity Studio is not localised), API routes, Next internals,
  // and anything with a file extension.
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
