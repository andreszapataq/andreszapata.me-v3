import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CRM_BASE, crmPath } from "@/lib/crm/route";

/**
 * Refresca el token de sesión y lo propaga tanto al request (para Server
 * Components) como a la respuesta (para el navegador). Además protege el
 * CRM: sin sesión válida, todo cae en su pantalla de login.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // No agregar código entre createServerClient y getClaims(): romperlo provoca
  // cierres de sesión aleatorios y muy difíciles de depurar.
  const { data } = await supabase.auth.getClaims();

  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === crmPath("/login");

  if (!data?.claims && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = crmPath("/login");
    url.search = "";
    if (pathname !== CRM_BASE) {
      url.searchParams.set("next", pathname + search);
    }
    return NextResponse.redirect(url);
  }

  if (data?.claims && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = CRM_BASE;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
