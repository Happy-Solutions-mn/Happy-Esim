import { NextRequest } from "next/server";
import { queryEsim, EsimApiError } from "@/lib/esim-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNo = searchParams.get("orderNo") || undefined;
  const iccid = searchParams.get("iccid") || undefined;

  if (!orderNo && !iccid) {
    return Response.json(
      { success: false, message: "orderNo or iccid is required" },
      { status: 400 }
    );
  }

  try {
    const data = await queryEsim({
      ...(orderNo ? { orderNo } : {}),
      ...(iccid ? { iccid } : {}),
      pager: { pageSize: 20, pageNum: 1 },
    });
    return Response.json({ success: true, data });
  } catch (err) {
    if (err instanceof EsimApiError) {
      return Response.json(
        { success: false, errorCode: err.errorCode, message: err.message },
        { status: 400 }
      );
    }
    console.error("[/api/esim/query] Error:", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
