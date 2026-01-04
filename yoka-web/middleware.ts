import { NextRequest, NextResponse } from "next/server";
import { authService } from "./service/auth.service";

const protectedPaths = ["/dashboard", "/admin", "/booking", "/course/booking"];

const isProtectedPath = (path: string) => {
  return protectedPaths.some((prefix) => path.startsWith(prefix));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenValue = request.cookies.get("token")?.value;

  const isProtected = isProtectedPath(pathname);
  console.log(tokenValue);
  if (!tokenValue) {
    if (isProtected) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  try {
    const apiResponse = await authService.me(tokenValue);

    if (
      !apiResponse ||
      (apiResponse.data && !apiResponse.data.success && !apiResponse.data.id)
    ) {
      throw new Error("Invalid Token Response");
    }
    const userData = apiResponse.data;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-profile", JSON.stringify(userData));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Middleware Auth Error:", error);

    const response = isProtected
      ? NextResponse.redirect(new URL("/signin", request.url))
      : NextResponse.next();

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|singin|signin).*)",
  ],
};
