"use client";
export const runtime = 'edge';
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import PackageCard from "@/components/PackageCard";
import type { EsimPackage } from "@/lib/esim-client";
import countryData from "../../../data/countries.json"
import globe from "../../../assets/globe.png"
interface PageProps {
  params: Promise<{ country: string }>;
}
import countryJson from "../../../data/countries.json"

const countryName = {}

function GetName(code){
  if(countryName[code]){
    return countryName[code]
  }
  countryName[code] = countryJson.find((i) => {
    return i.code == code.toUpperCase()
  })?.name || code
  return countryName[code]
}
export default function CountryPackagesPage({ params }: PageProps) {

  console.log("hihi");
  
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [packages, setPackages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EsimPackage | null>(null);
  const [scrolled, setScrolled] = useState(false);
const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    params.then(({ country: c }) => {
      setCountry(c.toLowerCase());
    });
  }, [params]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    console.log(country);
    
    if (!country) return;
    setLoading(true);
    setError("");
    fetch(`/api/esim/packages?locationCode=${country.toUpperCase()}&type=BASE`)
      .then((r) => r.json())
      .then((data) => {
        if(data.error){
          setError("Мэдээлэл олдсонгүй")
          return
        }
        setPackages(data)
      })
      .catch(() => setError("Сервертэй холбогдоход алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, [country]);
  const meta = countryData.find((x) => x.code == country.toUpperCase()) || {name:"",region:"",code:""}
  
  const handleCheckout = () => {
    if (!selected) return;
    console.log(selected);
    
    router.push(`/checkout?id=${selected.slug}`);
  };

  // Group packages by duration
  const groupedPackages = packages==null?[]: packages?.prices.reduce((acc, pkg) => {
    const key = pkg.time;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(pkg);
    return acc;
  }, {} as Record<string, EsimPackage[]>);

  // Sort duration keys in ascending order
  const sortedDurationKeys = Object.keys(groupedPackages).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", paddingBottom: selected ? "120px" : "60px" }}>
      {/* Floating Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          position: "fixed",
          top: "96px",
          left: "max(24px, calc((100vw - 1200px) / 2))",
          zIndex: 60,
          background: scrolled ? "rgba(17, 24, 39, 0.8)" : "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "50%",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        aria-label="Буцах"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Hero Header */}
      <div style={{
        position: 'relative',
        height: '45vh',
        minHeight: '300px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
         
        </div>

        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, var(--bg-body) 100%)',
        }} />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '32px' }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: 64,
                height: 46,
                borderRadius: 8,
                overflow: "hidden",
                background: "rgba(255,255,255,0.1)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                flexShrink: 0,
                border: "2px solid rgba(255,255,255,0.8)"
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {country && (
                <img
                  src={ country.split("-").length>1?globe.src: `https://flagcdn.com/${country.toLowerCase()}.svg`}
                  alt={`${meta.name} далбаа`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>

            <div>
              <h1
                style={{
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  marginBottom: "4px",
                }}
              >
                {meta.name}
              </h1>
              <div style={{ 
                display: "inline-block",
                padding: "6px 16px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                borderRadius: "100px",
                color: "#f3f4f6", 
                fontSize: 14,
                fontWeight: 500,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}>
                {(loading || error) ? "Ачаалж байна..." : `${packages?.prices.length} багц боломжтой`}
              </div>
            </div>
          </div>
        </div>
      </div>
            {
   (country.split("-").length > 1 && packages?.supportedRegeon?.length > 0) ? (
    <div className="container" style={{ marginTop: "24px", position: "relative", zIndex: 10 }} onClick={() => setIsExpanded(!isExpanded)}>
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          borderRadius: 20,
          padding: "20px 24px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: isExpanded ? "16px" : "0",
            cursor: "pointer",
            userSelect: "none",
          }}
          
        >
          <span style={{ fontSize: 20 }}>🌍</span>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#f3f4f6",
              margin: 0,
            }}
          >
            Ашиглах боломжтой орнууд
          </h3>
          <span
            style={{
              padding: "2px 10px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 100,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            {packages.supportedRegeon[0].split(",").length} орнууд
          </span>
          
          {/* 展开/收起图标 */}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 14,
              color: "#9ca3af",
              transition: "transform 0.2s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>

        {/* 可展开/收起的内容 */}
        <div
          style={{
            display: isExpanded ? "flex" : "none",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "16px",
            transition: "all 0.3s ease",
          }}
        >
          {console.log(packages.supportedRegeon)}
          {packages.supportedRegeon[0].split(",").map((countryCode) => (
            <div
              key={countryCode}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                color: "#e5e7eb",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
            >
              <img
                src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.webp`}
                alt={countryCode}
                style={{
                  width: 20,
                  height: 15,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span>{GetName(countryCode.toUpperCase())}</span>
            </div>
          ))}
        </div>
        
        {/* 收起时显示的前3个国家预览 */}
        {!isExpanded && packages.supportedRegeon[0].split(",").length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              // gap: "8px",
              marginTop: "12px",
              opacity: 0.7,
            }}
          >
            {packages.supportedRegeon[0].split(",").slice(0, 3).map((countryCode) => (
              <div
                key={`preview-${countryCode}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  // gap: "6px",
                  padding: "4px 10px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 100,
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                
                <span>{GetName(countryCode.toUpperCase())}</span>
              </div>
            ))}
            {packages.supportedRegeon[0].split(",").length > 3 && (
              <span
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  color: "#6b7280",
                }}
              >
                +{packages.supportedRegeon[0].split(",").length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  ) : null
}
      

      <div className="container" style={{ marginTop: "24px", position: "relative", zIndex: 10 }}>
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
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 20 }}>⚠️</span> {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 20,
                  height: 220,
                  animation: "glow-pulse 1.5s ease infinite",
                  border: "1px solid var(--border)",
                }}
              />
            ))}
          </div>
        ) : (
          <>
            {sortedDurationKeys.map((duration, index) => {
              const durationPackages = groupedPackages[duration];
              const durationUnit = "өдрийн багц";
              
              return (
                <div key={duration} style={{ marginBottom: "40px" }}>
                  {/* Duration Header */}
                  <h2 style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "20px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    {duration} {durationUnit}
                  </h2>
                  
                  {/* Packages Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {durationPackages.map((pkg, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          animation: `fade-in-up 0.5s ease forwards ${(index * 0.1) + (i * 0.05)}s`,
                          opacity: 0,
                          transform: "translateY(20px)"
                        }}
                      >
                        <PackageCard
                          name={pkg.name}
                          volume={pkg.volume}
                          duration={pkg.time}
                          durationUnit={"DAY"}
                          price={pkg.price}
                          speed={packages.speed}
                          selected={selected?.slug === pkg.slug}
                          onSelect={() => setSelected(
                            selected?.slug === pkg.slug ? null : pkg
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {!packages && !error && (
              <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 24, opacity: 0.5, filter: "grayscale(1)" }}>🌍</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Багц олдсонгүй</h3>
                <p>Уучлаарай, {meta.name} улсад одоогоор багц алга байна.</p>
              </div>
            )}
          </>
        )}

        {/* Sticky checkout bar */}
        {selected && (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              background: "rgba(20, 25, 35, 0.85)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 100,
              padding: "16px 24px 16px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "32px",
              width: "calc(100% - 48px)",
              maxWidth: 720,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05) inset",
              animation: "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>{selected.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 500 }}>
                {(selected.volume / 1073741824).toFixed(0)} GB ·{" "}
                {selected.duration} {selected.durationUnit}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>Нийт дүн</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
                  ₮{Math.round(selected.price).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={handleCheckout} 
                className="btn-primary" 
                style={{ 
                  fontSize: 16, 
                  padding: "16px 32px", 
                  borderRadius: 100,
                  boxShadow: "0 8px 16px rgba(14, 165, 233, 0.3)",
                  letterSpacing: "0.5px"
                }}
              >
                Авах →
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up-fade {
          from {
            opacity: 0;
            transform: translate(-50%, 20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
