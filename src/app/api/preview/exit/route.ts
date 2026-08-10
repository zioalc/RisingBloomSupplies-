import { NextResponse } from "next/server";
import {
  clearPreviewCookie,
  isSecurePreviewRequest,
} from "@/lib/previewAccess";

export const dynamic = "force-dynamic";

/** Clear the developer preview cookie (ends maintenance bypass for this browser). */
export async function POST(request: Request) {
  if (process.env.STOREFRONT_PREVIEW_ENABLED !== "true") {
    return new NextResponse(null, { status: 404 });
  }

  const secure = isSecurePreviewRequest(request);
  const response = NextResponse.json({ ok: true });
  response.headers.append("Set-Cookie", clearPreviewCookie(secure));
  return response;
}
