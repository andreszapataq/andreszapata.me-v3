import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/proxy';
import { CRM_BASE } from './lib/crm/route';

const intlProxy = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // El CRM es privado y no está internacionalizado: solo refresca la sesión
  // de Supabase y bloquea el acceso sin login.
  if (request.nextUrl.pathname.startsWith(CRM_BASE)) {
    return await updateSession(request);
  }

  return intlProxy(request) ?? NextResponse.next();
}

export const config = {
  // Cubre las rutas internacionalizadas y la base del CRM (que se desvía arriba).
  // Excludes: api, _next, _vercel, and any file with extension (favicon.ico, images, etc.)
  matcher: ['/((?!api|_next|_vercel|propuestas|pago-exitoso|.*\\..*).*)']
};
