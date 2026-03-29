"use client";
import { useState, useEffect } from "react";
import CountryCard from "@/components/CountryCard";

const ALL_COUNTRIES = [
  { code: "JP", name: "Япон", flag: "🇯🇵", fromPrice: 9900 },
  { code: "KR", name: "Солонгос", flag: "🇰🇷", fromPrice: 8900 },
  { code: "TH", name: "Тайланд", flag: "🇹🇭", fromPrice: 7500 },
  { code: "SG", name: "Сингапур", flag: "🇸🇬", fromPrice: 10900 },
  { code: "US", name: "АНУ", flag: "🇺🇸", fromPrice: 14900 },
  { code: "CN", name: "Хятад", flag: "🇨🇳", fromPrice: 8900 },
  { code: "TR", name: "Турк", flag: "🇹🇷", fromPrice: 6900 },
  { code: "DE", name: "Герман", flag: "🇩🇪", fromPrice: 12900 },
  { code: "GB", name: "Их Британи", flag: "🇬🇧", fromPrice: 13900 },
  { code: "AU", name: "Австрали", flag: "🇦🇺", fromPrice: 11900 },
  { code: "MY", name: "Малайз", flag: "🇲🇾", fromPrice: 6500 },
  { code: "VN", name: "Вьетнам", flag: "🇻🇳", fromPrice: 6900 },
  { code: "FR", name: "Франц", flag: "🇫🇷", fromPrice: 12900 },
  { code: "IT", name: "Итали", flag: "🇮🇹", fromPrice: 12900 },
  { code: "ES", name: "Испани", flag: "🇪🇸", fromPrice: 11900 },
  { code: "ID", name: "Индонез", flag: "🇮🇩", fromPrice: 7900 },
  { code: "IN", name: "Энэтхэг", flag: "🇮🇳", fromPrice: 8500 },
  { code: "PH", name: "Филиппин", flag: "🇵🇭", fromPrice: 7500 },
  { code: "HK", name: "Хонг Конг", flag: "🇭🇰", fromPrice: 9500 },
  { code: "TW", name: "Тайвань", flag: "🇹🇼", fromPrice: 8900 },
  { code: "MO", name: "Макао", flag: "🇲🇴", fromPrice: 9900 },
  { code: "SA", name: "Саудын Араб", flag: "🇸🇦", fromPrice: 11900 },
  { code: "AE", name: "АНЭУ", flag: "🇦🇪", fromPrice: 12900 },
  { code: "PT", name: "Португал", flag: "🇵🇹", fromPrice: 11900 },
];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(ALL_COUNTRIES);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    setFiltered(
      q
        ? ALL_COUNTRIES.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.code.toLowerCase().includes(q)
          )
        : ALL_COUNTRIES
    );
  }, [search]);

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "14px",
            }}
          >
            eSIM <span className="gradient-text">дэлгүүр</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 17 }}>
            Очих улсаа хайж, өөрт тохирох багцаа сонгоно уу.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 480, marginBottom: "48px" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
              color: "var(--text-muted)",
            }}
          >
            🔍
          </span>
          <input
            id="country-search"
            type="text"
            placeholder="Улсаа хайх... (жишээ: Япон, JP)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: "48px" }}
          />
        </div>

        {/* Results count */}
        {search && (
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "24px" }}>
            {filtered.length} үр дүн олдлоо
          </p>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {filtered.map((c) => (
              <CountryCard key={c.code} {...c} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: "16px" }}>🌐</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: "8px" }}>
              Улс олдсонгүй
            </p>
            <p style={{ fontSize: 14 }}>Өөр нэрээр хайж үзнэ үү</p>
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
