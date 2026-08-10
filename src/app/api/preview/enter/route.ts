import { NextResponse } from "next/server";
import {
  createPreviewCookieValue,
  isPreviewKeyValid,
  isSecurePreviewRequest,
  serializePreviewCookie,
} from "@/lib/previewAccess";

export const dynamic = "force-dynamic";

/**
 * Developer-only: enable full storefront access while MAINTENANCE_MODE is on.
 * Requires STOREFRONT_PREVIEW_ENABLED=true and a matching preview secret header.
 * Sets an httpOnly signed cookie — no public query-string bypass.
 */
export async function POST(request: Request) {
  if (process.env.STOREFRONT_PREVIEW_ENABLED !== "true") {
    return new NextResponse(null, { status: 404 });
  }

  const provided = request.headers.get("x-storefront-preview-key");
  if (!isPreviewKeyValid(provided)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await createPreviewCookieValue();
  if (!token) {
    return NextResponse.json(
      { error: "Preview access is not configured." },
      { status: 503 },
    );
  }

  const secure = isSecurePreviewRequest(request);
  const response = NextResponse.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    serializePreviewCookie(token, secure),
  );
  return response;
}
