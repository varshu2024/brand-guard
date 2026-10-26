import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ContentStudio from "./components/ContentStudio";
import VisualInspector from "./components/VisualInspector";
import KnowledgeBase from "./components/KnowledgeBase";
import ReviewQueue from "./components/ReviewQueue";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ApiPlayground from "./components/ApiPlayground";
import JudgeModal from "./components/JudgeModal";

export default function App() {
  const [activeTab, setActiveTab] = useState("studio");
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
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
    showToast("Demo Brand Pack (NovaPulse Cloud) successfully re-synchronized!");
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
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
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

      {/* Judge's Walkthrough Modal */}
      <JudgeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />

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

      {/* Footer */}
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
            <strong style={{ color: "var(--text-silver)" }}>BrandGuard</strong> — Intelligent Pre-Publish Brand Governance & Verification Trust Layer.
          </div>
          <div>
            Built for Problem Statement by <strong style={{ color: "var(--accent-gold-light)" }}>Inkloom AI</strong> • Organised by <strong>We Code Coders</strong>
          </div>
          <div>
            Developer: <strong style={{ color: "var(--text-warm)" }}>Varshini Uppada</strong> (Team GIRL CODER)
          </div>
        </div>
      </footer>
    </div>
  );
}
