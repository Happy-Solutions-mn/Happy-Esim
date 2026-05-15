  import { NextRequest } from "next/server";
import { createInvoice, QPayError } from "@/lib/qpay-client";
import { jsonData } from "../../countryData";
import { listPackages } from "@/lib/esim-client";

export async function POST(request: NextRequest) {
    
    
    try {
        const body = await request.json();
        const { orderId, slug } = body;
        console.log(orderId, slug);
        
        if (!orderId || !slug) {
            return Response.json(
                { success: false, message: "orderId and slug are required" },
                { status: 400 }
            );
        }
        const counrty = slug.split("_")[0];
        const data = jsonData[counrty].prices.find((x) => x.slug === slug);

        if (!data) {
            throw new QPayError(400, "invalid_slug");
        }
        const remoteData = await listPackages({ slug: slug });
        if (!remoteData) {
            throw new QPayError(400, "invalid_slug esim");
        }

        const invoice = await createInvoice({
            orderId,
            amount: data.price,
            description: remoteData.packageList[0].description,
        });

        return Response.json({ success: true, invoice });
    } catch (err) {
        console.log(err);

        if (err instanceof QPayError) {
            return Response.json(
                { success: false, code: err.code, message: err.message },
                { status: 400 }
            );
        }
        console.error("[/api/payment/qpay] Error:", err);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
