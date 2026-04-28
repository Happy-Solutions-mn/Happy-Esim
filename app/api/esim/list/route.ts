import { NextRequest } from "next/server";
import { jsonData } from "../../countryData";
export async function GET(request: NextRequest) {
    const data = jsonData;

    return Response.json(
        Object.values(data).sort((a, b) => {
            return b.prices.length - a.prices.length;
        })
    );
}
