import React, { useState, useEffect } from "react";
import { Image as ImageIcon, ShieldCheck, AlertTriangle, CheckCircle2, Eye, Droplet, Sparkles, Sliders } from "lucide-react";
import { checkVisualSample } from "../utils/api";

export default function VisualInspector() {
  const [activePreset, setActivePreset] = useState("compliant");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadVisualTest = async (type) => {
    setActivePreset(type);
    setLoading(true);
    try {
      const data = await checkVisualSample(type);
      setAnalysisResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisualTest("compliant");
  }, []);

  const score = analysisResult?.score ?? 90;
  const isCompliant = score >= 80;

  return (
    <div style={{ maxWidth: 1440, margin: "24px auto", padding: "0 24px" }}>
      {/* Top Banner Selection */}
      <div className="glass-panel" style={{ padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Visual Creative Asset Guardrail</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Inspect marketing banners, social graphics, and slides for approved color palettes, accessibility contrast, and logo rules.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => loadVisualTest("compliant")}
            className={`btn btn-sm ${activePreset === "compliant" ? "btn-emerald" : "btn-secondary"}`}
          >
            <CheckCircle2 size={15} />
            <span>1-Click Compliant Banner</span>
          </button>

          <button
            onClick={() => loadVisualTest("offbrand")}
            className={`btn btn-sm ${activePreset === "offbrand" ? "btn-primary" : "btn-secondary"}`}
          >
            <AlertTriangle size={15} />
            <span>1-Click Off-Brand Neon Banner</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24, alignItems: "start" }}>
        
        {/* Left: Asset Preview & Color Extraction */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Asset Canvas Preview
            </span>
            <span className="badge badge-info">
              {analysisResult?.dimensions || "800 x 400 px"} • Aspect Ratio: {analysisResult?.aspect_ratio || "2.0"}
            </span>
          </div>

          {/* Simulated Image Display Canvas */}
          <div style={{
            width: "100%",
            height: 280,
            borderRadius: 12,
            border: "2px dashed var(--border-subtle)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: activePreset === "compliant"
              ? "radial-gradient(circle at 75% 50%, #06B6D4 0%, #0F172A 70%)"
              : "linear-gradient(135deg, #FFFF00 0%, #00FF00 100%)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)"
          }}>
            {activePreset === "compliant" ? (
              <div style={{
                background: "rgba(15, 23, 42, 0.85)",
                padding: "24px 36px",
                borderRadius: 16,
                border: "2px solid #4F46E5",
                textAlign: "center",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{ color: "#4F46E5", fontWeight: 800, fontSize: "1.6rem", fontFamily: "var(--font-heading)" }}>
                  NovaPulse Cloud
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.88rem", marginTop: 4 }}>
                  Audited SOC 2 Type II Enterprise Platform
                </div>
                <div style={{ marginTop: 14 }}>
                  <span style={{ background: "#10B981", color: "#000", fontWeight: 700, padding: "6px 14px", borderRadius: 8, fontSize: "0.8rem" }}>
                    Verified Palette Compliant
                  </span>
                </div>
              </div>
            ) : (
              <div style={{
                background: "#FF00FF",
                padding: "24px 36px",
                borderRadius: 16,
                border: "4px solid #00FF00",
                textAlign: "center"
              }}>
                <div style={{ color: "#000000", fontWeight: 900, fontSize: "1.6rem" }}>
                  UNAPPROVED BANNER
                </div>
                <div style={{ color: "#FFFF00", fontSize: "0.9rem", fontWeight: 700, marginTop: 4 }}>
                  Uses Prohibited Neon Green & Harsh Yellow
                </div>
              </div>
            )}
          </div>

          {/* Extracted Color Palette Swatches */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Extracted Dominant Color Swatches (Quantized K-Means)
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                {analysisResult?.extracted_colors?.length || 0} dominant clusters
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(85px, 1fr))", gap: 10 }}>
              {analysisResult?.extracted_colors?.map((hex, i) => (
                <div key={i} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 8, textAlign: "center", border: "1px solid var(--border-subtle)" }}>
                  <div style={{
                    width: "100%",
                    height: 38,
                    borderRadius: 6,
                    backgroundColor: hex,
                    border: "1px solid rgba(255,255,255,0.2)",
                    marginBottom: 6
                  }} />
                  <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#F8FAFC" }}>{hex}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Approved Brand Palette Reference */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--brand-cyan)", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
              Approved NovaPulse Brand Tokens
            </span>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { name: "Electric Indigo", hex: "#4F46E5", role: "Primary" },
                { name: "Cyber Cyan", hex: "#06B6D4", role: "Secondary" },
                { name: "Emerald Spark", hex: "#10B981", role: "Accent" },
                { name: "Midnight Slate", hex: "#0F172A", role: "Background" },
                { name: "Crisp Off-White", hex: "#F8FAFC", role: "Light Text" }
              ].map((token) => (
                <div key={token.hex} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", padding: "5px 10px", borderRadius: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: token.hex, border: "1px solid rgba(255,255,255,0.2)" }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>{token.name}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{token.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Visual Score & Findings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Score Card */}
          <div className="glass-panel" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Visual Compliance Score
              </span>
              <span className={`badge ${isCompliant ? "badge-success" : "badge-error"}`}>
                {isCompliant ? "Brand Compliant" : "Violations Detected"}
              </span>
            </div>

            <div style={{ fontSize: "3rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: isCompliant ? "#10B981" : "#EF4444" }}>
              {score}<span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>/100</span>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div style={{ background: "rgba(0,0,0,0.25)", padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>WCAG Contrast Ratio</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: analysisResult?.contrast_ratio >= 4.5 ? "#10B981" : "#F59E0B" }}>
                  {analysisResult?.contrast_ratio || 4.5}:1
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>
                  {analysisResult?.contrast_ratio >= 4.5 ? "Passes WCAG AA" : "Below AA Standard (4.5:1)"}
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.25)", padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Palette Alignment</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: isCompliant ? "#10B981" : "#EF4444" }}>
                  {isCompliant ? "96% Match" : "Delta-E > 40"}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>
                  {isCompliant ? "Within 18% Delta-E tolerance" : "Prohibited Colors Found"}
                </div>
              </div>
            </div>
          </div>

          {/* Issues / Findings List */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <h3 style={{ fontSize: "0.95rem", marginBottom: 14, color: "#F8FAFC" }}>
              Visual Asset Inspection Findings ({analysisResult?.issues?.length || 0})
            </h3>

            {(!analysisResult?.issues || analysisResult.issues.length === 0) ? (
              <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={32} color="#10B981" style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: "0.85rem", color: "#E2E8F0" }}>Asset strictly adheres to NovaPulse visual standards.</p>
                <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Approved for social campaigns and web publication.</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {analysisResult.issues.map((iss, i) => (
                  <div key={i} style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span className="badge badge-error">{iss.type}</span>
                      <span style={{ fontSize: "0.72rem", color: "#FCA5A5" }}>{iss.severity}</span>
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>{iss.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#CBD5E1", marginBottom: 8 }}>{iss.explanation}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6EE7B7", background: "rgba(0,0,0,0.3)", padding: "6px 8px", borderRadius: 6 }}>
                      <strong>Suggested Fix:</strong> {iss.suggested_fix}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
