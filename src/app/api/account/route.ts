import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/cookies";
import {
  fetchCustomerAccountProfile,
  type CustomerAccountProfile,
} from "@/lib/auth/customer-api";
import { isSecureCookieRequest } from "@/lib/auth/config";
import { getValidCustomerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export type AccountApiResponse =
  | { status: "unauthenticated" }
  | { status: "expired"; reason?: "graphql_unauthorized" }
  | {
      status: "error";
      reason?:
        | "graphql_http_error"
        | "customer_unavailable"
        | "access_denied"
        | "unknown_graphql_error";
    }
  | {
      status: "authenticated";
      profile: CustomerAccountProfile;
      warning?: "orders_unavailable";
    };

export async function GET(request: Request) {
  const secure = isSecureCookieRequest(request);
  const hadCookie = Boolean(
    request.headers.get("cookie")?.includes("rb_session="),
  );
  const resolved = await getValidCustomerSession(request);

  if (!resolved) {
    const response = NextResponse.json({
      status: hadCookie ? "expired" : "unauthenticated",
    } satisfies AccountApiResponse);
    if (hadCookie) {
      response.headers.append("Set-Cookie", clearSessionCookie(secure));
    }
    return response;
  }

  try {
    const result = await fetchCustomerAccountProfile(
      resolved.tokens.accessToken,
    );

    if (!result.ok) {
      // A rejected token is recoverable by signing in again, so surface it as
      // an expired session rather than a generic error the user can't escape.
      if (result.reason === "graphql_unauthorized") {
        const response = NextResponse.json({
          status: "expired",
          reason: "graphql_unauthorized",
        } satisfies AccountApiResponse);
        response.headers.append("Set-Cookie", clearSessionCookie(secure));
        return response;
      }

      // Keep the session for transient GraphQL issues; only clear when the
      // customer resource itself is unavailable / denied.
      const shouldClearSession =
        result.reason === "customer_unavailable" ||
        result.reason === "access_denied";

      const response = NextResponse.json({
        status: "error",
        reason: result.reason,
      } satisfies AccountApiResponse);

      if (shouldClearSession) {
        response.headers.append("Set-Cookie", clearSessionCookie(secure));
      } else if (resolved.setCookie) {
        response.headers.append("Set-Cookie", resolved.setCookie);
      }

      return response;
    }

    const response = NextResponse.json({
      status: "authenticated",
      profile: result.profile,
      ...(result.warning ? { warning: result.warning } : {}),
    } satisfies AccountApiResponse);

    if (resolved.setCookie) {
      response.headers.append("Set-Cookie", resolved.setCookie);
    }

    return response;
  } catch {
    const response = NextResponse.json({
      status: "error",
      reason: "unknown_graphql_error",
    } satisfies AccountApiResponse);
    if (resolved.setCookie) {
      response.headers.append("Set-Cookie", resolved.setCookie);
    }
    return response;
  }
}
