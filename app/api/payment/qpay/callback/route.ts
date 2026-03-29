import { NextRequest } from "next/server";
import { checkPayment } from "@/lib/qpay-client";
import { adminDb } from "@/lib/firebase-admin";
import { createOrder, EsimApiError } from "@/lib/esim-client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return Response.json({ success: false, message: "orderId is required" }, { status: 400 });
  }

  try {
    // Find pending order in Firestore
    const snapshot = await adminDb
      .collection("pending_orders")
      .where("orderId", "==", orderId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return Response.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const pendingDoc = snapshot.docs[0];
    const pendingOrder = pendingDoc.data();

    // Check payment with QPay
    const payment = await checkPayment(pendingOrder.invoiceId);

    if (!payment.count || payment.count === 0) {
      return Response.json({ success: false, message: "Payment not completed" }, { status: 402 });
    }

    // Payment confirmed — create eSIM order
    const transactionId = uuidv4();
    let esimOrderNo: string | null = null;

    try {
      const esimResult = await createOrder({
        transactionId,
        packageInfoList: [
          {
            packageCode: pendingOrder.packageCode,
            count: pendingOrder.count || 1,
            price: pendingOrder.price,
          },
        ],
        amount: pendingOrder.esimAmount,
      });
      esimOrderNo = esimResult.orderNo;
    } catch (esimErr) {
      console.error("[callback] eSIM order creation failed:", esimErr);
    }

    // Save confirmed order to Firestore
    await adminDb.collection("orders").add({
      orderNo: esimOrderNo,
      transactionId,
      packageCode: pendingOrder.packageCode,
      packageName: pendingOrder.packageName,
      userEmail: pendingOrder.userEmail,
      amount: pendingOrder.amount,
      count: pendingOrder.count,
      status: esimOrderNo ? "allocated" : "paid_pending_esim",
      qpayInvoiceId: pendingOrder.invoiceId,
      createdAt: new Date(),
    });

    // Delete pending order
    await pendingDoc.ref.delete();

    return Response.json({ success: true, orderNo: esimOrderNo });
  } catch (err) {
    console.error("[/api/payment/qpay/callback] Error:", err);
    return Response.json({ success: false, message: "Callback processing error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // QPay may also send GET callbacks
  return POST(request);
}
