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
    <div style={{ maxWidth: 1480, margin: "18px auto", padding: "0 24px" }}>
      {/* Top Banner Selection */}
      <div className="graphite-panel" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: "1.15rem", marginBottom: 3 }}>Visual Creative Asset Guardrail</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-silver)" }}>
            Inspect marketing banners, social graphics, and slides for approved color palettes, accessibility contrast, and logo rules.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => loadVisualTest("compliant")}
            className={`btn btn-sm ${activePreset === "compliant" ? "btn-primary" : "btn-secondary"}`}
          >
            <CheckCircle2 size={14} />
            <span>1-Click Compliant Banner</span>
          </button>

          <button
            onClick={() => loadVisualTest("offbrand")}
            className={`btn btn-sm ${activePreset === "offbrand" ? "btn-destructive" : "btn-secondary"}`}
          >
            <AlertTriangle size={14} />
            <span>1-Click Off-Brand Neon Banner</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 20, alignItems: "start" }}>
        
        {/* Left: Asset Preview & Color Extraction */}
        <div className="graphite-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-silver)", textTransform: "uppercase" }}>
              Asset Canvas Preview
            </span>
            <span className="badge badge-gold">
              {analysisResult?.dimensions || "800 x 400 px"} • Aspect Ratio: {analysisResult?.aspect_ratio || "2.0"}
            </span>
          </div>

          {/* Visual Canvas */}
          <div style={{
            width: "100%",
            height: 270,
            borderRadius: 8,
            border: "1px dashed var(--border-bronze)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: activePreset === "compliant"
              ? "radial-gradient(circle at 75% 50%, #06B6D4 0%, #0F172A 70%)"
              : "linear-gradient(135deg, #FFFF00 0%, #00FF00 100%)"
          }}>
            {activePreset === "compliant" ? (
              <div style={{
                background: "rgba(10, 11, 14, 0.88)",
                padding: "20px 32px",
                borderRadius: 12,
                border: "1.5px solid var(--accent-gold)",
                textAlign: "center",
                backdropFilter: "blur(8px)"
              }}>
                <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.4rem", fontFamily: "var(--font-heading)" }}>
                  NovaPulse Cloud
                </div>
                <div style={{ color: "var(--text-silver)", fontSize: "0.82rem", marginTop: 3 }}>
                  Audited SOC 2 Type II Enterprise Platform
                </div>
                <div style={{ marginTop: 12 }}>
                  <span style={{ background: "var(--accent-lime)", color: "#000", fontWeight: 700, padding: "4px 12px", borderRadius: 4, fontSize: "0.76rem" }}>
                    Verified Palette Compliant
                  </span>
                </div>
              </div>
            ) : (
              <div style={{
                background: "#FF00FF",
                padding: "20px 32px",
                borderRadius: 12,
                border: "3px solid #00FF00",
                textAlign: "center"
              }}>
                <div style={{ color: "#000000", fontWeight: 900, fontSize: "1.4rem" }}>
                  UNAPPROVED BANNER
                </div>
                <div style={{ color: "#FFFF00", fontSize: "0.82rem", fontWeight: 700, marginTop: 3 }}>
                  Uses Prohibited Neon Green & Harsh Yellow
                </div>
              </div>
            )}
          </div>

          {/* Extracted Color Palette Swatches */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-silver)", textTransform: "uppercase" }}>
                Extracted Dominant Color Swatches (Quantized K-Means)
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {analysisResult?.extracted_colors?.length || 0} dominant clusters
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 8 }}>
              {analysisResult?.extracted_colors?.map((hex, i) => (
                <div key={i} style={{ background: "#101319", borderRadius: 6, padding: 6, textAlign: "center", border: "1px solid var(--border-bronze)" }}>
                  <div style={{
                    width: "100%",
                    height: 32,
                    borderRadius: 4,
                    backgroundColor: hex,
                    border: "1px solid rgba(255,255,255,0.15)",
                    marginBottom: 5
                  }} />
                  <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{hex}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Approved Brand Tokens Reference */}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-bronze)" }}>
            <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--accent-gold-light)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Approved NovaPulse Brand Tokens
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { name: "Electric Indigo", hex: "#4F46E5", role: "Primary" },
                { name: "Cyber Cyan", hex: "#06B6D4", role: "Secondary" },
                { name: "Emerald Spark", hex: "#10B981", role: "Accent" },
                { name: "Midnight Slate", hex: "#0F172A", role: "Background" },
                { name: "Crisp Off-White", hex: "#F8FAFC", role: "Light Text" }
              ].map((token) => (
                <div key={token.hex} style={{ display: "flex", alignItems: "center", gap: 7, background: "#101319", padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: token.hex, border: "1px solid rgba(255,255,255,0.2)" }} />
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600 }}>{token.name}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{token.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Visual Score & Findings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Score Card */}
          <div className="graphite-panel" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-silver)", textTransform: "uppercase" }}>
                Visual Compliance Score
              </span>
              <span className={`badge ${isCompliant ? "badge-healthy" : "badge-critical"}`}>
                {isCompliant ? "Brand Compliant" : "Violations Detected"}
              </span>
            </div>

            <div style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: isCompliant ? "var(--accent-lime)" : "var(--status-critical)", lineHeight: 1 }}>
              {score}<span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/100</span>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div style={{ background: "#101319", padding: 10, borderRadius: 6, border: "1px solid var(--border-bronze)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-silver)" }}>WCAG Contrast</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: analysisResult?.contrast_ratio >= 4.5 ? "var(--accent-lime)" : "var(--status-warning)" }}>
                  {analysisResult?.contrast_ratio || 4.5}:1
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                  {analysisResult?.contrast_ratio >= 4.5 ? "Passes AA Standard" : "Below AA Standard (4.5:1)"}
                </div>
              </div>

              <div style={{ background: "#101319", padding: 10, borderRadius: 6, border: "1px solid var(--border-bronze)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-silver)" }}>Palette Delta-E</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: isCompliant ? "var(--accent-lime)" : "var(--status-critical)" }}>
                  {isCompliant ? "Within 18%" : "Deviation > 40"}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                  {isCompliant ? "Complies with tokens" : "Prohibited Colors"}
                </div>
              </div>
            </div>
          </div>

          {/* Issues / Findings */}
          <div className="graphite-panel" style={{ padding: 18 }}>
            <h3 style={{ fontSize: "0.9rem", marginBottom: 12, color: "var(--text-primary)" }}>
              Visual Findings ({analysisResult?.issues?.length || 0})
            </h3>

            {(!analysisResult?.issues || analysisResult.issues.length === 0) ? (
              <div style={{ textAlign: "center", padding: "20px 10px", color: "var(--text-silver)" }}>
                <CheckCircle2 size={28} color="var(--accent-lime)" style={{ margin: "0 auto 6px" }} />
                <p style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>Asset strictly adheres to NovaPulse visual standards.</p>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Approved for digital campaign distribution.</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {analysisResult.issues.map((iss, i) => (
                  <div key={i} style={{ background: "#101319", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: 6, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <span className="badge badge-critical">{iss.type}</span>
                      <span style={{ fontSize: "0.68rem", color: "#FDA4AF" }}>{iss.severity}</span>
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{iss.title}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-silver)", marginBottom: 6 }}>{iss.explanation}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--accent-lime)", background: "#0D0E12", padding: "4px 6px", borderRadius: 4 }}>
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
