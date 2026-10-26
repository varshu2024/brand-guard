import React from "react";
import { Award, CheckCircle2, ShieldCheck, Zap, Layers, Sparkles, X, ArrowRight, UserCheck } from "lucide-react";

export default function JudgeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(9, 13, 22, 0.85)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200,
      padding: 20
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: 820,
        maxHeight: "90vh",
        overflowY: "auto",
        padding: 30,
        position: "relative",
        border: "1px solid rgba(99, 102, 241, 0.4)",
        boxShadow: "0 0 50px rgba(99, 102, 241, 0.25)"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          <X size={22} />
        </button>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Award size={26} color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.4rem", color: "#F8FAFC" }}>Round 2 Submission Guide for Judges</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Team: <strong style={{ color: "#E0E7FF" }}>GIRL CODER</strong> • Solo Participant: <strong>Varshini Uppada</strong>
            </div>
          </div>
        </div>

        {/* Evaluation Criteria Scorecard */}
        <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <h4 style={{ fontSize: "0.88rem", color: "var(--brand-cyan)", marginBottom: 12, textTransform: "uppercase" }}>
            Round 2 Evaluation Coverage (100 Points Total)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10B981" }}>Core Workflow Runs (30 pts)</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>End-to-end draft scan, claim citations, 1-click fixes, approval workflow.</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10B981" }}>Technical Depth (25 pts)</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>FastAPI + grounded ledger + WCAG contrast + fallback zero-downtime engine.</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10B981" }}>Progress from Round 1 (20 pts)</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Built all promised Must-have features from the proposal document.</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10B981" }}>3 Planned Improvements (15 pts)</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Meaningful, substantial additions specified for Round 3 finish.</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10B981" }}>Usability & Self-Service (10 pts)</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Intuitive UI with 1-click scenario buttons for effortless judge testing.</div>
            </div>
          </div>
        </div>

        {/* The 3 Major Improvements for Round 3 (Mandatory Criterion: 15 Points) */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: "1.05rem", color: "#F8FAFC", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={18} color="var(--brand-primary)" />
            <span>The Three Major Improvements for Round 3</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: 10, padding: 14 }}>
              <div style={{ fontWeight: 700, color: "#A5B4FC", fontSize: "0.92rem", marginBottom: 4 }}>
                1. Multi-Modal Figma/Canva & Slide Layout Engine with Automated Logo Clearspace Verification
              </div>
              <p style={{ fontSize: "0.8rem", color: "#CBD5E1", lineHeight: "1.5" }}>
                Expanding the visual engine from single raster images to multi-layer vector canvas files (Figma tokens, Canva exports, PDF pitch decks). It will automatically run bounding box computer vision to detect logo aspect ratio distortions, font size hierarchy compliance, and WCAG 2.1 color contrast across all design layers.
              </p>
            </div>

            <div style={{ background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: 10, padding: 14 }}>
              <div style={{ fontWeight: 700, color: "#67E8F9", fontSize: "0.92rem", marginBottom: 4 }}>
                2. Live Enterprise CMS / AI Pipeline Webhooks & Automated Web Crawler for Expired Facts
              </div>
              <p style={{ fontSize: "0.8rem", color: "#CBD5E1", lineHeight: "1.5" }}>
                Moving beyond pre-publish checks to continuous post-publish brand monitoring. An automated web crawler will periodically crawl published blogs, docs, and knowledge bases to flag statements that referenced facts that have subsequently expired in the Claim Ledger (e.g., outdated pricing, discontinued certifications).
              </p>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 10, padding: 14 }}>
              <div style={{ fontWeight: 700, color: "#6EE7B7", fontSize: "0.92rem", marginBottom: 4 }}>
                3. Role-Based Governance Workspace with Multi-Party Cryptographic Audit Signing
              </div>
              <p style={{ fontSize: "0.8rem", color: "#CBD5E1", lineHeight: "1.5" }}>
                Enterprise multi-user governance with role hierarchies (Content Creator, Agency Contributor, Brand Manager, Legal Counsel). High-risk claims (e.g. SEC financial projections or medical guarantees) will trigger multi-stakeholder threshold signing with immutable cryptographic hash chaining in the audit trail.
              </p>
            </div>
          </div>
        </div>

        {/* 30-Second Quick Test Instructions for Judges */}
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px dashed var(--border-accent)", borderRadius: 10, padding: 16 }}>
          <h4 style={{ fontSize: "0.88rem", color: "#FCD34D", marginBottom: 8 }}>
            ⚡ How to Test BrandGuard in 30 Seconds:
          </h4>
          <ol style={{ fontSize: "0.82rem", color: "#E2E8F0", paddingLeft: 20, lineHeight: "1.8" }}>
            <li><strong>Content Studio:</strong> Click <em>"1-Click Scenario 1 (AI Draft)"</em>. Notice the Trust Score (67/100) and the 6 grounded citations. Click <strong>"1-Click Apply All Fixes"</strong> — watch the score jump to 96/100!</li>
            <li><strong>Visual Inspector:</strong> Click <em>"1-Click Off-Brand Neon Banner"</em> to see prohibited color detection and WCAG contrast failures.</li>
            <li><strong>AI Guardrail API:</strong> Switch to <em>"AI Guardrail API"</em> tab, click <strong>"Send Request"</strong> to see live sub-100ms API response.</li>
          </ol>
        </div>

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button onClick={onClose} className="btn btn-primary">
            <span>Got It — Start Exploring</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
