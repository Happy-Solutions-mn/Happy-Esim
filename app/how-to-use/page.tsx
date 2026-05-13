// import Link from "next/link";
import Link from "@/components/Link"
const STEPS = [
  {
    num: "01",
    title: "Төхөөрөмж шалгах",
    icon: "📱",
    desc: "eSIM дэмждэг утас байгаа эсэхийг шалгана уу. iPhone XS болон түүнээс хойшхи загварууд, Samsung Galaxy S20 болон түүнээс дээш загварууд дэмждэг.",
    items: [
      "iPhone: Тохиргоо → Ерөнхий → Тухай → EID байгаа бол дэмждэг",
      "Android: Тохиргоо → Холбоо → SIM Manager → eSIM нэмэх",
    ],
  },
  {
    num: "02",
    title: "eSIM сонгож авах",
    icon: "🛒",
    desc: "Очих улсаа сонгож, тохирох өгөгдлийн багцаа авна уу. Олон сонголт байгаа тул аялалын хугацааны дагуу сонгоорой.",
    items: [
      "Дата хэмжээ: Богино аяллаар 1-3 GB, урт аяллаар 5-10 GB+"
    ],
  },
  {
    num: "03",
    title: "QPay-р төлөх",
    icon: "💳",
    desc: "QPay апп-аар хялбархан, аюулгүй төлбөр хийнэ үү.",
    items: [
      "QPay апп нь Apple App Store болон Google Play-д байдаг",
      "Дансны карт холбосон байх шаардлагатай",
    ],
  },
  {
    num: "04",
    title: "QR код скан хийх",
    icon: "📷",
    desc: "Төлбөр баталгаажмагц QR код хүлээн авна. Утасны тохиргооноос eSIM нэмнэ үү.",
    items: [
      "iPhone: Тохиргоо → Үүрэн холбоо → eSIM нэмэх → QR скан",
      "Android: Тохиргоо → Холбоо → eSIM → QR скан",
    ],
  },
  {
    num: "05",
    title: "Идэвхжүүлэх",
    icon: "🚀",
    desc: "eSIM суулгасны дараа дата шилжүүлэлтийг тохируулна уу.",
    items: [
      "Очих улсдаа хүрэхэд eSIM-ийг идэвхтэй болгоно уу",
      "Дата роаминг-ийг идэвхжүүлнэ үү",
      "APN тохиргооны шаардлага байж болно — нийлүүлэгчийн зааврыг уншина уу",
    ],
  },
];

const DEVICES = [
  { name: "iPhone", steps: ["Тохиргоо → Үүрэн холбоо", "eSIM нэмэх → QR код ашиглан нэмэх", "QR кодыг скан хийнэ үү", "Идэвхжүүлэлтийг баталгаажуулна уу"] },
  { name: "Samsung", steps: ["Тохиргоо → Холбоогдолт", "SIM Manager / SIM cards", "eSIM нэмэх → QR скан", "eSIM-ийг идэвхжүүлнэ үү"] },
  { name: "Google Pixel", steps: ["Тохиргоо → Сүлжээ ба интернэт", "SIM → eSIM нэмэх", "QR кодыг скан хийнэ үү", "Баталгаажуулна уу"] },
];

const FAQS = [
  {
    q: "eSIM гэж юу вэ?",
    a: "eSIM (Embedded SIM) нь физик SIM картгүйгээр ашиглаж болох дижитал SIM карт юм. Утасны тохиргооноос шууд идэвхжүүлнэ.",
  },
  {
    q: "eSIM дэмждэг утас ямар загварууд вэ?",
    a: "iPhone XS/XR (2018+), Samsung S20+, Google Pixel 3+, болон бусад орчин үеийн загварууд. Утасныхаа IMEI тоогоор шалгаж болно.",
  },
  {
    q: "eSIM авсны дараа хэр хурдан идэвхждэг вэ?",
    a: "Төлбөр баталгаажсаны дараа шуурхай QR код хүлээн авна. Суулгалт 2-5 минутад дуусна.",
  },
  {
    q: "Нэг утсанд хэд хэдэн eSIM хадгалж болох уу?",
    a: "Тийм! Ихэнх утас олон eSIM профайл хадгалж чадна. Гэхдээ зэрэгцэн ажилладаг тоо нь загвараас хамаарна.",
  },
  {
    q: "Дата дуусахаар яах вэ?",
    a: "eSIM Access API нь Top Up буюу дата нэмэх боломжтой. Захиалга хэсгийн 'дата нэмэх' товч ашиглаарай.",
  },
  {
    q: "Дуудлага болон SMS ажилладаг уу?",
    a: "Ихэнх eSIM нь зөвхөн дата (интернэт) юм. Утасдах болон SMS-д зориулж үндсэн SIM картаа хэрэглэнэ үү.",
  },
];

export default function HowToUsePage() {
  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "64px", maxWidth: 640 }}>
          <p style={{ color: "var(--accent-hover)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", marginBottom: "12px", textTransform: "uppercase" }}>
            ЗААВАР
          </p>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            eSIM хэрхэн ашиглах вэ?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.6 }}>
            5 хялбар алхмаар eSIM тохируулж, дэлхийн хаана ч интернэттэй болоорой.
          </p>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: "80px" }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "32px",
                marginBottom: "40px",
                alignItems: "flex-start",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  minWidth: 60,
                  height: 60,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--accent-hover)",
                  letterSpacing: "0.05em",
                }}
              >
                <span style={{ fontSize: 22 }}>{step.icon}</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--accent-hover)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    АЛХАМ {step.num}
                  </span>
                  <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: "10px" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.65, marginBottom: "12px" }}>
                  {step.desc}
                </p>
                {step.items.length > 0 && (
                  <ul style={{ paddingLeft: "18px", color: "var(--text-muted)", fontSize: 14, lineHeight: 2 }}>
                    {step.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Device-specific instructions */}
        <div style={{ marginBottom: "80px" }}>
          <h2 className="section-title" style={{ marginBottom: "32px" }}>
            Төхөөрөмж бүрийн заавар
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {DEVICES.map((device, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: "28px" }}
              >
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: "16px" }}>
                  {device.name === "iPhone" ? "🍎" : device.name === "Samsung" ? "📱" : "🔷"}{" "}
                  {device.name}
                </h3>
                <ol style={{ paddingLeft: "18px", color: "var(--text-muted)", fontSize: 14, lineHeight: 2.1 }}>
                  {device.steps.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: "80px" }}>
          <h2 className="section-title" style={{ marginBottom: "32px" }}>
            Түгээмэл асуулт
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: 720 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: "24px" }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    marginBottom: "10px",
                    color: "var(--text)",
                  }}
                >
                  {faq.q}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 24,
            padding: "48px",
            textAlign: "center",
            marginBottom: "80px",
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: "12px" }}>
            Бэлэн үү?
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "28px", fontSize: 15 }}>
            Дэлгүүрт орж eSIM багцаа аваарай.
          </p>
          <Link href="/shop" className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>
            Дэлгүүр →
          </Link>
        </div>
      </div>
    </div>
  );
}
