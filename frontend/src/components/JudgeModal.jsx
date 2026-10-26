import React from "react";
import { Award, CheckCircle2, ShieldCheck, Zap, Layers, Sparkles, X, ArrowRight, UserCheck } from "lucide-react";

export default function JudgeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(10, 11, 14, 0.88)",
      backdropFilter: "blur(14px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200,
      padding: 20
    }}>
      <div className="graphite-panel" style={{
        width: "100%",
        maxWidth: 820,
        maxHeight: "90vh",
        overflowY: "auto",
        padding: 28,
        position: "relative",
        border: "1.5px solid var(--accent-gold)",
        boxShadow: "0 0 40px rgba(197, 160, 89, 0.15)"
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
            color: "var(--text-silver)",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "rgba(197, 160, 89, 0.15)",
            border: "1.5px solid var(--accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Award size={24} color="var(--accent-gold)" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.35rem", color: "var(--text-primary)" }}>Round 2 Submission Guide for Judges</h2>
            <div style={{ fontSize: "0.8rem", color: "var(--text-silver)" }}>
              Team: <strong style={{ color: "var(--accent-gold-light)" }}>GIRL CODER</strong> • Solo Participant: <strong>Varshini Uppada</strong>
            </div>
          </div>
        </div>

        {/* Evaluation Criteria Scorecard */}
        <div style={{ background: "#11141B", border: "1px solid var(--border-bronze)", borderRadius: 8, padding: 16, marginBottom: 18 }}>
          <h4 style={{ fontSize: "0.82rem", color: "var(--accent-gold-light)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Round 2 Evaluation Coverage (100 Points Total)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
            <div style={{ background: "#0E1015", padding: 10, borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-lime)" }}>Core Workflow Runs (30 pts)</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>End-to-end draft scan, claim citations, 1-click fixes, approval workflow.</div>
            </div>
            <div style={{ background: "#0E1015", padding: 10, borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-lime)" }}>Technical Depth (25 pts)</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>FastAPI + grounded ledger + WCAG contrast + fallback zero-downtime engine.</div>
            </div>
            <div style={{ background: "#0E1015", padding: 10, borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-lime)" }}>Progress from Round 1 (20 pts)</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Built all promised Must-have features from the proposal document.</div>
            </div>
            <div style={{ background: "#0E1015", padding: 10, borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-lime)" }}>3 Planned Improvements (15 pts)</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Meaningful, substantial additions specified for Round 3 finish.</div>
            </div>
            <div style={{ background: "#0E1015", padding: 10, borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-lime)" }}>Usability & Self-Service (10 pts)</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Obsidian Luxe UI with 1-click scenario buttons for effortless judge testing.</div>
            </div>
          </div>
        </div>

        {/* The 3 Major Improvements for Round 3 (Mandatory Criterion: 15 Points) */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
            <Sparkles size={16} color="var(--accent-gold)" />
            <span>The Three Major Improvements for Round 3</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#11141B", border: "1px solid var(--border-bronze)", borderRadius: 6, padding: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--accent-gold-light)", fontSize: "0.88rem", marginBottom: 3 }}>
                1. Multi-Modal Figma/Canva & Slide Layout Engine with Automated Logo Clearspace Verification
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-silver)", lineHeight: "1.5" }}>
                Expanding the visual engine from single raster images to multi-layer vector canvas files (Figma tokens, Canva exports, PDF pitch decks). It will automatically run bounding box computer vision to detect logo aspect ratio distortions, font size hierarchy compliance, and WCAG 2.1 color contrast across all design layers.
              </p>
            </div>

            <div style={{ background: "#11141B", border: "1px solid var(--border-bronze)", borderRadius: 6, padding: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--accent-gold-light)", fontSize: "0.88rem", marginBottom: 3 }}>
                2. Live Enterprise CMS / AI Pipeline Webhooks & Automated Web Crawler for Expired Facts
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-silver)", lineHeight: "1.5" }}>
                Moving beyond pre-publish checks to continuous post-publish brand monitoring. An automated web crawler will periodically crawl published blogs, docs, and knowledge bases to flag statements that referenced facts that have subsequently expired in the Claim Ledger (e.g., outdated pricing, discontinued certifications).
              </p>
            </div>

            <div style={{ background: "#11141B", border: "1px solid var(--border-bronze)", borderRadius: 6, padding: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--accent-gold-light)", fontSize: "0.88rem", marginBottom: 3 }}>
                3. Role-Based Governance Workspace with Multi-Party Cryptographic Audit Signing
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-silver)", lineHeight: "1.5" }}>
                Enterprise multi-user governance with role hierarchies (Content Creator, Agency Contributor, Brand Manager, Legal Counsel). High-risk claims (e.g. SEC financial projections or medical guarantees) will trigger multi-stakeholder threshold signing with immutable cryptographic hash chaining in the audit trail.
              </p>
            </div>
          </div>
        </div>

        {/* 30-Second Quick Test Instructions for Judges */}
        <div style={{ background: "#0E1015", border: "1px dashed var(--border-bronze)", borderRadius: 6, padding: 14 }}>
          <h4 style={{ fontSize: "0.84rem", color: "var(--accent-lime)", marginBottom: 6 }}>
            ⚡ How to Test BrandGuard in 30 Seconds:
          </h4>
          <ol style={{ fontSize: "0.78rem", color: "var(--text-warm)", paddingLeft: 18, lineHeight: "1.8" }}>
            <li><strong>Content Editor:</strong> Click <em>"Scenario 1: AI Marketing Draft"</em>. Observe the score (68/100) and the 4 grounded citations. Click <strong>"Improve with AI (Quick Apply)"</strong> — watch the score elevate to 97/100!</li>
            <li><strong>Visual Assets:</strong> Click <em>"1-Click Off-Brand Neon Banner"</em> to see prohibited color detection and WCAG contrast failures.</li>
            <li><strong>AI Guardrail API:</strong> Switch to <em>"AI Guardrail API"</em> tab, click <strong>"Send Request"</strong> to see live sub-100ms API response.</li>
          </ol>
        </div>

        <div style={{ marginTop: 18, textAlign: "right" }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            <span>Got It — Start Exploring</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
