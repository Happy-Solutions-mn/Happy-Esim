import { NextRequest } from "next/server";
import { listPackages, EsimApiError } from "@/lib/esim-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationCode = searchParams.get("locationCode") || undefined;
  const type = (searchParams.get("type") as "BASE" | "TOPUP") || "BASE";
  const packageCode = searchParams.get("packageCode") || undefined;
  const slug = searchParams.get("slug") || undefined;

  try {
    const data = await listPackages({ locationCode, type, packageCode, slug });
    return Response.json({ success: true, data });
  } catch (err) {
    if (err instanceof EsimApiError) {
      return Response.json(
        { success: false, errorCode: err.errorCode, message: err.message },
        { status: 400 }
      );
    }
    console.error("[/api/esim/packages] Error:", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
