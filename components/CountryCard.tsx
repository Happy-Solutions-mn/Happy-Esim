"use client";
// import Link from "next/link";
import Link from "@/components/Link"
import Image from "next/image";
import { useEffect, useState } from "react";
import globe from "../assets/globe.png"


interface CountryCardProps {
  code: string;
  name: string;
  flag: string; // emoji fallback
  fromPrice: number;
  packageCount?: number;
  supportedRegeon:string[]
}


export default function CountryCard({
  code,
  name,
  flag,
  fromPrice,
  packageCount,
  supportedRegeon
}: CountryCardProps) {
  const [imgError, setImgError] = useState(false);
  const sup = supportedRegeon[0].split(",")
  const [flagURL, setFlag] = useState(sup.length>1?globe: `https://flagcdn.com/${code.toLowerCase()}.svg`)

  return (
    <Link href={`/shop/${code.toLowerCase()}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          aspectRatio: "3/2",
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Flag as full background */}
        {!imgError ? (
          <Image
            src={flagURL}
            alt={`${name} далбаа`}
            fill
            style={{ objectFit: "cover" }}
            // onError={() => setImgError(true)}
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--bg-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
            }}
          >
            {flag}
          </div>
        )}

        {/* Dark gradient overlay — bottom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* Content overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: "2px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                {name}
              </p>
              {/* <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: "2px",
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                ₮{fromPrice.toLocaleString()}~
              </p> */}
            </div>

            {/* Arrow button */}
            <div
              style={{
                width: 28,
                height: 28,
                background: "rgba(99,102,241,0.85)",
                backdropFilter: "blur(8px)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              →
            </div>
          </div>
        </div>

        {/* Package count badge — top right */}
        {packageCount !== undefined && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              borderRadius: "50px",
              padding: "3px 9px",
              fontSize: 11,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
            }}
          >
            {packageCount} багц
          </div>
        )}
      </div>
    </Link>
  );
}
