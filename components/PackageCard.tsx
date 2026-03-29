interface PackageCardProps {
  packageCode: string;
  name: string;
  volume: number; // bytes
  duration: number;
  durationUnit: string;
  price: number;
  currencyCode: string;
  speed?: string;
  onSelect?: () => void;
  selected?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(0) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(0) + " MB";
  return bytes + " B";
}

function formatDuration(duration: number, unit: string): string {
  const u = unit?.toUpperCase();
  if (u === "DAY") return duration === 1 ? "1 өдөр" : `${duration} өдөр`;
  if (u === "MONTH") return `${duration} сар`;
  return `${duration} ${unit}`;
}

// Convert USD cents to MNT approximately (1 USD ~ 3450 MNT)
function toMnt(cents: number): number {
  return Math.round((cents / 10000) * 3450);
}

export default function PackageCard({
  packageCode,
  name,
  volume,
  duration,
  durationUnit,
  price,
  currencyCode,
  speed,
  onSelect,
  selected,
}: PackageCardProps) {
  const displayPrice =
    currencyCode === "USD" ? toMnt(price) : price;

  return (
    <div
      className="card"
      style={{
        padding: "24px",
        cursor: onSelect ? "pointer" : "default",
        border: selected
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
        boxShadow: selected ? "0 0 0 3px rgba(99,102,241,0.15)" : undefined,
      }}
      onClick={onSelect}
    >
      {/* Header badges */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span className="badge badge-accent">{formatBytes(volume)}</span>
        <span className="badge badge-green">{formatDuration(duration, durationUnit)}</span>
        {speed && (
          <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
            {speed}
          </span>
        )}
      </div>

      <h3
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: "16px",
          lineHeight: 1.4,
        }}
      >
        {name}
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1,
            }}
          >
            ₮{displayPrice.toLocaleString()}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: "4px" }}>
            нэг удаагийн төлбөр
          </p>
        </div>
        {onSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="btn-primary"
            style={{ padding: "10px 18px", fontSize: 14, whiteSpace: "nowrap" }}
          >
            {selected ? "✓ Сонгогдсон" : "Авах"}
          </button>
        )}
      </div>
    </div>
  );
}
