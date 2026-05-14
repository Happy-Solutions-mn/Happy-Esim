"use client";
import Link from "@/components/Link"
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png"
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, isLoggedIn, logout } = useAuth();



  const navLinks = [
    { href: "/shop", label: "Дэлгүүр" },
    { href: "/how-to-use", label: "Хэрхэн ашиглах" },
    { href: "/orders", label: "Захиалга шалгах" },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 0",
          transition: "all 0.3s ease",
          ...(scrolled
            ? {
                background: "rgba(10, 14, 26, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }
            : {}),
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              <Image alt="logo" src={logo} width={40} height={40} />
            </div>
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
          </Link>

          {/* Desktop links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
            className="desktop-nav"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: "none",
                  color: "var(--text-muted)",
                  fontSize: 15,
                  fontWeight: 500,
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
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <ThemeToggle />
              
              {/* Auth buttons or user menu */}
              {isLoggedIn ? (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      background: "rgba(99, 102, 241, 0.15)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      borderRadius: "8px",
                      color: "var(--text)",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)";
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>👤</span>
                    <span>{user?.name || user?.email.split("@")[0]}</span>
                    <span>{showUserMenu ? "▲" : "▼"}</span>
                  </button>
                  
                  {/* User dropdown menu */}
                  {showUserMenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "var(--bg-card)",
                        borderRadius: "8px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                        padding: "8px",
                        minWidth: "160px",
                        zIndex: 1000,
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "none",
                          border: "none",
                          borderRadius: "6px",
                          color: "var(--text-muted)",
                          fontSize: "14px",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--bg)";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "none";
                          e.currentTarget.style.color = "var(--text-muted)";
                        }}
                      >
                        ⚙️ Гарах
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  style={{
                    padding: "10px 22px",
                    background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  🔐 Нэвтрэх
                </button>
              )}
              
              <Link href="/shop" className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }}>
                Одоо авах →
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "var(--text)",
              fontSize: 24,
              cursor: "pointer",
            }}
            className="hamburger"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "var(--bg-card)",
              borderTop: "1px solid var(--border)",
              padding: "16px 24px",
            }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: 16,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {l.label}
              </Link>
            ))}
            
            {/* Mobile auth buttons */}
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  margin: "16px 0",
                }}
              >
                🔐 Нэвтрэх
              </button>
            ) : (
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  color: "#ef4444",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  margin: "16px 0",
                }}
              >
                ⚙️ Гарах
              </button>
            )}
            
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            >
              Одоо авах →
            </Link>
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .hamburger { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
