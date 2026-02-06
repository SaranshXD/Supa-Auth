import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = ["/login", "/signup"];
const PROTECTED_PREFIXES = ["/dashboard"];
const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  user: ["/dashboard"],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  const isAuthed = !!data.user;
  const userRole = data.user?.role || "guest";

  const path = req.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.includes(path);
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isRoleProtected = ROLE_PROTECTED_ROUTES[userRole]?.some((p: string) =>
    path.startsWith(p),
  );

  if (path === "/") {
    const url = req.nextUrl.clone();
    url.pathname = isAuthed ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  // not logged in -> blocked from protected
  if (!isAuthed && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // logged in -> blocked from auth pages
  if (isAuthed && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // logged in -> role-based access control
  if (isAuthed && isRoleProtected === false) {
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
};
