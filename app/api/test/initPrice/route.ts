//@ts-nocheck

import { NextRequest } from "next/server";
import { listPackages, EsimApiError } from "@/lib/esim-client";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import PriceConverter from "../../utils/PriceConverter";

export async function GET(request: NextRequest) {
    const locationCode = undefined;
    const type = "BASE";
    const packageCode = undefined;
    const slug = undefined;

    const data = await listPackages({
        locationCode,
        type,
        packageCode,
        slug,
    });

    const favData = data.packageList
        .sort((a, b) => a.price - b.price)
        .filter((x) => {
            return x.slug.split("_").length == 3;
        });
    console.log(favData[0]);

    const codeList: string[] = [];
    const d = [];
    favData.forEach((pkg) => {
        const name = pkg.slug.split("_")[0];
        if (codeList.indexOf(name) == -1) {
            codeList.push(name);
            d.push({ name, location: pkg.location });
        }
    });

    let countriesMap = {};
    try {
        const countriesPath = join(process.cwd(), "data", "countries.json");

        const countriesContent = await readFile(countriesPath, "utf-8");

        const countries = JSON.parse(countriesContent);
        countries.forEach((country) => {
            countriesMap[country.code] = {
                region: country.region,
                name: country.name,
            };
        });
    } catch (err) {
        console.error("Failed to read countries.json:", err);
    }

    try {
        const dataDir = join(process.cwd(), "app/api/data");
        await mkdir(dataDir, { recursive: true });
        const countryData = favData.reduce((acc, pkg) => {
            const countryCode = pkg.slug.split("_")[0];
            if (!acc[countryCode]) {
                if (!countriesMap[countryCode]) {
                    console.log(
                        countryCode,
                        "not found in dataset, ",
                        pkg.name
                    );
                }
                const countryInfo = countriesMap[countryCode] || {};
                acc[countryCode] = {
                    supportedRegeon: [pkg.location.replace("AN,", "")],
                    code: countryCode,
                    region: countryInfo.region || "",
                    speed: pkg.speed,
                    name: countryInfo.name || "",
                    prices: [],
                };
            }
            const res = pkg.slug.split("_");

            acc[countryCode].prices.push({
                volume: pkg.volume,
                slug: pkg.slug,
                price: pkg.price,
                data: parseFloat(res[1]),
                time: res[2] == "Daily" ? 1 : parseFloat(res[2]),
            });
            return acc;
        }, {});
        for (const [countryCode, countryInfo] of Object.entries(countryData)) {
            countryData[countryCode].prices = PriceConverter(
                countryData[countryCode].prices
            );
        }
        // console.log(countryData);
        const fileName = join(dataDir, "data.json");
        await writeFile(
            fileName,
            JSON.stringify(countryData, null, 2),
            "utf-8"
        );
    } catch (writeErr) {
        console.error("Failed to write country data to files:", writeErr);
    }

    return Response.json({ success: true, data: { packageList: favData } });
}
