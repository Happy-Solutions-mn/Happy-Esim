// qpay.ts

import { ExecuteQuery } from "@/app/api/utils/Database";

const QPAY_API_URL = process.env.QPAY_API_URL || "https://merchant.qpay.mn/v2";
const QPAY_USERNAME = process.env.QPAY_USERNAME || "";
const QPAY_PASSWORD = process.env.QPAY_PASSWORD || "";
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export class QPayError extends Error {
    constructor(public code: number, message: string) {
        super(message);
        this.name = "QPayError";
    }
}

async function getToken(): Promise<string> {
    const r = await ExecuteQuery("select * from qpay_tokens order by id asc");
    console.log(r);
    
    if (r.length === 0 || r[0].token === null || r[0].expires_at <  Date.now()/1000) {
        if (!QPAY_USERNAME || !QPAY_PASSWORD) {
            throw new QPayError(500, "QPay credentials not configured");
        }

        const credentials = Buffer.from(
            `${QPAY_USERNAME}:${QPAY_PASSWORD}`
        ).toString("base64");

        console.log(credentials);

        const res = await fetch(`${QPAY_API_URL}/auth/token`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json",
            },
            body: undefined,
        });
        console.log(res);

        if (!res.ok) {
            const errorText = await res.text();
            throw new QPayError(
                res.status,
                `QPay authentication failed: ${res.statusText} - ${errorText}`
            );
        }

        const data = await res.json();

        // 验证返回数据
        if (!data.access_token) {
            throw new QPayError(500, "QPay did not return access_token");
        }
        console.log(data);
        console.log("now", Date.now())
        
        const d = {
            access_token: data.access_token,
            expires_in: data.expires_in,
            refresh_token: data.refresh_token,
            refresh_expires_at: data.refresh_expires_in,
            updated_at:Date.now()/1000
        }
        await ExecuteQuery("insert into qpay_tokens(access_token, expires_in, refresh_token, refresh_expires_at, updated_at) values(?,?,?,?,?)", [d.access_token, d.expires_in, d.refresh_token, d.refresh_expires_at, d.updated_at])
        return d.access_token;
    }else{
        const cachedToken = (await ExecuteQuery("select * from qpay_tokens order by id asc"))[0]
        

    }

}

/**
 * Refresh token (optional, using refresh_token)
 */
export async function refreshToken(refreshToken: string): Promise<string> {
    const res = await fetch(`${QPAY_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new QPayError(res.status, "Token refresh failed");
    }

    const data = await res.json();
    const cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in || 3600) * 1000 - 60000,
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
    phone?: string;
    email?: string;
}): Promise<QPayInvoice> {
    if (!QPAY_INVOICE_CODE) {
        throw new QPayError(500, "QPay invoice_code not configured");
    }

    const token = await getToken();
    console.log(token);

    const requestBody: any = {
        invoice_code: QPAY_INVOICE_CODE,
        sender_invoice_no: params.orderId, // 你的订单号
        invoice_receiver_code: "terminal", // 固定为 terminal
        invoice_description: params.description.substring(0, 100), // 限制长度
        amount: params.amount,
        callback_url: `${APP_URL}/api/payment/qpay/callback?orderId=${params.orderId}`,
    };

    // 可选：添加客户信息（根据你 Postman 中的示例）
    if (params.phone || params.email) {
        requestBody.invoice_receiver_data = {
            register: "", // 如果有注册号可以填
            name: "",
            email: params.email || "",
            phone: params.phone || "",
        };
    }

    const res = await fetch(`${QPAY_API_URL}/invoice`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("QPay create invoice error:", errorText);
        throw new QPayError(
            res.status,
            `QPay invoice creation failed: ${errorText}`
        );
    }

    const data = await res.json();

    // 验证返回的必要字段
    if (!data.invoice_id) {
        throw new QPayError(500, "QPay did not return invoice_id");
    }

    return data;
}

export interface PaymentCheckResult {
    count: number;
    paid_amount: number;
    rows: Array<{
        payment_id: string;
        payment_status: string; // PAID, UNPAID, CANCELLED, REFUNDED
        payment_date: string;
        payment_amount: number;
        payment_note?: string;
    }>;
}

/**
 * Check QPay payment status
 */
export async function checkPayment(
    invoiceId: string
): Promise<PaymentCheckResult> {
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
        const errorText = await res.text();
        console.error("QPay check payment error:", errorText);
        throw new QPayError(
            res.status,
            `QPay payment check failed: ${errorText}`
        );
    }

    return res.json();
}

/**
 * Get single payment details
 */
export async function getPayment(paymentId: string): Promise<{
    payment_id: string;
    payment_status: string;
    payment_amount: number;
    payment_date: string;
    // ... other fields
}> {
    const token = await getToken();

    const res = await fetch(`${QPAY_API_URL}/payment/${paymentId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new QPayError(
            res.status,
            `Failed to get payment: ${res.statusText}`
        );
    }

    return res.json();
}

/**
 * Cancel unpaid invoice
 */
export async function cancelInvoice(invoiceId: string): Promise<void> {
    const token = await getToken();

    const res = await fetch(`${QPAY_API_URL}/invoice/${invoiceId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new QPayError(
            res.status,
            `Failed to cancel invoice: ${res.statusText}`
        );
    }
}

/**
 * Refund paid payment (full or partial)
 */
export async function refundPayment(params: {
    paymentId: string;
    amount?: number;
    note?: string;
    callbackUrl?: string;
}): Promise<void> {
    const token = await getToken();

    const res = await fetch(
        `${QPAY_API_URL}/payment/refund/${params.paymentId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                callback_url:
                    params.callbackUrl ||
                    `${APP_URL}/api/payment/qpay/refund-callback`,
                note: params.note || "Refund",
                ...(params.amount ? { amount: params.amount } : {}),
            }),
        }
    );

    if (!res.ok) {
        throw new QPayError(
            res.status,
            `Failed to refund payment: ${res.statusText}`
        );
    }
}
