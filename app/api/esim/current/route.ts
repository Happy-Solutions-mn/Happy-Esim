import { NextRequest } from "next/server";
import { jsonData } from "../../countryData";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("id") || "";
    const counrty = slug.split("_")[0];
    const countryData = jsonData[counrty];
    if (!countryData) {
        return new Response(JSON.stringify({ error: "No data found" }));
    }
    let data = null;
    countryData.prices.map((i) => {
        if (i.slug == slug) {
            data = {
                name: countryData.name,
                code: countryData.code,
                regeon: countryData.region,
                speed: countryData.speed,
                volume: i.volume,
                price: i.price,
                data: i.data,
                time: i.time,
            };
        }
    });
    if (data) {
        return new Response(JSON.stringify(data));
    }
    return new Response(JSON.stringify({ error: "No data found" }));
}
