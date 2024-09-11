import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

async function checkLogin(req: NextRequest) {
  let token = req.cookies.get("sb-access-token");
  if (!token) {
    return null;
  }
  let authRequestResult = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_DB_URL}/auth/v1/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        APIKey: process.env.NEXT_PUBLIC_SUPABASE_DB_PUBLIC_KEY!,
      },
    },
  );
  return authRequestResult;
}

export async function middleware(req: NextRequest, e: NextFetchEvent) {
  const authRequestResult = await checkLogin(req);
  if (!authRequestResult || authRequestResult.status !== 200) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/product/:path*", "/adming/products"],
};
