
import  crypto from "crypto";


const BASE_URL = process.env.ESIMACCESS_API_URL || "https://api.esimaccess.com";
const ACCESS_CODE = process.env.ESIMACCESS_ACCESS_CODE || "";
const SECRET_KEY = process.env.ESIMACCESS_SECRET_KEY || "";

function generateHeaders() {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).substring(2, 10);
  const signature = crypto
    .createHmac("md5", SECRET_KEY)
    .update(ACCESS_CODE + timestamp + nonce)
    .digest("hex");

  return {
    "Content-Type": "application/json",
    "RT-AccessCode": ACCESS_CODE,
    "RT-Timestamp": timestamp,
    "RT-Nonce": nonce,
    "RT-Signature": signature,
  };
}

export class EsimApiError extends Error {
  constructor(
    public errorCode: string,
    message: string
  ) {
    super(message);
    this.name = "EsimApiError";
  }
}

async function esimFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers = generateHeaders();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new EsimApiError(
      res.status.toString(),
      `eSIM API HTTP error: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

  if (!data.success) {
    throw new EsimApiError(
      data.errorCode || "UNKNOWN",
      data.errorMessage || "Unknown eSIM API error"
    );
  }

  return data.obj as T;
}

export interface EsimPackage {
  // favorite: boolean;
  packageCode: string;
  slug: string;
  name: string;
  price: number;
  currencyCode: string;
  volume: number;
  duration: number;
  durationUnit: string;
  location: string;
  description: string;
  activeType: number;
  speed: string;
  retailPrice: number;
  smsStatus: number;
  dataType: number;
  locationNetworkList: Array<{
    locationName: string;
    locationLogo: string;
    operatorList: Array<{
      operatorName: string;
      networkType: string;
    }>;
  }>;
}

export interface EsimProfile {
  iccid: string;
  qrCodeUrl: string;
  activationCode: string;
  smdpStatus: string;
  esimStatus: string;
}

export interface OrderResult {
  orderNo: string;
}

export interface EsimQueryResult {
  esimList: EsimProfile[];
  packageCode: string;
  orderNo: string;
}

/**
 * List available data packages, optionally filtered by country code
 */
export async function listPackages(params?: {
  locationCode?: string;
  type?: "BASE" | "TOPUP";
  packageCode?: string;
  slug?: string;
  iccid?: string;
}): Promise<{ packageList: EsimPackage[] }> {
  return esimFetch("/api/v1/open/package/list", {
    method: "POST",
    body: JSON.stringify(params || {}),
  });
}

/**
 * Create an eSIM order
 */
export async function createOrder(params: {
  transactionId: string;
  packageInfoList: Array<{
    packageCode?: string;
    slug?: string;
    count: number;
    price?: number;
    periodNum?: number;
  }>;
  amount?: number;
}): Promise<OrderResult> {
  return esimFetch("/api/v1/open/esim/order", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/**
 * Query eSIM profiles for an order
 */
export async function queryEsim(params: {
  orderNo?: string;
  iccid?: string;
  pager?: { pageSize: number; pageNum: number };
}): Promise<EsimQueryResult> {
  return esimFetch("/api/v1/open/esim/query", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
