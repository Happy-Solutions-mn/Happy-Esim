import { NextRequest } from "next/server";
import { createInvoice, QPayError } from "@/lib/qpay-client";
export const runtime = 'edge';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, description } = body;

    if (!orderId || !amount) {
      return Response.json(
        { success: false, message: "orderId and amount are required" },
        { status: 400 }
      );
    }

    const invoice = await createInvoice({ orderId, amount, description });

    return Response.json({ success: true, invoice });
  } catch (err) {
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
