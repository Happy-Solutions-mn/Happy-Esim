import { NextRequest } from "next/server";
import { jsonData } from "../../countryData";
import { DataResponse } from "../../utils/Res";
export async function GET(request: NextRequest) {
    const data = jsonData;

    return DataResponse(
        Object.values(data).sort((a, b) => {
            return b.prices.length - a.prices.length;
        })
    );
}
