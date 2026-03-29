"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "64px 0 32px",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: 24 }}>📡</span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                HappySim
              </span>
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 240,
              }}
            >
              Дэлхийн хаана ч байсан тасралтгүй интернэтийн холболт.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Үйлчилгээ
            </h4>
            {[
              { href: "/shop", label: "eSIM дэлгүүр" },
              { href: "/how-to-use", label: "Хэрхэн ашиглах" },
              { href: "/orders", label: "Захиалга шалгах" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: "block",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: 14,
                  marginBottom: "10px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Дэмжлэг
            </h4>
            {[
              { href: "mailto:support@happysim.mn", label: "support@happysim.mn" },
              { href: "/how-to-use", label: "Тусламж" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  display: "block",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: 14,
                  marginBottom: "10px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            © {new Date().getFullYear()} HappySim. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Powered by Happy-Esim
          </p>
        </div>
      </div>
    </footer>
  );
}
