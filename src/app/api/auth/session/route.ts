import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/cookies";
import { fetchCustomerAccountProfile } from "@/lib/auth/customer-api";
import { isSecureCookieRequest } from "@/lib/auth/config";
import { getValidCustomerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export type SessionApiResponse =
  | { authenticated: false; reason?: "expired" | "unauthenticated" }
  | {
      authenticated: true;
      customer: {
        displayName: string;
        email: string | null;
      };
      warning?: "orders_unavailable";
    };

export async function GET(request: Request) {
  const secure = isSecureCookieRequest(request);
  const resolved = await getValidCustomerSession(request);

  if (!resolved) {
    const hadCookie = Boolean(
      request.headers.get("cookie")?.includes("rb_session="),
    );
    const body: SessionApiResponse = {
      authenticated: false,
      reason: hadCookie ? "expired" : "unauthenticated",
    };
    const response = NextResponse.json(body);
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
      const shouldClearSession =
        result.reason === "customer_unavailable" ||
        result.reason === "access_denied";

      const response = NextResponse.json({
        authenticated: false,
        reason: "expired",
      } satisfies SessionApiResponse);

      if (shouldClearSession) {
        response.headers.append("Set-Cookie", clearSessionCookie(secure));
      } else if (resolved.setCookie) {
        response.headers.append("Set-Cookie", resolved.setCookie);
      }

      return response;
    }

    const response = NextResponse.json({
      authenticated: true,
      customer: {
        displayName: result.profile.displayName,
        email: result.profile.email,
      },
      ...(result.warning ? { warning: result.warning } : {}),
    } satisfies SessionApiResponse);

    if (resolved.setCookie) {
      response.headers.append("Set-Cookie", resolved.setCookie);
    }

    return response;
  } catch {
    const response = NextResponse.json({
      authenticated: false,
      reason: "expired",
    } satisfies SessionApiResponse);
    if (resolved.setCookie) {
      response.headers.append("Set-Cookie", resolved.setCookie);
    }
    return response;
  }
}
