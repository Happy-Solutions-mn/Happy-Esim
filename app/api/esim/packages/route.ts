import { EsimPackage } from "./../../../../lib/esim-client";
import { NextRequest } from "next/server";
import { listPackages, EsimApiError } from "@/lib/esim-client";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import {jsonData} from "../../countryData";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get("locationCode") || undefined;
    // const locationCode =  undefined;
    const type = (searchParams.get("type") as "BASE" | "TOPUP") || "BASE";
    const packageCode = searchParams.get("packageCode") || undefined;
    const slug = searchParams.get("slug") || undefined;

    try {
        const data = await listPackages({
            locationCode,
            type,
            packageCode,
            slug,
        });
        const favData = data.packageList
            .sort((a, b) => a.price - b.price)
            .filter((x) =>  x.slug.split("_")[0] == locationCode
            
            && x.slug.split("_").length == 3);

        favData.forEach((pkg) => {
            let c = jsonData[pkg.slug.split("_")[0] as keyof typeof jsonData].prices.find((y) => y.slug == pkg.slug)?.price || 0;
        pkg.price = c;
        
        })
        console.log(favData[0]);

        // const codeList =[];
        // const d = []
        // favData.forEach((pkg) => {
        //     const name = pkg.slug.split("_")[0];
        //     if(codeList.indexOf(name) == -1){
        //         codeList.push(name);
        //     d.push({name, location:pkg.location});
        //     }
        // })
        // console.log(d);
        
        // Save d to data.json
        // try {
        //     const dataDir = join(process.cwd(), "data");
        //     await mkdir(dataDir, { recursive: true });
        //     const filePath = join(dataDir, "data.json");
        //     await writeFile(filePath, JSON.stringify(d, null, 2), "utf-8");
        // } catch (writeErr) {
        //     console.error("Failed to write data to file:", writeErr);
        // }
        
        // Read countries.json to get region and countryName information
        // let countriesMap = {};
        // try {
        //     const countriesPath = join(process.cwd(), "data", "countries.json");
        //     const countriesContent = await readFile(countriesPath, "utf-8");
        //     const countries = JSON.parse(countriesContent);
        //     countries.forEach(country => {
        //         countriesMap[country.code] = {
        //             region: country.region,
        //             name: country.name
        //         };
        //     });
        // } catch (err) {
        //     console.error("Failed to read countries.json:", err);
        // }
        
        // Save favData to JSON files by country code
        // try {
        //     const dataDir = join(process.cwd(), "app/api/data");
        //     await mkdir(dataDir, { recursive: true });
            
        //     // Group favData by country code
        //     const countryData = favData.reduce((acc, pkg) => {
        //         const countryCode = pkg.slug.split("_")[0];
        //         if (!acc[countryCode]) {
        //             // Get region and countryName from countriesMap
        //             const countryInfo = countriesMap[countryCode] || {};
        //             acc[countryCode] = {
        //                 supportedRegeon: [pkg.location],
        //                 name: pkg.name,
        //                 code: countryCode,
        //                 region: countryInfo.region || "",
        //                 countryName: countryInfo.name || "",
        //                 prices: []
        //             };
        //             if(!countryInfo.region){
        //                 console.log(countryCode);
                        
        //             }
        //         }
        //         acc[countryCode].prices.push({
        //             slug: pkg.slug,
        //             price: pkg.price/10000*3450
        //         });
        //         return acc;
        //     }, {});
        //     const fileName = []
        //     // Save each country's data to a separate JSON file
        //     for (const [countryCode, countryInfo] of Object.entries(countryData)) {
        //         const filePath = join(dataDir, `${countryCode}.ts`);
        //         fileName.push(countryCode);
        //         await writeFile(filePath,"export default " + JSON.stringify(countryInfo, null, 2), "utf-8");
        //     }
        //     const filePath=join(process.cwd(), "app/api", "countryData.ts")
        //     let str = "";
        //     for(let i = 0; i < fileName.length; i++)
        // {
        //         str += `import ${fileName[i].replace("-", "_")} from "./data/${fileName[i]}"\n`
        //     }

        //     str += `export default [`
        //     for(let i = 0; i < fileName.length; i++)
        // {
        //         str += `${fileName[i].replace("-", "_")},\n`
        //     }
        //     str += `]`
        //     await writeFile(filePath, str, "utf-8");
            
        //     console.log(`Saved data for ${Object.keys(countryData).length} countries`);
        // } catch (writeErr) {
        //     console.error("Failed to write country data to files:", writeErr);
        // }

        return Response.json({ success: true, data: { packageList: favData } });
    } catch (err) {
        console.log(err);

        if (err instanceof EsimApiError) {
            return Response.json(
                {
                    success: false,
                    errorCode: err.errorCode,
                    message: err.message,
                },
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
