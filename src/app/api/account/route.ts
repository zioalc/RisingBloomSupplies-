import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/cookies";
import { fetchCustomerAccountProfile } from "@/lib/auth/customer-api";
import { isSecureCookieRequest } from "@/lib/auth/config";
import { getValidCustomerSession } from "@/lib/auth/session";
import type { CustomerAccountProfile } from "@/lib/auth/customer-api";

export const dynamic = "force-dynamic";

export type AccountApiResponse =
  | { status: "unauthenticated" }
  | { status: "expired" }
  | { status: "error" }
  | { status: "authenticated"; profile: CustomerAccountProfile };

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
    const profile = await fetchCustomerAccountProfile(
      resolved.tokens.accessToken,
    );

    if (!profile) {
      const response = NextResponse.json({
        status: "error",
      } satisfies AccountApiResponse);
      response.headers.append("Set-Cookie", clearSessionCookie(secure));
      return response;
    }

    const response = NextResponse.json({
      status: "authenticated",
      profile,
    } satisfies AccountApiResponse);

    if (resolved.setCookie) {
      response.headers.append("Set-Cookie", resolved.setCookie);
    }

    return response;
  } catch {
    const response = NextResponse.json({
      status: "error",
    } satisfies AccountApiResponse);
    response.headers.append("Set-Cookie", clearSessionCookie(secure));
    return response;
  }
}
