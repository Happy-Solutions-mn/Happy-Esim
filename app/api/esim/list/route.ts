import { NextRequest } from "next/server";
import {countryData} from "../../countryData";
export async function GET(request: NextRequest) {
    const data = countryData;
    const jsonData:any[] = []
    data.map((item) => {
    const a = {...item
        ,fromPrice:item.prices.sort((a, b) => a.price - b.price)[0].price
    };
        // item.fromPrice = item.prices.sort((a, b) => a.price - b.price)[0].price;
        a.name = item.countryName;
        jsonData.push(a);
    })
    

    return Response.json(jsonData);
}