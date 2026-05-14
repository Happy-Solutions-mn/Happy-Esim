// import Link from "next/link";
import Link from "@/components/Link"
import HowToUseSteps from "@/components/HowToUseSteps";
import CountryCard from "@/components/CountryCard";

const POPULAR_COUNTRIES = [
  {supportedRegeon:[""], code: "JP", name: "Япон", flag: "🇯🇵", fromPrice: 9900 },
  {supportedRegeon:[""], code: "KR", name: "Солонгос", flag: "🇰🇷", fromPrice: 8900 },
  {supportedRegeon:[""], code: "TH", name: "Тайланд", flag: "🇹🇭", fromPrice: 7500 },
  {supportedRegeon:[""], code: "SG", name: "Сингапур", flag: "🇸🇬", fromPrice: 10900 },
  {supportedRegeon:[""], code: "US", name: "АНУ", flag: "🇺🇸", fromPrice: 14900 },
  {supportedRegeon:[""], code: "CN", name: "Хятад", flag: "🇨🇳", fromPrice: 8900 },
  {supportedRegeon:[""], code: "TR", name: "Турк", flag: "🇹🇷", fromPrice: 6900 },
  {supportedRegeon:[""], code: "DE", name: "Герман", flag: "🇩🇪", fromPrice: 12900 },
  {supportedRegeon:[""], code: "GB", name: "Их Британи", flag: "🇬🇧", fromPrice: 13900 },
  {supportedRegeon:[""], code: "AU", name: "Австрали", flag: "🇦🇺", fromPrice: 11900 },
  {supportedRegeon:[""], code: "MY", name: "Малайз", flag: "🇲🇾", fromPrice: 6500 },
  {supportedRegeon:[""], code: "VN", name: "Вьетнам", flag: "🇻🇳", fromPrice: 6900 },
];

const FEATURES = [
  { icon: "⚡", title: "Шуурхай хүргэлт", desc: "Төлбөр хийхэд QR код шууд хүлээн авна" },
  { icon: "🌍", title: "100+ улс орон", desc: "Дэлхийн 100 гаруй улс, бүс нутагт хамрагдана" },
  { icon: "💰", title: "Хямд үнэтэй", desc: "Роаминг төлбөргүй, урьдчилан мэдэх үнэ" },
  { icon: "🔒", title: "Аюулгүй", desc: "Шифрлэгдсэн холболт, аюулгүй төлбөр" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "80px",
        }}
      >
        {/* Background gradient blobs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            animation: "glow-pulse 4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            animation: "glow-pulse 5s ease-in-out infinite 1s",
          }}
        />

        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Pill badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px 6px 8px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "50px",
              marginBottom: "32px",
              fontSize: 13,
              color: "var(--accent-hover)",
            }}
          >
            <span
              style={{
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "50px",
                padding: "2px 10px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              ШИНЭ
            </span>
            100+ улс орны eSIM bagts боломжтой
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: "24px",
            }}
          >
            Дэлхийн хаана ч{" "}
            <span className="gradient-text">холболттой</span>
            {" "}бай
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              color: "var(--text-muted)",
              maxWidth: 540,
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            eSIM технологиор дэлхийн 100 гаруй улс орны интернэтийг
            шуурхай, хямдаар аваарай. Роаминг төлбөргүй!
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/shop" className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
              Одоо авах →
            </Link>
            <Link href="/how-to-use" className="btn-outline" style={{ fontSize: 16, padding: "16px 36px" }}>
              Хэрхэн ажилладаг?
            </Link>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              justifyContent: "center",
              marginTop: "56px",
              flexWrap: "wrap",
            }}
          >
            {["✓ Шуурхай идэвхжүүлэлт", "✓ QPay дэмжинэ", "✓ 24/7 дэмжлэг"].map((t) => (
              <span key={t} style={{ color: "var(--text-muted)", fontSize: 14 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <p style={{ color: "var(--accent-hover)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", marginBottom: "12px", textTransform: "uppercase" }}>
              БАЙРШИЛ
            </p>
            <h2 className="section-title">Хамгийн их сонгогддог улсууд</h2>
            <p className="section-subtitle">
              Хамгийн алдартай аялалын байршлуудад тохирсон eSIM багцуудыг олоорой.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {POPULAR_COUNTRIES.map((c) => (
              <CountryCard key={c.code} {...c} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/shop" className="btn-outline">
              Бүх улсыг харах →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <p style={{ color: "var(--accent-hover)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", marginBottom: "12px", textTransform: "uppercase" }}>
              ХЭРХЭН АЖИЛЛАДАГ
            </p>
            <h2 className="section-title">3 хялбар алхмаар</h2>
            <p className="section-subtitle">
              Физик SIM карт солихгүйгээр хэдхэн минутад eSIM ашиглаж эхлэнэ.
            </p>
          </div>
          <HowToUseSteps />
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <h2 className="section-title">Яагаад HappySim?</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "rgba(99,102,241,0.1)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: "6px" }}>{f.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section">
        <div className="container">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(167,139,250,0.1) 100%)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 28,
              padding: "64px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -60,
                left: "50%",
                transform: "translateX(-50%)",
                width: 300,
                height: 300,
                background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(40px)",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                }}
              >
                Аяллаа дараагийн шатанд гарга
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 17,
                  marginBottom: "32px",
                  maxWidth: 500,
                  margin: "0 auto 32px",
                }}
              >
                Одоо eSIM авч, дэлхийн нэг ч цэгт интернэтгүй байхаа болио.
              </p>
              <Link href="/shop" className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
                Эхлэх →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
