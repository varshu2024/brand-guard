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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: 60 }}>
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
          bottom: 24,
          right: 24,
          background: "rgba(15, 23, 42, 0.95)",
          border: "1px solid var(--brand-emerald)",
          boxShadow: "0 4px 20px rgba(16, 185, 129, 0.35)",
          color: "#6EE7B7",
          padding: "12px 20px",
          borderRadius: 10,
          fontSize: "0.88rem",
          fontWeight: 600,
          zIndex: 300,
          backdropFilter: "blur(12px)"
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(9, 13, 22, 0.9)",
        padding: "18px 28px",
        textAlign: "center",
        fontSize: "0.78rem",
        color: "var(--text-dim)"
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <strong>BrandGuard</strong> — An intelligent brand-governance & pre-publish verification trust layer.
          </div>
          <div>
            Built for Problem Statement by <strong>Inkloom AI</strong> • Organised by <strong>We Code Coders</strong>
          </div>
          <div>
            Developer: <strong>Varshini Uppada</strong> (Team GIRL CODER)
          </div>
        </div>
      </footer>
    </div>
  );
}
