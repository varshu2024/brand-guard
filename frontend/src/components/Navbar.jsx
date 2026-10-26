import React from "react";
import { ShieldCheck, Sparkles, BookOpen, Layers, BarChart3, Terminal, Award, RefreshCw, Image as ImageIcon } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, onOpenJudgeModal, onResetDemo }) {
  const navItems = [
    { id: "studio", label: "Content Studio", icon: Sparkles, badge: "Live" },
    { id: "visual", label: "Visual Inspector", icon: ImageIcon },
    { id: "knowledge", label: "Brand Knowledge", icon: BookOpen },
    { id: "workflow", label: "Review Queue", icon: Layers, badge: "3" },
    { id: "analytics", label: "Governance Drift", icon: BarChart3 },
    { id: "api", label: "AI Guardrail API", icon: Terminal }
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(9, 13, 22, 0.85)",
      backdropFilter: "blur(18px)",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "12px 28px"
    }}>
      <div style={{
        maxWidth: 1440,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        {/* Brand identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
          }}>
            <ShieldCheck size={26} color="#FFFFFF" strokeWidth={2.3} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.3rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                background: "linear-gradient(to right, #FFFFFF, #C7D2FE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                BrandGuard
              </span>
              <span className="badge badge-info" style={{ fontSize: "0.68rem" }}>Round 2 Build</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: 6, alignItems: "center" }}>
              <span>Team: <strong style={{ color: "#E0E7FF" }}>GIRL CODER</strong></span>
              <span>•</span>
              <span>Varshini Uppada</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(15, 23, 42, 0.7)", padding: 4, borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 14px",
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#FFFFFF" : "var(--text-muted)",
                  background: isActive ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" : "transparent",
                  boxShadow: isActive ? "0 2px 10px rgba(99, 102, 241, 0.35)" : "none",
                  transition: "all 0.18s ease"
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: "0.65rem",
                    padding: "1px 6px",
                    borderRadius: 10,
                    background: isActive ? "rgba(255,255,255,0.25)" : "rgba(99, 102, 241, 0.2)",
                    color: isActive ? "#FFFFFF" : "#A5B4FC",
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions & Judge Tour Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onResetDemo}
            className="btn btn-secondary btn-sm"
            title="Reload default NovaPulse Brand Pack"
            style={{ fontSize: "0.78rem" }}
          >
            <RefreshCw size={14} />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={onOpenJudgeModal}
            className="btn btn-emerald btn-sm"
            style={{ fontWeight: 700, gap: 6, fontSize: "0.82rem" }}
          >
            <Award size={16} />
            <span>Judge Guide & 3 Improvements</span>
          </button>
        </div>
      </div>
    </header>
  );
}
