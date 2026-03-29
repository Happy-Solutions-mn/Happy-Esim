const QPAY_API_URL = process.env.QPAY_API_URL || "https://merchant.qpay.mn/v2";
const QPAY_USERNAME = process.env.QPAY_USERNAME || "";
const QPAY_PASSWORD = process.env.QPAY_PASSWORD || "";
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

let cachedToken: { token: string; expiresAt: number } | null = null;

export class QPayError extends Error {
  constructor(
    public code: number,
    message: string
  ) {
    super(message);
    this.name = "QPayError";
  }
}

/**
 * Authenticate with QPay and get access token
 */
async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(`${QPAY_USERNAME}:${QPAY_PASSWORD}`).toString(
    "base64"
  );

  const res = await fetch(`${QPAY_API_URL}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new QPayError(res.status, `QPay auth failed: ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000 - 60000, // 1 min buffer
  };

  return cachedToken.token;
}

export interface QPayInvoice {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  qPay_deeplink: Array<{
    name: string;
    description: string;
    logo: string;
    link: string;
  }>;
  urls: Array<{
    name: string;
    description: string;
    logo: string;
    link: string;
  }>;
}

/**
 * Create a QPay invoice for payment
 */
export async function createInvoice(params: {
  orderId: string;
  amount: number;
  description: string;
}): Promise<QPayInvoice> {
  const token = await getToken();

  const res = await fetch(`${QPAY_API_URL}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoice_code: QPAY_INVOICE_CODE,
      sender_invoice_no: params.orderId,
      invoice_receiver_code: "terminal",
      invoice_description: params.description,
      amount: params.amount,
      callback_url: `${APP_URL}/api/payment/qpay/callback?orderId=${params.orderId}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new QPayError(res.status, `QPay invoice creation failed: ${err}`);
  }

  return res.json();
}

/**
 * Check QPay payment status
 */
export async function checkPayment(invoiceId: string): Promise<{
  count: number;
  paid_amount: number;
  rows: Array<{
    payment_id: string;
    payment_status: string;
    payment_date: string;
    payment_amount: number;
  }>;
}> {
  const token = await getToken();

  const res = await fetch(`${QPAY_API_URL}/payment/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    }),
  });

  if (!res.ok) {
    throw new QPayError(res.status, `QPay payment check failed: ${res.statusText}`);
  }

  return res.json();
}
