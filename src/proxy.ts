import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Basit IP rate limit — proxy süreç belleği (tek instance). */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login brute-force koruması
  if (
    pathname === "/api/users/login" &&
    request.method === "POST"
  ) {
    const ip = clientIp(request);
    const now = Date.now();
    const bucket = loginAttempts.get(ip);
    if (!bucket || bucket.resetAt <= now) {
      loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    } else if (bucket.count >= 20) {
      return applySecurityHeaders(
        NextResponse.json(
          { errors: [{ message: "Çok fazla giriş denemesi. Lütfen bekleyin." }] },
          { status: 429 },
        ),
      );
    } else {
      bucket.count += 1;
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)",
  ],
};
