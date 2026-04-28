"use client";
import { useState, useEffect, useRef } from "react";
import CountryCard from "@/components/CountryCard";



const REGION_ORDER = ["Ази", "Европ", "Хойд Америк", "Өмнөд Америк", "Австрали", "Дундад зүүн"];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [allCountry, setAllCountry] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});



useEffect(() => {
  fetch("/api/esim/list").then((res) => {
    
    res.json().then((r) => {
      setAllCountry(r);
      setFiltered(r);
    })
  })
}, [])
  useEffect(() => {
    const q = search.toLowerCase().trim();
    setFiltered(
      q
        ? allCountry.filter(
            (c:any) =>
              c.name.toLowerCase().includes(q) ||
              c.code.toLowerCase().includes(q)
          )
        : allCountry
    );
  }, [search]);

  const groupedByRegion = filtered.reduce((acc:any, country:any) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, typeof allCountry>);

  const sortedRegions = Object.keys(groupedByRegion).sort((a, b) => {
    const indexA = REGION_ORDER.indexOf(a);
    const indexB = REGION_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div className="container">
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

        {search && (
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "24px" }}>
            {filtered.length} үр дүн олдлоо
          </p>
        )}

        {filtered.length > 0 ? (
          <div>
            {sortedRegions.map((region) => {
              const countries = groupedByRegion[region];
              
              const isExpanded = expandedRegions[region] || false;
              const hasMore = countries.length > 5;
              
              const toggleExpand = () => {
                setExpandedRegions(prev => ({
                  ...prev,
                  [region]: !prev[region]
                }));
              };
              
              return (
                <div key={region} style={{ marginBottom: "48px" }}>
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid var(--border)"
                    }}
                  >
                    {region}
                  </h2>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        paddingTop:"10px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "16px",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-in-out"
                      }}
                    >
                      {countries.map((c:typeof countries[0], index:number) => {
                        if (!isExpanded && index >= 5) return null;
                        

                        return <div
                          key={c.code}
                          style={{
                            animation: isExpanded && index >= 5 
                          ? 'fadeInUp 0.3s ease-out forwards'
                          : 'none',
                          }}
                        >
                          <CountryCard {...c} />
                        </div>
            })}
                    </div>
                  </div>
                  {hasMore && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <button
                        onClick={toggleExpand}
                        style={{
                          background: "none",
                          border: "1px solid var(--border)",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--text)";
                          e.currentTarget.style.borderColor = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.borderColor = "var(--border)";
                        }}
                      >
                        {isExpanded ? "Буцах" : "Дэлгэрэнгүй"}
                        <span style={{ transition: "transform 0.3s ease" }}>
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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
            {allCountry.length == 0?<p style={{ fontSize: 18, fontWeight: 600, marginBottom: "8px" }}>
             Уншиж байна
            </p>:<>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: "8px" }}>
             Улс олдсонгүй
            </p>
            <p style={{ fontSize: 14 }}>Өөр нэрээр хайж үзнэ үү</p>
            </>}
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}


<style jsx>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>