import React, { useState, useEffect } from "react";
import { 
  Sparkles, AlertCircle, CheckCircle2, Clock, ShieldAlert, ArrowRight, 
  Send, RefreshCw, Wand2, FileText, Check, AlertTriangle, ExternalLink
} from "lucide-react";
import { checkTextContent } from "../utils/api";

const PRESET_SCENARIOS = [
  {
    name: "AI Draft: High Violations",
    title: "Q4 Social Campaign - AI Generated Copy",
    channel: "LinkedIn / X Ads",
    author: "AI Marketing Agent (GPT-4o)",
    text: "Our platform is trusted by 10,000 customers and is the best in class. We offer cheap starting tiers at $199/month with guaranteed ROI for all users!"
  },
  {
    name: "PR Draft: Fully Compliant",
    title: "Enterprise Expansion Press Release",
    channel: "PR Newswire",
    author: "Jessica Reed (Communications)",
    text: "NovaPulse announces verified SOC 2 Type II and HIPAA certifications, powering over 4,000 enterprise members with an industry-verified 99.95% uptime SLA."
  },
  {
    name: "Tech Blog: Expired & Jargon",
    title: "Latency Whitepaper Announcement",
    channel: "Engineering Blog",
    author: "Liam Taylor (DevRel)",
    text: "Nova Pulse delivers sub-50ms p95 streaming latency. Our game-changing synergy provides 100% secure analytics for enterprise cloud users."
  }
];

