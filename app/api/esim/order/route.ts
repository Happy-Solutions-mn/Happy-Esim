import { NextRequest } from "next/server";
import { createOrder, EsimApiError } from "@/lib/esim-client";
import { getAdminDb } from "@/lib/firebase-admin";
import { v4 as uuidv4 } from "uuid";
export const runtime = 'edge';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageCode, slug, count = 1, price, amount, userEmail } = body;

    if (!packageCode && !slug) {
      return Response.json(
        { success: false, message: "packageCode or slug is required" },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return Response.json(
        { success: false, message: "userEmail is required" },
        { status: 400 }
      );
    }

    const transactionId = uuidv4();

    const packageInfoList = [
      {
        ...(packageCode ? { packageCode } : {}),
        ...(slug ? { slug } : {}),
        count,
        ...(price ? { price } : {}),
      },
    ];

    const result = await createOrder({
      transactionId,
      packageInfoList,
      ...(amount ? { amount } : {}),
    });

    // Save order to Firestore
    const adminDb = getAdminDb();
    await adminDb.collection("orders").add({
      orderNo: result.orderNo,
      transactionId,
      packageCode: packageCode || null,
      slug: slug || null,
      packageName: body.packageName || "",
      userEmail,
      amount: amount || 0,
      count,
      status: "paid",
      qpayInvoiceId: body.qpayInvoiceId || null,
      createdAt: new Date(),
    });

    return Response.json({ success: true, orderNo: result.orderNo, transactionId });
  } catch (err) {
    if (err instanceof EsimApiError) {
      return Response.json(
        { success: false, errorCode: err.errorCode, message: err.message },
        { status: 400 }
      );
    }
    console.error("[/api/esim/order] Error:", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
