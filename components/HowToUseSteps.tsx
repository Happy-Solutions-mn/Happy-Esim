export default function HowToUseSteps() {
  const steps = [
    {
      num: "01",
      icon: "🌍",
      title: "Улс орноо сонгох",
      desc: "100+ улс орноос өөрийн очих газраа хайж, тохирох өгөгдлийн багцаа сонгоно уу.",
    },
    {
      num: "02",
      icon: "💳",
      title: "QPay-р төлөх",
      desc: "QPay ашиглан хялбархан, аюулгүйгээр төлбөрөө хийнэ үү. Шуурхай баталгаажуулалт.",
    },
    {
      num: "03",
      icon: "📲",
      title: "QR кодоор идэвхжүүлэх",
      desc: "Төлбөр хиймэгц QR код хүлээн авна. Утасны тохиргооноос хялбархан идэвхжүүлнэ үү.",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        position: "relative",
      }}
    >
      {steps.map((step, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Step number watermark */}
          <div
            style={{
              position: "absolute",
              top: -10,
              right: 16,
              fontSize: 80,
              fontWeight: 900,
              color: "rgba(99,102,241,0.06)",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {step.num}
          </div>

          {/* Icon */}
          <div
            style={{
              width: 56,
              height: 56,
              background: "rgba(99,102,241,0.12)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: "20px",
            }}
          >
            {step.icon}
          </div>

          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "10px",
            }}
          >
            {step.title}
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