export default function ContentStudio({ onSubmitToQueue }) {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [title, setTitle] = useState(PRESET_SCENARIOS[0].title);
  const [channel, setChannel] = useState(PRESET_SCENARIOS[0].channel);
  const [author, setAuthor] = useState(PRESET_SCENARIOS[0].author);
  const [content, setContent] = useState(PRESET_SCENARIOS[0].text);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState("ALL");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Analyze content whenever content or channel changes
  const runAnalysis = async (textToAnalyze) => {
    setIsAnalyzing(true);
    try {
      const res = await checkTextContent(textToAnalyze, title, channel, author);
      setAnalysisResult(res);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis(content);
  }, []);

  const handleScenarioSelect = (index) => {
    setSelectedScenario(index);
    const scenario = PRESET_SCENARIOS[index];
    setTitle(scenario.title);
    setChannel(scenario.channel);
    setAuthor(scenario.author);
    setContent(scenario.text);
    runAnalysis(scenario.text);
  };

  // 1-Click apply single issue fix
  const handleApplySingleFix = (issue) => {
    if (!issue.original_text || !issue.suggested_fix) return;
    const newContent = content.replace(issue.original_text, issue.suggested_fix);
    setContent(newContent);
    runAnalysis(newContent);
  };

  // 1-Click apply all suggested fixes
  const handleApplyAllFixes = () => {
    if (!analysisResult?.suggested_full_text) return;
    setContent(analysisResult.suggested_full_text);
    runAnalysis(analysisResult.suggested_full_text);
  };

  const handleQueueSubmit = () => {
    if (onSubmitToQueue) {
      onSubmitToQueue({
        title,
        channel,
        author,
        content,
        score: analysisResult?.score || 50,
        status: (analysisResult?.score || 0) >= 90 ? "APPROVED" : "FLAGGED"
      });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const score = analysisResult?.score ?? 70;
  const issues = analysisResult?.issues ?? [];
  const supported = analysisResult?.supported_claims ?? [];
  const catScores = analysisResult?.category_scores ?? { claims: 75, voice: 80, policy: 70, freshness: 85 };

  const filteredIssues = activeCategoryTab === "ALL" 
    ? issues 
    : issues.filter((i) => i.category === activeCategoryTab);

  const getScoreColor = (s) => {
    if (s >= 90) return "#10B981"; // Emerald
    if (s >= 70) return "#F59E0B"; // Amber
    return "#EF4444"; // Rose / Red
  };

  const scoreColor = getScoreColor(score);

  return (
    <div style={{ maxWidth: 1440, margin: "24px auto", padding: "0 24px" }}>
      {/* Top Scenario Pills for Judges */}
      <div className="glass-panel" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--brand-cyan)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            1-Click Judge Scenarios:
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PRESET_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.name}
                onClick={() => handleScenarioSelect(idx)}
                className={`btn btn-sm ${selectedScenario === idx ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.8rem", padding: "5px 12px" }}
              >
                <span>{sc.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="badge badge-purple" style={{ textTransform: "none", fontSize: "0.75rem" }}>
            Fictional Brand: <strong>NovaPulse Cloud</strong>
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 24, alignItems: "start" }}>
        
        {/* Left Column: Content Editor & Controls */}
        <div className="glass-panel" style={{ padding: 24 }}>
          {/* Metadata Controls */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>
                Content Title
              </label>
              <input
                type="text"
                className="input-text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Feature Launch"
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>
                Publishing Channel
              </label>
              <select
                className="select-input"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                <option value="LinkedIn / X Ads">LinkedIn / X Ads</option>
                <option value="PR Newswire">PR Newswire / Official</option>
                <option value="Engineering Blog">Engineering Blog</option>
                <option value="Website Copy">Website Landing Page</option>
                <option value="AI Output">AI Writing Tool (Direct API)</option>
              </select>
            </div>
          </div>

          {/* Text Editor Area */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)" }}>
                Draft Content (Editable in Real-Time)
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                {content.length} chars • {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              className="textarea-input"
              rows={9}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                runAnalysis(e.target.value);
              }}
              placeholder="Paste or write your marketing copy, blog draft, or AI generated text here..."
              style={{
                fontSize: "0.95rem",
                lineHeight: "1.7",
                resize: "vertical"
              }}
            />
          </div>

          {/* Action Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => runAnalysis(content)}
                className="btn btn-secondary"
                disabled={isAnalyzing}
              >
                <RefreshCw size={15} className={isAnalyzing ? "pulse-glow" : ""} />
                <span>{isAnalyzing ? "Scanning..." : "Re-Verify Draft"}</span>
              </button>

              {issues.length > 0 && (
                <button
                  onClick={handleApplyAllFixes}
                  className="btn btn-emerald"
                  title="Applies all non-overlapping suggested replacements at once"
                >
                  <Wand2 size={16} />
                  <span>1-Click Apply All Fixes</span>
                </button>
              )}
            </div>

            <button
              onClick={handleQueueSubmit}
              className="btn btn-primary"
            >
              <Send size={15} />
              <span>Submit to Review Queue</span>
            </button>
          </div>

          {showSuccessToast && (
            <div style={{
              marginTop: 16,
              padding: "10px 16px",
              borderRadius: 8,
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#6EE7B7",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <CheckCircle2 size={16} />
              <span>Draft successfully dispatched to Reviewer Queue with score {score}/100!</span>
            </div>
          )}

          {/* Live Diff / Preview if fixes exist */}
          {issues.length > 0 && analysisResult?.suggested_full_text && (
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--brand-emerald)" }}>
                  💡 Proposed 1-Click Correction:
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  Fixes {issues.length} flagged deviations
                </span>
              </div>
              <div style={{
                background: "rgba(16, 185, 129, 0.06)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: "0.88rem",
                color: "#E2E8F0",
                lineHeight: "1.6"
              }}>
                {analysisResult.suggested_full_text}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Brand Trust Score & Grounded Explanations */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Trust Score Card */}
          <div className="glass-panel" style={{ padding: 24, textAlign: "center", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Brand Trust Score
              </span>
              <span className={`badge ${score >= 90 ? "badge-success" : (score >= 70 ? "badge-warning" : "badge-error")}`}>
                {score >= 90 ? "Ready to Publish" : (score >= 70 ? "Needs Human Review" : "Critical Issues")}
              </span>
            </div>

            {/* Circular Gauge Display */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", margin: "10px 0" }}>
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r="62"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="12"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="62"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="12"
                  strokeDasharray={390}
                  strokeDashoffset={390 - (390 * score) / 100}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
                  transform="rotate(-90 75 75)"
                />
              </svg>
              <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: scoreColor }}>
                  {score}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  out of 100
                </span>
              </div>
            </div>

            {/* 4 Category Breakdown Progress Bars */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18, textAlign: "left" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                  <span style={{ color: "var(--text-muted)" }}>Claims (35%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.claims) }}>{catScores.claims}%</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.claims}%`, height: "100%", background: getScoreColor(catScores.claims), transition: "width 0.4s ease" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                  <span style={{ color: "var(--text-muted)" }}>Voice & Tone (25%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.voice) }}>{catScores.voice}%</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.voice}%`, height: "100%", background: getScoreColor(catScores.voice), transition: "width 0.4s ease" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                  <span style={{ color: "var(--text-muted)" }}>Policy & Legal (25%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.policy) }}>{catScores.policy}%</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.policy}%`, height: "100%", background: getScoreColor(catScores.policy), transition: "width 0.4s ease" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                  <span style={{ color: "var(--text-muted)" }}>Freshness (15%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.freshness) }}>{catScores.freshness}%</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.freshness}%`, height: "100%", background: getScoreColor(catScores.freshness), transition: "width 0.4s ease" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Findings & Grounded Explanations */}
          <div className="glass-panel" style={{ padding: 20 }}>
            {/* Filter Tabs */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["ALL", "CLAIMS", "VOICE", "POLICY", "FRESHNESS"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryTab(cat)}
                    style={{
                      border: "none",
                      background: activeCategoryTab === cat ? "rgba(99, 102, 241, 0.25)" : "transparent",
                      color: activeCategoryTab === cat ? "#A5B4FC" : "var(--text-muted)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                {issues.length} {issues.length === 1 ? "issue" : "issues"} flagged
              </span>
            </div>

            {/* Issues List */}
            {filteredIssues.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 16px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={36} color="#10B981" style={{ margin: "0 auto 10px" }} />
                <h4 style={{ color: "#E2E8F0", marginBottom: 4 }}>Zero Issues in this Category!</h4>
                <p style={{ fontSize: "0.82rem" }}>All draft statements conform to approved brand guidelines.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: 480, overflowY: "auto", paddingRight: 4 }}>
                {filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      border: `1px solid ${issue.severity === "ERROR" ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                      borderRadius: 10,
                      padding: 14,
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <span className={`badge ${issue.severity === "ERROR" ? "badge-error" : "badge-warning"}`}>
                            {issue.severity}
                          </span>
                          <span className="badge badge-info">
                            {issue.category}
                          </span>
                        </div>
                        <h4 style={{ fontSize: "0.92rem", color: "#F8FAFC" }}>{issue.title}</h4>
                      </div>

                      {issue.suggested_fix && (
                        <button
                          onClick={() => handleApplySingleFix(issue)}
                          className="btn btn-emerald btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.75rem", gap: 4 }}
                          title="Apply this specific fix into the editor"
                        >
                          <Check size={13} />
                          <span>Fix</span>
                        </button>
                      )}
                    </div>

                    <p style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: "1.5", marginBottom: 10 }}>
                      {issue.explanation}
                    </p>

                    {/* Grounded Citation & Source */}
                    <div style={{
                      background: "rgba(0, 0, 0, 0.25)",
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: "0.76rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      borderLeft: "3px solid var(--brand-primary)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#A5B4FC" }}>
                        <span><strong>Source:</strong> {issue.source}</span>
                        {issue.owner && <span><strong>Owner:</strong> {issue.owner}</span>}
                      </div>
                      {issue.suggested_fix && (
                        <div style={{ color: "#6EE7B7" }}>
                          <strong>Approved Fix:</strong> "{issue.suggested_fix}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Supported & Verified Claims Section */}
            {supported.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10B981", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <CheckCircle2 size={15} /> Verified & Supported Claims ({supported.length})
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {supported.map((sup, idx) => (
                    <div key={idx} style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 6, padding: "8px 12px", fontSize: "0.8rem", color: "#E2E8F0" }}>
                      <span>Verified: <strong>"{sup.text}"</strong></span>
                      <div style={{ fontSize: "0.72rem", color: "#6EE7B7", marginTop: 2 }}>
                        Matched Ledger {sup.ledger_id} • {sup.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
