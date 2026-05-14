import { NextRequest } from "next/server";
import { queryEsim, EsimApiError } from "@/lib/esim-client";
import { DataResponse } from "../../utils/Res";
export const runtime = 'edge';
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderNo = searchParams.get("orderNo") || undefined;
    const iccid = searchParams.get("iccid") || undefined;

    if (!orderNo && !iccid) {
        return DataResponse(
            { success: false, message: "orderNo or iccid is required" },
            400
        );
    }

    try {
        const data = await queryEsim({
            ...(orderNo ? { orderNo } : {}),
            ...(iccid ? { iccid } : {}),
            pager: { pageSize: 20, pageNum: 1 },
        });
        return DataResponse({ success: true, data });
    } catch (err) {
        if (err instanceof EsimApiError) {
            return DataResponse(
                {
                    success: false,
                    errorCode: err.errorCode,
                    message: err.message,
                },
                400
            );
        }
        console.error("[/api/esim/query] Error:", err);
        return DataResponse(
            { success: false, message: "Internal server error" },
            500
        );
    }
}
