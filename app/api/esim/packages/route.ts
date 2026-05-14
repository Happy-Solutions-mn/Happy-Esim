import { NextRequest } from "next/server";
import { jsonData } from "../../countryData";
import { DataResponse } from "../../utils/Res";
export const runtime = 'edge';
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get("locationCode") || "";
    const data = jsonData[locationCode];
    if (data) {
        return DataResponse(jsonData[locationCode]);
    } else {
        return DataResponse({ error: "package not found" }, 400);
    }
}
