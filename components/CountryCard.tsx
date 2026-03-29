import Link from "next/link";

interface CountryCardProps {
  code: string;
  name: string;
  flag: string;
  fromPrice: number;
  packageCount?: number;
}

export default function CountryCard({
  code,
  name,
  flag,
  fromPrice,
  packageCount,
}: CountryCardProps) {
  return (
    <Link
      href={`/shop/${code.toLowerCase()}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="card"
        style={{
          padding: "24px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: 44, lineHeight: 1 }}>{flag}</div>
        <div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "4px",
            }}
          >
            {name}
          </h3>
          {packageCount !== undefined && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: "8px" }}>
              {packageCount} багц
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Эхлэх үнэ</span>
            <p
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--accent-hover)",
                lineHeight: 1.2,
              }}
            >
              ₮{fromPrice.toLocaleString()}
            </p>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              background: "rgba(99,102,241,0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "var(--accent)",
            }}
          >
            →
          </div>
        </div>
      </div>
    </Link>
  );
}
