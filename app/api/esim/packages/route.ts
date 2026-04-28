import { NextRequest } from "next/server";
import { jsonData } from "../../countryData";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get("locationCode") || "";
    const data = jsonData[locationCode];
    if(data){
    return Response.json(jsonData[locationCode]);
    }else{
        return Response.json({error:"package not found"})
    }
}
