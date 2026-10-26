import React from "react";
import { 
  Shield, Sparkles, BookOpen, Layers, BarChart3, Terminal, 
  RefreshCw, Image as ImageIcon, Bell, User, ShieldCheck
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, onResetDemo }) {
  const navItems = [
    { id: "studio", label: "Content Editor", icon: Sparkles },
    { id: "visual", label: "Visual Assets", icon: ImageIcon },
    { id: "knowledge", label: "Claim Ledger", icon: BookOpen },
    { id: "workflow", label: "Review Queue", icon: Layers, badge: "3" },
    { id: "analytics", label: "Governance Drift", icon: BarChart3 },
    { id: "api", label: "AI Guardrail API", icon: Terminal }
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(16, 19, 25, 0.94)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-bronze)",
      padding: "10px 24px"
    }}>
      <div style={{
        maxWidth: 1480,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 14
      }}>
        {/* Brand identity: Gold-outlined shield logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg, #161A22 0%, #101319 100%)",
            border: "1.5px solid var(--accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px rgba(197, 160, 89, 0.25)"
          }}>
            <Shield size={20} color="var(--accent-gold)" strokeWidth={2.2} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em"
              }}>
                BrandGuard
              </span>
              <span className="badge badge-gold" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                Enterprise
              </span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-silver)", display: "flex", gap: 6, alignItems: "center" }}>
              <span>Autonomous Pre-Publish Governance</span>
              <span>•</span>
              <span style={{ color: "var(--accent-gold-light)" }}>NovaPulse Cloud Org</span>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs (Active = Neon Lime with dark text) */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(10, 11, 14, 0.75)",
          padding: 3,
          borderRadius: 8,
          border: "1px solid var(--border-subtle)"
        }}>
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
                  gap: 6,
                  padding: "6px 13px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--accent-lime-dark)" : "var(--text-silver)",
                  background: isActive ? "var(--accent-lime)" : "transparent",
                  boxShadow: isActive ? "0 2px 8px rgba(196, 248, 42, 0.25)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={15} color={isActive ? "var(--accent-lime-dark)" : "var(--accent-gold)"} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: "0.62rem",
                    padding: "1px 5px",
                    borderRadius: 4,
                    background: isActive ? "rgba(0,0,0,0.2)" : "rgba(197, 160, 89, 0.2)",
                    color: isActive ? "#000" : "var(--accent-gold-light)",
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Enterprise Actions & Profile Area */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Active Status Badge */}
          <div className="badge badge-healthy" style={{ padding: "5px 9px", fontSize: "0.72rem", gap: 5 }}>
            <ShieldCheck size={13} />
            <span>Active Guardrails</span>
          </div>

          <button
            onClick={onResetDemo}
            className="btn btn-secondary btn-sm"
            title="Re-synchronize with official NovaPulse brand guidelines"
            style={{ fontSize: "0.78rem" }}
          >
            <RefreshCw size={13} color="var(--accent-gold)" />
            <span>Sync Brand Pack</span>
          </button>

          {/* Profile & Notifications */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: 8,
            borderLeft: "1px solid var(--border-bronze)"
          }}>
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "rgba(22, 26, 34, 0.6)",
                border: "1px solid var(--border-bronze)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-silver)"
              }}
              title="Notifications: All systems operational"
            >
              <Bell size={15} />
            </button>

            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "rgba(197, 160, 89, 0.15)",
              border: "1px solid var(--border-bronze)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--accent-gold-light)"
            }} title="Varshini Uppada (Lead Brand Architect)">
              VU
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
