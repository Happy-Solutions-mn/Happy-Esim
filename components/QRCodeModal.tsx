"use client";
import { useEffect, useRef, useState } from "react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl?: string;
  activationCode?: string;
  iccid?: string;
  packageName?: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  qrCodeUrl,
  activationCode,
  iccid,
  packageName,
}: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const copyCode = async () => {
    if (activationCode) {
      await navigator.clipboard.writeText(activationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        animation: "fadeInUp 0.3s ease",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: "40px",
          maxWidth: 460,
          width: "100%",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.08)",
            border: "none",
            color: "var(--text-muted)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: 36, marginBottom: "12px" }}>📱</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: "6px" }}>
            Таны eSIM бэлэн боллоо!
          </h2>
          {packageName && (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{packageName}</p>
          )}
        </div>

        {/* QR Code */}
        {qrCodeUrl ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Use img tag for QR from eSIM Access URL */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="eSIM QR Code"
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              padding: "40px",
              marginBottom: "24px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            QR код ачаалагдаж байна...
          </div>
        )}

        {/* ICCID */}
        {iccid && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: "6px" }}>
              ICCID
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: "var(--text)",
                background: "rgba(255,255,255,0.04)",
                padding: "10px 14px",
                borderRadius: 8,
                letterSpacing: "0.05em",
              }}
            >
              {iccid}
            </p>
          </div>
        )}

        {/* Activation Code */}
        {activationCode && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: "6px" }}>
              Идэвхжүүлэх код
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "var(--text)",
                  wordBreak: "break-all",
                  flex: 1,
                }}
              >
                {activationCode}
              </p>
              <button
                onClick={copyCode}
                style={{
                  background: copied ? "var(--green)" : "var(--accent)",
                  border: "none",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
              >
                {copied ? "✓ Хуулагдлаа" : "Хуулах"}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div
          style={{
            background: "rgba(99,102,241,0.08)",
            borderRadius: 12,
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: 13, color: "var(--accent-hover)", fontWeight: 600, marginBottom: "8px" }}>
            📋 Идэвхжүүлэх заавар
          </p>
          <ol style={{ paddingLeft: "20px", color: "var(--text-muted)", fontSize: 13, lineHeight: 2 }}>
            <li>Утасны Тохиргоо → Дата нэмэх → QR код уншуулах</li>
            <li>QR кодыг скан хийнэ үү</li>
            <li>eSIM-ийг идэвхжүүлнэ үү</li>
            <li>Дата ашиглаж эхэлнэ үү!</li>
          </ol>
        </div>

        <button onClick={onClose} className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          Хаах
        </button>
      </div>
    </div>
  );
}
