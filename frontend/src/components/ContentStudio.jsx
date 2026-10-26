import React, { useState, useEffect } from "react";
import { 
  Sparkles, AlertCircle, CheckCircle2, Clock, ShieldAlert, ArrowRight, 
  Send, RefreshCw, Wand2, FileText, Check, AlertTriangle, ExternalLink,
  Bold, Italic, Link2, List, Quote, RotateCcw, Columns, Edit3, Shield
} from "lucide-react";
import { checkTextContent } from "../utils/api";

const PRESET_SCENARIOS = [
  {
    name: "Scenario 1: AI Marketing Draft",
    tag: "High Violations",
    title: "Q4 Social Campaign - AI Generated Copy",
    channel: "LinkedIn / X Ads",
    author: "AI Marketing Agent (GPT-4o)",
    text: "Our platform is trusted by 10,000 customers and is the best in class. We offer cheap starting tiers at $199/month with guaranteed ROI for all users!"
  },
  {
    name: "Scenario 2: Cloud Press Release",
    tag: "Audited & Compliant",
    title: "Enterprise Expansion Press Release",
    channel: "PR Newswire",
    author: "Jessica Reed (Communications)",
    text: "NovaPulse announces verified SOC 2 Type II and HIPAA certifications, powering over 4,000 enterprise members with an industry-verified 99.95% uptime SLA."
  },
  {
    name: "Scenario 3: Developer Blog",
    tag: "Expired Benchmark & SLA",
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
  const [originalContent, setOriginalContent] = useState(PRESET_SCENARIOS[0].text);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState("ALL");
  const [showDiffView, setShowDiffView] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Recalculate score & issues whenever content changes
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
    setOriginalContent(scenario.text);
    runAnalysis(scenario.text);
  };

  // 1-Click resolve single issue
  const handleApplySingleFix = (issue) => {
    if (!issue.original_text || !issue.suggested_fix) return;
    const newContent = content.replace(issue.original_text, issue.suggested_fix);
    setContent(newContent);
    runAnalysis(newContent);
    showToast(`Applied fix for: "${issue.original_text}" ➔ "${issue.suggested_fix}"`);
  };

  // 1-Click Quick Apply All AI Fixes
  const handleApplyAllFixes = () => {
    if (!analysisResult?.suggested_full_text) return;
    setOriginalContent(content); // Save for undo
    setContent(analysisResult.suggested_full_text);
    runAnalysis(analysisResult.suggested_full_text);
    showToast("Quick Apply AI Fixes: Applied all recommended brand alignments!");
  };

  // Undo AI Fixes
  const handleUndoFixes = () => {
    setContent(originalContent);
    runAnalysis(originalContent);
    showToast("Reverted draft back to original version.");
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
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const score = analysisResult?.score ?? 70;
  const issues = analysisResult?.issues ?? [];
  const supported = analysisResult?.supported_claims ?? [];
  const catScores = analysisResult?.category_scores ?? { claims: 75, voice: 80, policy: 70, freshness: 85 };

  const filteredIssues = activeCategoryTab === "ALL" 
    ? issues 
    : issues.filter((i) => i.category === activeCategoryTab);

  // Strict meaningful status colors: Coral Red <70, Amber 70-89, Lime >=90
  const getScoreColor = (s) => {
    if (s >= 90) return "var(--accent-lime)";
    if (s >= 70) return "var(--status-warning)";
    return "var(--status-critical)";
  };

  const scoreColor = getScoreColor(score);

  // Status state
  const getStatusBadge = () => {
    if (isAnalyzing) return <span className="badge badge-neutral"><span className="pulse-dot-lime" /> Analyzing...</span>;
    if (score >= 90) return <span className="badge badge-healthy"><CheckCircle2 size={12} /> Approved / Compliant</span>;
    if (score >= 70) return <span className="badge badge-warning"><AlertTriangle size={12} /> Needs Review</span>;
    return <span className="badge badge-critical"><AlertCircle size={12} /> Critical Issues</span>;
  };

  return (
    <div style={{ maxWidth: 1480, margin: "18px auto", padding: "0 24px" }}>
      
      {/* Scenario Selector: Slim horizontal bar */}
      <div style={{
        background: "rgba(16, 19, 25, 0.8)",
        border: "1px solid var(--border-bronze)",
        borderRadius: 8,
        padding: "8px 16px",
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-gold-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Demo Scenarios:
          </span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PRESET_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.name}
                onClick={() => handleScenarioSelect(idx)}
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  borderRadius: 4,
                  border: selectedScenario === idx ? "1px solid var(--accent-lime)" : "1px solid var(--border-subtle)",
                  background: selectedScenario === idx ? "rgba(196, 248, 42, 0.12)" : "rgba(22, 26, 34, 0.6)",
                  color: selectedScenario === idx ? "var(--accent-lime)" : "var(--text-silver)",
                  cursor: "pointer",
                  fontWeight: selectedScenario === idx ? 700 : 500,
                  transition: "all 0.15s ease"
                }}
              >
                <span>{sc.name}</span>
                <span style={{ fontSize: "0.68rem", opacity: 0.7, marginLeft: 4 }}>({sc.tag})</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-silver)" }}>
            <span className="pulse-dot-lime" />
            <span>Live Guardrail: <strong>Active</strong></span>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Main Workspace Grid: 56% Left Editor, 44% Right Score & Issues */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 1fr",
        gap: 20,
        alignItems: "start"
      }}>
        
        {/* =========================================================================
            LEFT COLUMN: CONTENT EDITOR (~56% width)
            Graphite background, bronze borders, formatting bar, live indicator
           ========================================================================= */}
        <div className="graphite-panel" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Editor Header: Title & Publishing Channel separation */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 12,
            paddingBottom: 14,
            borderBottom: "1px solid var(--border-bronze)"
          }}>
            <div>
              <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-silver)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                Content Title
              </label>
              <input
                type="text"
                className="input-text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title..."
                style={{ fontSize: "0.88rem", fontWeight: 600 }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-silver)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                Publishing Channel
              </label>
              <select
                className="select-input"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                style={{ fontSize: "0.85rem" }}
              >
                <option value="LinkedIn / X Ads">LinkedIn / X Ads</option>
                <option value="PR Newswire">PR Newswire / Release</option>
                <option value="Engineering Blog">Engineering Blog</option>
                <option value="Website Copy">Website Landing Page</option>
                <option value="AI Output">Direct AI Pipeline Output</option>
              </select>
            </div>
          </div>

          {/* Compact Formatting Toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#11141B",
            border: "1px solid var(--border-bronze)",
            borderRadius: 6,
            padding: "5px 10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[
                { icon: Bold, label: "Bold" },
                { icon: Italic, label: "Italic" },
                { icon: Link2, label: "Link" },
                { icon: List, label: "Bullet list" },
                { icon: Quote, label: "Quote" }
              ].map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 4,
                      background: "transparent",
                      border: "none",
                      color: "var(--text-silver)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title={tool.label}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}

              <div style={{ width: 1, height: 16, background: "var(--border-bronze)", margin: "0 6px" }} />

              {/* Diff Toggle */}
              <button
                type="button"
                onClick={() => setShowDiffView(!showDiffView)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: "0.74rem",
                  padding: "3px 8px",
                  borderRadius: 4,
                  border: showDiffView ? "1px solid var(--accent-lime)" : "1px solid var(--border-subtle)",
                  background: showDiffView ? "rgba(196, 248, 42, 0.12)" : "transparent",
                  color: showDiffView ? "var(--accent-lime)" : "var(--text-silver)",
                  cursor: "pointer"
                }}
              >
                <Columns size={12} />
                <span>{showDiffView ? "Hide Diff" : "Before & After Diff"}</span>
              </button>
            </div>

            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {content.length} chars • {content.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* Text Area / Diff View */}
          {showDiffView ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--status-critical)", fontWeight: 700, display: "block", marginBottom: 4 }}>
                  ORIGINAL DRAFT (BEFORE)
                </span>
                <div style={{
                  background: "#0D0E12",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  borderRadius: 6,
                  padding: 12,
                  fontSize: "0.85rem",
                  color: "#FDA4AF",
                  lineHeight: "1.6",
                  minHeight: 180
                }}>
                  {originalContent}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--accent-lime)", fontWeight: 700, display: "block", marginBottom: 4 }}>
                  AI-ALIGNED VERSION (AFTER)
                </span>
                <div style={{
                  background: "#0D0E12",
                  border: "1px solid rgba(196, 248, 42, 0.3)",
                  borderRadius: 6,
                  padding: 12,
                  fontSize: "0.85rem",
                  color: "#E2E5EC",
                  lineHeight: "1.6",
                  minHeight: 180
                }}>
                  {analysisResult?.suggested_full_text || content}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <textarea
                className="textarea-input"
                rows={9}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  runAnalysis(e.target.value);
                }}
                placeholder="Write or paste copy here..."
                style={{
                  fontSize: "0.92rem",
                  lineHeight: "1.7",
                  fontFamily: "var(--font-sans)",
                  color: "var(--text-warm)",
                  resize: "vertical"
                }}
              />
            </div>
          )}

          {/* Issue highlighting summary pill tags */}
          {issues.length > 0 && !showDiffView && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              padding: "8px 10px",
              background: "#101319",
              borderRadius: 6,
              border: "1px solid var(--border-bronze)"
            }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-silver)", fontWeight: 700 }}>
                Flagged in Editor:
              </span>
              {issues.slice(0, 4).map((iss) => (
                <span
                  key={iss.id}
                  onClick={() => handleApplySingleFix(iss)}
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 7px",
                    borderRadius: 4,
                    background: iss.severity === "ERROR" ? "rgba(244, 63, 94, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: iss.severity === "ERROR" ? "#FDA4AF" : "#FCD34D",
                    border: `1px solid ${iss.severity === "ERROR" ? "rgba(244, 63, 94, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                    cursor: "pointer"
                  }}
                  title="Click to resolve this specific phrase"
                >
                  "{iss.original_text}" ➔ {iss.suggested_fix}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Editor Action Bar: Three consistent button styles */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            paddingTop: 8,
            borderTop: "1px solid var(--border-bronze)"
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Secondary Button: Transparent charcoal with bronze border */}
              <button
                type="button"
                onClick={() => runAnalysis(content)}
                className="btn btn-secondary"
                disabled={isAnalyzing}
              >
                <RefreshCw size={14} className={isAnalyzing ? "pulse-dot-lime" : ""} />
                <span>{isAnalyzing ? "Analyzing..." : "Verify Draft"}</span>
              </button>

              {/* Primary: Neon Lime Quick Apply AI Fixes */}
              {issues.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyAllFixes}
                  className="btn btn-primary"
                  title="Applies all non-overlapping suggested replacements in one click"
                >
                  <Wand2 size={15} />
                  <span>Improve with AI (Quick Apply)</span>
                </button>
              )}

              {/* Undo Button */}
              {content !== originalContent && (
                <button
                  type="button"
                  onClick={handleUndoFixes}
                  className="btn btn-secondary"
                  title="Revert back to original text"
                  style={{ fontSize: "0.78rem" }}
                >
                  <RotateCcw size={13} />
                  <span>Undo AI Fixes</span>
                </button>
              )}
            </div>

            {/* Submit to review */}
            <button
              type="button"
              onClick={handleQueueSubmit}
              className="btn btn-secondary"
              style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold-light)" }}
            >
              <Send size={14} />
              <span>Submit for Review</span>
            </button>
          </div>

          {toastMessage && (
            <div style={{
              padding: "8px 12px",
              borderRadius: 6,
              background: "rgba(196, 248, 42, 0.1)",
              border: "1px solid var(--border-lime)",
              color: "var(--accent-lime)",
              fontSize: "0.78rem",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <Check size={14} />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>


        {/* =========================================================================
            RIGHT COLUMN: BRAND TRUST SCORE & STRUCTURED ISSUES PANEL (~44% width)
           ========================================================================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* D. Brand Trust Score Card */}
          <div className="graphite-panel" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-silver)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Brand Trust Score
              </span>
              {getStatusBadge()}
            </div>

            {/* Prominent Circular Gauge */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", margin: "4px 0 10px" }}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r="54"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="10"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="54"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeDasharray={340}
                  strokeDashoffset={340 - (340 * score) / 100}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
                  transform="rotate(-90 65 65)"
                />
              </svg>
              <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: scoreColor, lineHeight: 1 }}>
                  {score}
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", marginTop: 2 }}>
                  / 100 Index
                </span>
              </div>
            </div>

            {/* Thin Category Progress Bars with Meaningful Severity Colors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, textAlign: "left" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 3 }}>
                  <span style={{ color: "var(--text-silver)" }}>Claims (35%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.claims) }}>{catScores.claims}%</span>
                </div>
                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.claims}%`, height: "100%", background: getScoreColor(catScores.claims), transition: "width 0.3s ease" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 3 }}>
                  <span style={{ color: "var(--text-silver)" }}>Voice & Tone (25%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.voice) }}>{catScores.voice}%</span>
                </div>
                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.voice}%`, height: "100%", background: getScoreColor(catScores.voice), transition: "width 0.3s ease" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 3 }}>
                  <span style={{ color: "var(--text-silver)" }}>Policy & Legal (25%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.policy) }}>{catScores.policy}%</span>
                </div>
                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.policy}%`, height: "100%", background: getScoreColor(catScores.policy), transition: "width 0.3s ease" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 3 }}>
                  <span style={{ color: "var(--text-silver)" }}>Freshness (15%)</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(catScores.freshness) }}>{catScores.freshness}%</span>
                </div>
                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${catScores.freshness}%`, height: "100%", background: getScoreColor(catScores.freshness), transition: "width 0.3s ease" }} />
                </div>
              </div>
            </div>
          </div>


          {/* E. Structured Issues Review Panel with Subtle Dividers */}
          <div className="graphite-panel" style={{ padding: 18, flex: 1 }}>
            
            {/* Filter Tabs */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border-bronze)",
              paddingBottom: 10,
              marginBottom: 12
            }}>
              <div style={{ display: "flex", gap: 4 }}>
                {["ALL", "CLAIMS", "VOICE", "POLICY", "FRESHNESS"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryTab(cat)}
                    style={{
                      border: "none",
                      background: activeCategoryTab === cat ? "rgba(197, 160, 89, 0.2)" : "transparent",
                      color: activeCategoryTab === cat ? "var(--accent-gold-light)" : "var(--text-muted)",
                      padding: "3px 7px",
                      borderRadius: 4,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {issues.length} {issues.length === 1 ? "issue" : "issues"}
              </span>
            </div>

            {/* Issues List with Subtle Dividers */}
            {filteredIssues.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 12px", color: "var(--text-silver)" }}>
                <CheckCircle2 size={32} color="var(--accent-lime)" style={{ margin: "0 auto 8px" }} />
                <h4 style={{ color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: 3 }}>Zero Deviations Detected</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>This draft complies with all approved claims, voice rules, and policies.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", maxHeight: 420, overflowY: "auto", paddingRight: 3 }}>
                {filteredIssues.map((issue, index) => {
                  const isError = issue.severity === "ERROR";
                  const SevIcon = isError ? AlertCircle : (issue.severity === "WARNING" ? AlertTriangle : AlertCircle);
                  
                  return (
                    <div
                      key={issue.id}
                      style={{
                        padding: "12px 6px",
                        borderBottom: index < filteredIssues.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        transition: "background 0.15s ease"
                      }}
                    >
                      {/* Issue Header: Icon, Description, Category, Severity, Action */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 5 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <SevIcon
                            size={16}
                            color={isError ? "var(--status-critical)" : "var(--status-warning)"}
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <span className={`badge ${isError ? "badge-critical" : "badge-warning"}`}>
                                {isError ? "CRITICAL" : issue.severity}
                              </span>
                              <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>
                                {issue.category}
                              </span>
                            </div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                              {issue.title}
                            </div>
                          </div>
                        </div>

                        {/* Inline Resolve Action */}
                        {issue.suggested_fix && (
                          <button
                            type="button"
                            onClick={() => handleApplySingleFix(issue)}
                            className="btn btn-lime btn-sm"
                            style={{ padding: "3px 8px", fontSize: "0.72rem", gap: 3 }}
                            title="Resolve this issue now"
                          >
                            <Check size={12} />
                            <span>Resolve</span>
                          </button>
                        )}
                      </div>

                      {/* Explanation */}
                      <p style={{ fontSize: "0.78rem", color: "var(--text-silver)", lineHeight: "1.5", marginLeft: 24, marginBottom: 6 }}>
                        {issue.explanation}
                      </p>

                      {/* Grounded Citation & Source */}
                      <div style={{
                        marginLeft: 24,
                        background: "#0E1015",
                        border: "1px solid var(--border-bronze)",
                        borderRadius: 4,
                        padding: "6px 9px",
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 6
                      }}>
                        <span>Source: <strong style={{ color: "var(--accent-gold-light)" }}>{issue.source}</strong></span>
                        {issue.suggested_fix && (
                          <span>Approved: <strong style={{ color: "var(--accent-lime)" }}>"{issue.suggested_fix}"</strong></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Supported & Verified Claims Footer */}
            {supported.length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border-bronze)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-lime)", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <CheckCircle2 size={13} />
                  <span>Verified & Supported Claims ({supported.length})</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {supported.map((sup, idx) => (
                    <div key={idx} style={{ fontSize: "0.74rem", color: "var(--text-silver)", background: "#101319", padding: "4px 8px", borderRadius: 4 }}>
                      ✓ "{sup.text}" — <span style={{ color: "var(--accent-gold-light)" }}>{sup.source}</span>
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
