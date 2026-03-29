"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PackageCard from "@/components/PackageCard";
import type { EsimPackage } from "@/lib/esim-client";

const COUNTRY_META: Record<string, { name: string; flag: string }> = {
  jp: { name: "Япон", flag: "🇯🇵" },
  kr: { name: "Солонгос", flag: "🇰🇷" },
  th: { name: "Тайланд", flag: "🇹🇭" },
  sg: { name: "Сингапур", flag: "🇸🇬" },
  us: { name: "АНУ", flag: "🇺🇸" },
  cn: { name: "Хятад", flag: "🇨🇳" },
  tr: { name: "Турк", flag: "🇹🇷" },
  de: { name: "Герман", flag: "🇩🇪" },
  gb: { name: "Их Британи", flag: "🇬🇧" },
  au: { name: "Австрали", flag: "🇦🇺" },
  my: { name: "Малайз", flag: "🇲🇾" },
  vn: { name: "Вьетнам", flag: "🇻🇳" },
  fr: { name: "Франц", flag: "🇫🇷" },
  it: { name: "Итали", flag: "🇮🇹" },
  es: { name: "Испани", flag: "🇪🇸" },
  id: { name: "Индонез", flag: "🇮🇩" },
  in: { name: "Энэтхэг", flag: "🇮🇳" },
  ph: { name: "Филиппин", flag: "🇵🇭" },
  hk: { name: "Хонг Конг", flag: "🇭🇰" },
  tw: { name: "Тайвань", flag: "🇹🇼" },
  sa: { name: "Саудын Араб", flag: "🇸🇦" },
  ae: { name: "АНЭУ", flag: "🇦🇪" },
};

interface PageProps {
  params: Promise<{ country: string }>;
}

export default function CountryPackagesPage({ params }: PageProps) {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [packages, setPackages] = useState<EsimPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EsimPackage | null>(null);

  useEffect(() => {
    params.then(({ country: c }) => {
      setCountry(c.toLowerCase());
    });
  }, [params]);

  useEffect(() => {
    if (!country) return;
    setLoading(true);
    setError("");
    fetch(`/api/esim/packages?locationCode=${country.toUpperCase()}&type=BASE`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPackages(data.data?.packageList || []);
        } else {
          setError(data.message || "Алдаа гарлаа");
        }
      })
      .catch(() => setError("Сервертэй холбогдоход алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, [country]);

  const meta = COUNTRY_META[country] || { name: country.toUpperCase(), flag: "🌐" };

  const handleCheckout = () => {
    if (!selected) return;
    const params = new URLSearchParams({
      packageCode: selected.packageCode,
      slug: selected.slug || "",
      name: selected.name,
      price: selected.price.toString(),
      currency: selected.currencyCode,
      volume: selected.volume.toString(),
      duration: selected.duration.toString(),
      durationUnit: selected.durationUnit,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div className="container">
        {/* Back + header */}
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

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div style={{ fontSize: 56 }}>{meta.flag}</div>
          <div>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              {meta.name}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              {loading ? "Ачаалж байна..." : `${packages.length} багц боломжтой`}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12,
              padding: "20px",
              color: "#f87171",
              marginBottom: "32px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 16,
                  height: 180,
                  animation: "glow-pulse 1.5s ease infinite",
                  border: "1px solid var(--border)",
                }}
              />
            ))}
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.packageCode}
                  {...pkg}
                  selected={selected?.packageCode === pkg.packageCode}
                  onSelect={() =>
                    setSelected(
                      selected?.packageCode === pkg.packageCode ? null : pkg
                    )
                  }
                />
              ))}
            </div>

            {packages.length === 0 && !error && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <p>Энэ улсад багц байхгүй байна</p>
              </div>
            )}
          </>
        )}

        {/* Sticky checkout bar */}
        {selected && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              background: "rgba(17,24,39,0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid var(--border)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ fontWeight: 700, color: "var(--text)" }}>{selected.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                {(selected.volume / 1073741824).toFixed(0)} GB ·{" "}
                {selected.duration} {selected.durationUnit}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-hover)" }}>
                ₮{Math.round((selected.price / 10000) * 3450).toLocaleString()}
              </p>
              <button onClick={handleCheckout} className="btn-primary" style={{ fontSize: 15 }}>
                Худалдан авах →
              </button>
            </div>
          </div>
        )}
        <div style={{ height: selected ? 100 : 80 }} />
      </div>
    </div>
  );
}
