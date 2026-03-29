"use client";
import { useState } from "react";
import QRCodeModal from "@/components/QRCodeModal";

interface Order {
  id: string;
  orderNo: string;
  packageName: string;
  userEmail: string;
  amount: number;
  status: string;
  createdAt: { seconds: number };
  profiles?: Array<{
    iccid: string;
    qrCodeUrl: string;
    activationCode: string;
  }>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Хүлээгдэж байна", color: "#f59e0b" },
  paid: { label: "Төлөгдсөн", color: "#6366f1" },
  allocated: { label: "Бэлэн болсон", color: "#10b981" },
  expired: { label: "Хугацаа дууссан", color: "#6b7280" },
  paid_pending_esim: { label: "Бэлтгэгдэж байна", color: "#f59e0b" },
};

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [profiles, setProfiles] = useState<Order["profiles"]>([]);

  const fetchOrders = async () => {
    if (!email || !email.includes("@")) {
      setError("Зөв и-мэйл хаяг оруулна уу");
      return;
    }
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      // Firestore client-side query
      const { db } = await import("@/lib/firebase");
      const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore");

      const q = query(
        collection(db, "orders"),
        where("userEmail", "==", email),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      setOrders(docs);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setError("Захиалга татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const openQR = async (order: Order) => {
    setModalOrder(order);
    setProfiles([]);

    if (!order.orderNo) return;

    setModalLoading(true);
    try {
      const res = await fetch(`/api/esim/query?orderNo=${order.orderNo}`);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data?.esimList || []);
      }
    } catch {
      // Show modal without profiles
    } finally {
      setModalLoading(false);
    }
  };

  const profile = profiles?.[0];

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: "14px",
          }}
        >
          Захиалга шалгах
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: "40px" }}>
          eSIM захиалгаа болон QR кодоо энэ хэсгээс харна уу.
        </p>

        {/* Search */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          <input
            id="orders-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
            className="input"
            style={{ flex: 1, minWidth: 240 }}
          />
          <button
            onClick={fetchOrders}
            className="btn-primary"
            disabled={loading}
            style={{ whiteSpace: "nowrap" }}
          >
            {loading ? "Хайж байна..." : "Хайх →"}
          </button>
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: 14, marginBottom: "16px" }}>⚠️ {error}</p>
        )}

        {/* Orders list */}
        {searched && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: "8px" }}>
              Захиалга олдсонгүй
            </p>
            <p style={{ fontSize: 14 }}>Энэ и-мэйл хаягаар захиалга олдсонгүй</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const st = STATUS_LABELS[order.status] || { label: order.status, color: "#6b7280" };
            const date = order.createdAt
              ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("mn-MN")
              : "-";

            return (
              <div
                key={order.id}
                className="card"
                style={{ padding: "24px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: "4px" }}>
                      {order.packageName || "eSIM Багц"}
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      {date} · {order.orderNo || order.id}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "4px 12px",
                      borderRadius: "50px",
                      background: `${st.color}20`,
                      color: st.color,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {st.label}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <p style={{ fontWeight: 800, fontSize: 20, color: "var(--accent-hover)" }}>
                    ₮{(order.amount || 0).toLocaleString()}
                  </p>
                  {(order.status === "allocated" || order.status === "paid") && (
                    <button
                      onClick={() => openQR(order)}
                      className="btn-primary"
                      style={{ padding: "10px 20px", fontSize: 14 }}
                    >
                      📱 QR код харах
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* QR Modal */}
      <QRCodeModal
        isOpen={!!modalOrder}
        onClose={() => {
          setModalOrder(null);
          setProfiles([]);
        }}
        qrCodeUrl={modalLoading ? undefined : profile?.qrCodeUrl}
        activationCode={profile?.activationCode}
        iccid={profile?.iccid}
        packageName={modalOrder?.packageName}
      />
    </div>
  );
}
