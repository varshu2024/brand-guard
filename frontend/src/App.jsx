import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ContentStudio from "./components/ContentStudio";
import VisualInspector from "./components/VisualInspector";
import KnowledgeBase from "./components/KnowledgeBase";
import ReviewQueue from "./components/ReviewQueue";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ApiPlayground from "./components/ApiPlayground";

export default function App() {
  const [activeTab, setActiveTab] = useState("studio");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetDemo = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/reset_seed", { method: "POST" });
    } catch (e) {
      console.warn("Backend reset skipped in offline mode");
    }
    showToast("Brand Guidelines & Claim Ledger re-synchronized!");
  };

  const handleSubmitToQueue = (draftData) => {
    showToast(`Draft "${draftData.title}" dispatched to Review Queue with Score ${draftData.score}/100!`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-obsidian)" }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: 50 }}>
        {activeTab === "studio" && <ContentStudio onSubmitToQueue={handleSubmitToQueue} />}
        {activeTab === "visual" && <VisualInspector />}
        {activeTab === "knowledge" && <KnowledgeBase />}
        {activeTab === "workflow" && <ReviewQueue />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
        {activeTab === "api" && <ApiPlayground />}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#161A22",
          border: "1px solid var(--border-lime)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          color: "var(--accent-lime)",
          padding: "10px 18px",
          borderRadius: 6,
          fontSize: "0.82rem",
          fontWeight: 600,
          zIndex: 300,
          backdropFilter: "blur(12px)"
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Enterprise Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-bronze)",
        background: "rgba(10, 11, 14, 0.95)",
        padding: "14px 28px",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--text-muted)"
      }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <strong style={{ color: "var(--text-silver)" }}>BrandGuard AI Governance</strong> — Intelligent Pre-Publish Brand Verification & Factual Grounding Platform.
          </div>
          <div>
            Protected Organization: <strong style={{ color: "var(--accent-gold-light)" }}>NovaPulse Cloud Enterprise</strong> • Active Claim Ledger v2.4
          </div>
          <div>
            <span>© 2026 BrandGuard. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
