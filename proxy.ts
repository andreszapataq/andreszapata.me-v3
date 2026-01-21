import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Excludes: api, _next, _vercel, and any file with extension (favicon.ico, images, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
