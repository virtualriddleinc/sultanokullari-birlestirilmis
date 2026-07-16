import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  AUTH_RATE_LIMITS,
  emitBootstrapEvent,
  hasBootstrapSecretConfigured,
  ipAllowedForBootstrap,
  isBootstrapFailClosed,
  isTrustedAuthOrigin,
  isValidBootstrapSecret,
  rateLimitPg,
} from "@/lib/cms-security";

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
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  return response;
}

function jsonError(
  message: string,
  status: number,
  extraHeaders?: Record<string, string>,
): NextResponse {
  const response = NextResponse.json(
    { errors: [{ message }] },
    { status },
  );
  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      response.headers.set(key, value);
    }
  }
  return applySecurityHeaders(response);
}

async function enforceRateLimit(
  bucketKey: string,
  limit: number,
  windowMs: number,
): Promise<NextResponse | null> {
  try {
    const result = await rateLimitPg(bucketKey, limit, windowMs);
    if (!result.ok) {
      return jsonError("Çok fazla istek. Lütfen bekleyin.", 429, {
        "Retry-After": String(result.retryAfterSec),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Limit": String(result.limit),
      });
    }
    return null;
  } catch (error) {
    // Rate-limit tablosu yoksa veya DB hatası: fail-open log, isteği kesme
    console.warn(
      JSON.stringify({
        event: "cms.rate_limit.error",
        detail: error instanceof Error ? error.message : "unknown",
      }),
    );
    return null;
  }
}

function requireTrustedOrigin(request: NextRequest): NextResponse | null {
  if (isTrustedAuthOrigin(request)) return null;
  return jsonError("Geçersiz istek kaynağı.", 403);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = clientIp(request);
  const failClosed = isBootstrapFailClosed();

  // GET /api/users/init — prod'da keşif maskesi
  if (method === "GET" && pathname === "/api/users/init") {
    const limited = await enforceRateLimit(
      `init:${ip}`,
      AUTH_RATE_LIMITS.init.limit,
      AUTH_RATE_LIMITS.init.windowMs,
    );
    if (limited) return limited;

    if (failClosed) {
      return applySecurityHeaders(
        NextResponse.json({ initialized: true }, { status: 200 }),
      );
    }
  }

  // Auth state-changing endpoints
  const isLogin = method === "POST" && pathname === "/api/users/login";
  const isFirstRegister =
    method === "POST" && pathname === "/api/users/first-register";
  const isUsersCreate = method === "POST" && pathname === "/api/users";
  const isForgot =
    method === "POST" && pathname === "/api/users/forgot-password";
  const isReset =
    method === "POST" && pathname === "/api/users/reset-password";

  if (isLogin || isFirstRegister || isUsersCreate || isForgot || isReset) {
    // Bootstrap secret ile gelen acil first-register Origin'siz olabilir
    const bootstrapHeader = request.headers.get("x-bootstrap-secret");
    const secretOk = isValidBootstrapSecret(bootstrapHeader);
    if (!(isFirstRegister && secretOk)) {
      const originError = requireTrustedOrigin(request);
      if (originError) return originError;
    }
  }

  if (isLogin) {
    const limited = await enforceRateLimit(
      `login:${ip}`,
      AUTH_RATE_LIMITS.login.limit,
      AUTH_RATE_LIMITS.login.windowMs,
    );
    if (limited) return limited;
  }

  if (isFirstRegister) {
    const limited = await enforceRateLimit(
      `first-register:${ip}`,
      AUTH_RATE_LIMITS.firstRegister.limit,
      AUTH_RATE_LIMITS.firstRegister.windowMs,
    );
    if (limited) return limited;

    if (failClosed) {
      if (!ipAllowedForBootstrap(ip)) {
        void emitBootstrapEvent({
          event: "cms.bootstrap.first_register_denied_ip",
          level: "warn",
          ip,
        });
        return jsonError("Bootstrap bu ağdan kapalı.", 403);
      }

      if (!hasBootstrapSecretConfigured()) {
        void emitBootstrapEvent({
          event: "cms.bootstrap.first_register_denied_no_secret",
          level: "warn",
          ip,
        });
        return jsonError("İlk kullanıcı oluşturma kapalı.", 403);
      }

      const header = request.headers.get("x-bootstrap-secret");
      if (!isValidBootstrapSecret(header)) {
        void emitBootstrapEvent({
          event: "cms.bootstrap.first_register_denied_bad_secret",
          level: "warn",
          ip,
        });
        return jsonError("İlk kullanıcı oluşturma kapalı.", 403);
      }

      void emitBootstrapEvent({
        event: "cms.bootstrap.first_register_secret_ok",
        level: "critical",
        ip,
      });
    }
  }

  if (isUsersCreate) {
    const limited = await enforceRateLimit(
      `users-create:${ip}`,
      AUTH_RATE_LIMITS.usersCreate.limit,
      AUTH_RATE_LIMITS.usersCreate.windowMs,
    );
    if (limited) return limited;

    // Anonymous create — production fail-closed (cookie ile admin create'e izin)
    const hasAuthCookie =
      Boolean(request.cookies.get("payload-token")?.value) ||
      Boolean(request.headers.get("authorization"));
    if (failClosed && !hasAuthCookie) {
      void emitBootstrapEvent({
        event: "cms.bootstrap.anonymous_create_denied",
        level: "warn",
        ip,
      });
      return jsonError("Anonim kullanıcı oluşturma kapalı.", 403);
    }
  }

  if (isForgot) {
    const limited = await enforceRateLimit(
      `forgot:${ip}`,
      AUTH_RATE_LIMITS.forgotPassword.limit,
      AUTH_RATE_LIMITS.forgotPassword.windowMs,
    );
    if (limited) return limited;

    if (failClosed && !process.env.SMTP_HOST?.trim()) {
      void emitBootstrapEvent({
        event: "cms.bootstrap.forgot_disabled_no_smtp",
        level: "warn",
        ip,
      });
      return jsonError(
        "Şifre sıfırlama e-posta yapılandırması olmadan kapalı.",
        403,
      );
    }
  }

  if (isReset) {
    const limited = await enforceRateLimit(
      `reset:${ip}`,
      AUTH_RATE_LIMITS.resetPassword.limit,
      AUTH_RATE_LIMITS.resetPassword.windowMs,
    );
    if (limited) return limited;
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)",
  ],
};
