"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";


interface QPayInvoice {
  invoice_id: string;
  qr_image: string;
  qr_text: string;
  urls?: Array<{ name: string; link: string; logo: string }>;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id") || "";

  const [data, setData] = useState();


  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "payment" | "done">("form");
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    fetch("/api/esim/current?id="+id).then((res) => {
      res.json().then((d) => {
        if(d.error){
          setError("no data found")
        }else{
          setData(d)
          console.log(d);
          
        }
      })
    })
  }, [])

  const handleCreateInvoice = async () => {
    if(loading){
      return
    }
    if (!email || !email.includes("@")) {
      setError("Зөв и-мэйл хаяг оруулна уу");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const oid = `HS-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      setOrderId(oid);

      const invoiceRes = await fetch("/api/payment/qpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: oid,
          slug:id,
        }),
      });

      const invoiceData = await invoiceRes.json();
      if (!invoiceData.success) throw new Error(invoiceData.message);

      setInvoice(invoiceData.invoice);
      setStep("payment");
      startPolling(oid, invoiceData.invoice.invoice_id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Алдаа гарлаа";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (oid: string, invoiceId: string) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        setPolling(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/payment/qpay/callback?orderId=${oid}&invoiceId=${invoiceId}`,
          { method: "POST" }
        );
        const data = await res.json();
        if (data.success) {
          clearInterval(interval);
          setPolling(false);
          setStep("done");
        }
      } catch {
        // Continue polling
      }
    }, 5000);
  };

  if (!data && error) {
    return (
      <div style={{ paddingTop: "120px", textAlign: "center", color: "var(--text-muted)" }}>
        <p>Багц олдсонгүй. Дэлгүүр рүү буцна уу.</p>
        <button className="btn-primary" onClick={() => router.push("/shop")} style={{ marginTop: 24 }}>
          Дэлгүүр →
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            padding: 0,
          }}
        >
          ← Буцах
        </button>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: "32px",
          }}
        >
          {step === "form" && "Захиалга бүрдүүлэх"}
          {step === "payment" && "QPay-р төлөх"}
          {step === "done" && "✅ Амжилттай!"}
        </h1>

        {/* Order summary card */}
        <div
          className="card"
          style={{ padding: "24px", marginBottom: "24px" }}
        >
          <h3 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Захиалгын дэлгэрэнгүй
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Багц</span>
            <span style={{ fontWeight: 600, fontSize: 14, maxWidth: "60%", textAlign: "right" }}>{data&&data.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Дата</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              {data&&(data.volume / 1073741824).toFixed(0)} GB
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Хугацаа</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{data&&data.time}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <span style={{ fontWeight: 700 }}>Нийт дүн</span>
            <span style={{ fontWeight: 900, fontSize: 22, color: "var(--accent-hover)" }}>
              ₮{data&&data.price}
            </span>
          </div>
        </div>

        {/* Step: Form */}
        {step === "form" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: "8px",
                }}
              >
                И-мэйл хаяг
              </label>
              <input
                id="checkout-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: "6px" }}>
                eSIM мэдээллийг энд илгээнэ
              </p>
            </div>

            {error && (
              <p style={{ color: "#f87171", fontSize: 14, marginBottom: "16px" }}>⚠️ {error}</p>
            )}

            <button
              onClick={handleCreateInvoice}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}
              disabled={loading}
            >
              {loading ? "Үүсгэж байна..." : "QPay төлбөр үүсгэх →"}
            </button>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && invoice && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: 15 }}>
              QPay апп-аар доорх QR кодыг уншуулж төлнө үү.
            </p>

            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "20px",
                display: "inline-block",
                marginBottom: "24px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${invoice.qr_image}`}
                alt="QPay QR Code"
                style={{ width: 220, height: 220 }}
              />
            </div>

            {polling && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  color: "var(--text-muted)",
                  fontSize: 14,
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid var(--accent)",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Төлбөр хүлээж байна...
              </div>
            )}

            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Захиалгын дугаар: <strong>{orderId}</strong>
            </p>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: "24px" }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: "12px" }}>
              Амжилттай худалдан авлаа!
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: 15 }}>
              Таны eSIM бэлтгэгдэж байна. Захиалгын хэсгээс QR кодоо харна уу.
            </p>
            <button
              className="btn-primary"
              onClick={() => router.push("/orders")}
              style={{ fontSize: 16, padding: "14px 32px" }}
            >
              Захиалга харах →
            </button>
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "120px", textAlign: "center" }}>Ачаалж байна...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
