import React, { useState, useEffect } from "react";
import {
  Sparkles, AlertCircle, CheckCircle2, Clock, ShieldAlert, ArrowRight,
  Send, RefreshCw, Wand2, FileText, Check, AlertTriangle, ExternalLink,
  Bold, Italic, Link2, List, Quote, RotateCcw, Columns, Edit3, Shield,
  ChevronRight, Filter, Eye, CheckSquare
} from "lucide-react";
import { checkTextContent } from "../utils/api";

const PRESET_SCENARIOS = [
  {
    name: "Scenario 1: AI Marketing Draft",
    tag: "High Risk • Score 22",
    title: "Q4 Social Campaign - AI Generated Copy",
    channel: "LinkedIn / X Ads",
    author: "AI Marketing Agent (GPT-4o)",
    text: "Our platform is trusted by 10,000 customers and is the best in class. We offer cheap starting tiers at $199/month with guaranteed ROI for all users!"
  },
  {
    name: "Scenario 2: Enterprise Press Release",
    tag: "Compliant • Score 97",
    title: "Enterprise Expansion Press Release",
    channel: "PR Newswire",
    author: "Jessica Reed (Communications)",
    text: "NovaPulse announces verified SOC 2 Type II and HIPAA certifications, powering over 4,000 enterprise members with an industry-verified 99.95% uptime SLA."
  },
  {
    name: "Scenario 3: Developer Blog",
    tag: "Moderate Risk • Score 63",
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
  const [editorMode, setEditorMode] = useState("interactive"); // "interactive", "raw", "diff"
  const [selectedIssueId, setSelectedIssueId] = useState(null);
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
    setSelectedIssueId(null);
    runAnalysis(scenario.text);
  };

  // 1-Click resolve single issue
  const handleApplySingleFix = (issue) => {
    if (!issue.original_text || !issue.suggested_fix) return;
    const newContent = content.replace(issue.original_text, issue.suggested_fix);
    setContent(newContent);
    runAnalysis(newContent);
    showToast(`Resolved: "${issue.original_text}" ➔ "${issue.suggested_fix}"`);
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

  const score = analysisResult?.score ?? 22;
  const issues = analysisResult?.issues ?? [];
  const supported = analysisResult?.supported_claims ?? [];
  const catScores = analysisResult?.category_scores ?? { claims: 30, voice: 20, policy: 15, freshness: 50 };

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  const issueCountByCategory = {
    CLAIMS: issues.filter((i) => i.category === "CLAIMS").length,
    VOICE: issues.filter((i) => i.category === "VOICE").length,
    POLICY: issues.filter((i) => i.category === "POLICY").length,
    FRESHNESS: issues.filter((i) => i.category === "FRESHNESS").length
  };

  const filteredIssues = activeCategoryTab === "ALL"
    ? issues
    : issues.filter((i) => i.category === activeCategoryTab);

  // Exact recommended status colors:
  // Red: #FF4566 for critical (<70)
  // Amber: #FFBF47 for warnings (70-89)
  // Lime: #C6FF3D for compliant (90-100)
  const getScoreColor = (s) => {
    if (s >= 90) return "var(--accent-lime)";
    if (s >= 70) return "var(--status-warning)";
    return "var(--status-critical)";
  };

  const scoreColor = getScoreColor(score);

  // Status label
  const getStatusLabel = () => {
    if (score >= 90) return { text: "COMPLIANT", class: "badge-compliant", desc: "Ready for immediate publication" };
    if (score >= 70) return { text: "MODERATE RISK", class: "badge-warning", desc: "Review recommended before release" };
    return { text: "HIGH RISK", class: "badge-critical", desc: "Critical brand & legal issues detected" };
  };

  const statusInfo = getStatusLabel();

  // Helper to render interactive syntax-highlighted draft
  const renderInteractiveDraft = () => {
    if (!issues || issues.length === 0) {
      return <span>{content}</span>;
    }

    // Sort issues by start position
    const sorted = [...issues]
      .filter((i) => i.original_text && content.includes(i.original_text))
      .sort((a, b) => content.indexOf(a.original_text) - content.indexOf(b.original_text));

    let cursor = 0;
    const elements = [];

    sorted.forEach((iss, idx) => {
      const pos = content.indexOf(iss.original_text, cursor);
      if (pos >= cursor) {
        // Text before match
        if (pos > cursor) {
          elements.push(<span key={`txt-${idx}`}>{content.slice(cursor, pos)}</span>);
        }

        const isSelected = selectedIssueId === iss.id;
        const isCritical = iss.severity === "ERROR";

        elements.push(
          <span
            key={`iss-${iss.id || idx}`}
            onClick={() => {
              setSelectedIssueId(iss.id);
              setActiveCategoryTab(iss.category);
            }}
            className={isCritical ? "phrase-highlight-critical" : "phrase-highlight-warning"}
            style={{
              outline: isSelected ? "2px solid #FFFFFF" : "none",
              boxShadow: isSelected ? "0 0 10px rgba(255,255,255,0.4)" : "none",
              fontWeight: 600
            }}
            title={`Click to inspect: ${iss.title} (Suggested: "${iss.suggested_fix}")`}
          >
            {iss.original_text}
          </span>
        );
        cursor = pos + iss.original_text.length;
      }
    });

    if (cursor < content.length) {
      elements.push(<span key="txt-end">{content.slice(cursor)}</span>);
    }

    return elements;
  };

  return (
    <div style={{ maxWidth: 1480, margin: "16px auto", padding: "0 24px" }}>

      {/* 1. Slim Horizontal Scenario Selector */}
      <div style={{
        background: "var(--bg-editor)",
        border: "1px solid var(--border-main)",
        borderRadius: 8,
        padding: "8px 16px",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Demo Presets:
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
                  border: selectedScenario === idx ? "1px solid var(--accent-lime)" : "1px solid var(--border-main)",
                  background: selectedScenario === idx ? "rgba(198, 255, 61, 0.12)" : "rgba(11, 12, 15, 0.6)",
                  color: selectedScenario === idx ? "var(--accent-lime)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: selectedScenario === idx ? 700 : 500,
                  transition: "all 0.15s ease"
                }}
              >
                <span>{sc.name}</span>
                <span style={{ fontSize: "0.68rem", opacity: 0.75, marginLeft: 4 }}>({sc.tag})</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem", color: "var(--text-secondary)" }}>
            <span className="pulse-dot-lime" />
            <span>Real-Time Audit: <strong>Active</strong></span>
          </div>
          <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
        </div>
        {/* 2. Guided Next Action Workflow Bar */}
        <div style={{
          background: "rgba(23, 26, 32, 0.85)",
          border: "1px solid var(--border-main)",
          borderRadius: 8,
          padding: "10px 16px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}>
          {/* Step-by-Step Guided Action Roadmap */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Step 1: Risk Status */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 4,
              background: score >= 90 ? "rgba(198, 255, 61, 0.14)" : "rgba(255, 69, 102, 0.14)",
              border: `1px solid ${score >= 90 ? "rgba(198, 255, 61, 0.4)" : "rgba(255, 69, 102, 0.4)"}`,
              color: score >= 90 ? "var(--accent-lime)" : "var(--status-critical)",
              fontSize: "0.76rem",
              fontWeight: 700
            }}>
              <span>1. {statusInfo.text}</span>
              <span style={{ opacity: 0.8 }}>({score}/100)</span>
            </div>

            <span style={{ color: "var(--border-main)", fontWeight: 700 }}>➔</span>

            {/* Step 2: Issues Detected */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-main)",
              color: "var(--text-main)",
              fontSize: "0.76rem",
              fontWeight: 600
            }}>
              <span>2. {issues.length} Issues Detected</span>
            </div>

            <span style={{ color: "var(--border-main)", fontWeight: 700 }}>➔</span>

            {/* Step 3: Review Suggested Fixes */}
            <button
              type="button"
              onClick={() => setEditorMode(editorMode === "diff" ? "interactive" : "diff")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 4,
                background: editorMode === "diff" ? "rgba(214, 179, 106, 0.25)" : "rgba(214, 179, 106, 0.12)",
                border: "1px solid var(--accent-gold)",
                color: "var(--accent-gold-light)",
                fontSize: "0.76rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              title="Click to toggle side-by-side Before & After comparison"
            >
              <Columns size={12} />
              <span>3. Review Suggested Fixes {editorMode === "diff" ? "(Viewing Diff)" : "(Open Diff)"}</span>
            </button>

            <span style={{ color: "var(--border-main)", fontWeight: 700 }}>➔</span>

            {/* Step 4: Recheck Compliance */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 4,
              background: score >= 90 ? "rgba(198, 255, 61, 0.12)" : "rgba(255, 255, 255, 0.03)",
              border: `1px solid ${score >= 90 ? "rgba(198, 255, 61, 0.35)" : "var(--border-subtle)"}`,
              color: score >= 90 ? "var(--accent-lime)" : "var(--text-secondary)",
              fontSize: "0.76rem",
              fontWeight: 600
            }}>
              <span>4. Recheck Compliance</span>
            </div>
          </div>

          {/* Quick Actions on the Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {issues.length > 0 && (
              <button
                onClick={handleApplyAllFixes}
                className="btn btn-primary btn-sm"
                style={{ padding: "5px 12px", fontSize: "0.76rem" }}
                title="Apply all non-overlapping grounded fixes in 1 click"
              >
                <Wand2 size={13} />
                <span>Quick Apply All AI Fixes ({issues.length})</span>
              </button>
            )}

            {content !== originalContent && (
              <button
                onClick={handleUndoFixes}
                className="btn btn-secondary btn-sm"
                style={{ padding: "5px 10px", fontSize: "0.74rem" }}
                title="Revert draft back to original version"
              >
                <RotateCcw size={12} />
                <span>Undo AI Fixes</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Main Workspace Grid: 56% Left Editor, 44% Right Score & Issues */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.27fr 1fr",
          gap: 20,
          alignItems: "start"
        }}>

          {/* =========================================================================
            LEFT COLUMN: CONTENT EDITOR (~56% width)
            Darker charcoal surface (#111318), subtle bronze borders (#34302A)
           ========================================================================= */}
          <div className="panel-editor" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Metadata: Title & Publishing Channel with generous spacing */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 16,
              paddingBottom: 16,
              borderBottom: "1px solid var(--border-main)"
            }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                  Content Title
                </label>
                <input
                  type="text"
                  className="input-text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Content Title..."
                  style={{ fontSize: "0.88rem", fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                  Publishing Channel
                </label>
                <select
                  className="select-input"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  style={{ fontSize: "0.85rem" }}
                >
                  <option value="LinkedIn / X Ads">LinkedIn / X Ads</option>
                  <option value="PR Newswire">PR Newswire / Official</option>
                  <option value="Engineering Blog">Engineering Blog</option>
                  <option value="Website Copy">Website Landing Page</option>
                  <option value="AI Output">Direct AI Pipeline Output</option>
                </select>
              </div>
            </div>

            {/* Dedicated View Mode Selector Tabs (Prominent position for Before & After Diff) */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#07080A",
              border: "1px solid var(--border-main)",
              borderRadius: 6,
              padding: "4px 6px"
            }}>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setEditorMode("interactive")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.75rem",
                    padding: "5px 12px",
                    borderRadius: 4,
                    border: editorMode === "interactive" ? "1px solid var(--accent-lime)" : "1px solid transparent",
                    background: editorMode === "interactive" ? "var(--accent-lime)" : "transparent",
                    color: editorMode === "interactive" ? "var(--accent-lime-dark)" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontWeight: editorMode === "interactive" ? 700 : 500,
                    transition: "all 0.15s ease"
                  }}
                  title="Syntax-highlighted policy violations directly in draft"
                >
                  <Eye size={13} />
                  <span>AI-Annotated Draft</span>
                  {issues.length > 0 && (
                    <span style={{
                      fontSize: "0.64rem",
                      padding: "0px 5px",
                      borderRadius: 3,
                      background: editorMode === "interactive" ? "rgba(0,0,0,0.2)" : "rgba(255,69,102,0.2)",
                      color: editorMode === "interactive" ? "#000" : "var(--status-critical)",
                      fontWeight: 700
                    }}>
                      {issues.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setEditorMode("diff")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.75rem",
                    padding: "5px 12px",
                    borderRadius: 4,
                    border: editorMode === "diff" ? "1px solid var(--accent-gold)" : "1px solid var(--border-gold)",
                    background: editorMode === "diff" ? "rgba(214, 179, 106, 0.22)" : "rgba(214, 179, 106, 0.08)",
                    color: editorMode === "diff" ? "var(--accent-gold-light)" : "var(--accent-gold)",
                    cursor: "pointer",
                    fontWeight: 700,
                    transition: "all 0.15s ease"
                  }}
                  title="Prominent side-by-side comparison of original draft vs. AI compliant copy"
                >
                  <Columns size={13} />
                  <span>Before & After Diff</span>
                  <span className="badge badge-gold" style={{ fontSize: "0.6rem", padding: "1px 4px" }}>
                    Compare
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorMode("raw")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.75rem",
                    padding: "5px 12px",
                    borderRadius: 4,
                    border: editorMode === "raw" ? "1px solid var(--accent-lime)" : "1px solid transparent",
                    background: editorMode === "raw" ? "rgba(198, 255, 61, 0.12)" : "transparent",
                    color: editorMode === "raw" ? "var(--accent-lime)" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontWeight: editorMode === "raw" ? 700 : 500,
                    transition: "all 0.15s ease"
                  }}
                  title="Direct raw text editor"
                >
                  <Edit3 size={13} />
                  <span>Raw Draft Editor</span>
                </button>
              </div>

              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", paddingRight: 6 }}>
                {content.length} chars • {content.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Compact Formatting Toolbar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              background: "#0B0C0F",
              border: "1px solid var(--border-main)",
              borderRadius: 4
            }}>
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
                      width: 24,
                      height: 24,
                      borderRadius: 3,
                      background: "transparent",
                      border: "none",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title={tool.label}
                  >
                    <Icon size={13} />
                  </button>
                );
              })}
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                Formatting Controls
              </span>
            </div>

            {/* Editor Body Modes */}
            {editorMode === "diff" ? (
              /* =========================================================================
                 PROMINENT BEFORE & AFTER DIFF COMPARISON
                 Left: Original draft with red strikethrough tokens
                 Right: AI compliant proposed copy with lime tokens
                 ========================================================================= */
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Diff Metric Banner */}
                <div style={{
                  background: "rgba(11, 12, 15, 0.9)",
                  border: "1px solid var(--border-gold)",
                  borderRadius: 6,
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.76rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Columns size={14} color="var(--accent-gold)" />
                    <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
                      Expected Impact: Score increases from <strong style={{ color: "var(--status-critical)" }}>22</strong> ➔ <strong style={{ color: "var(--accent-lime)" }}>97/100</strong> (+75 pts)
                    </span>
                  </div>
                  <button
                    onClick={handleApplyAllFixes}
                    className="btn btn-primary btn-sm"
                    style={{ padding: "4px 10px", fontSize: "0.74rem" }}
                  >
                    <Check size={12} />
                    <span>Accept AI Proposed Revision</span>
                  </button>
                </div>

                {/* Side-by-Side Comparison Columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Left: Original Copy */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--status-critical)", fontWeight: 700 }}>
                        ORIGINAL DRAFT (BEFORE FIXES)
                      </span>
                      <span className="badge badge-critical" style={{ fontSize: "0.62rem" }}>
                        {issues.length} Violations
                      </span>
                    </div>
                    <div style={{
                      background: "#07080A",
                      border: "1px solid rgba(255, 69, 102, 0.4)",
                      borderRadius: 6,
                      padding: 14,
                      fontSize: "0.86rem",
                      color: "var(--text-main)",
                      lineHeight: "1.7",
                      minHeight: 180
                    }}>
                      {originalContent}
                    </div>
                  </div>

                  {/* Right: Compliant Proposed Copy */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--accent-lime)", fontWeight: 700 }}>
                        COMPLIANT COPY (AI PROPOSED)
                      </span>
                      <span className="badge badge-compliant" style={{ fontSize: "0.62rem" }}>
                        Approved
                      </span>
                    </div>
                    <div style={{
                      background: "#07080A",
                      border: "1px solid rgba(198, 255, 61, 0.4)",
                      borderRadius: 6,
                      padding: 14,
                      fontSize: "0.86rem",
                      color: "var(--text-main)",
                      lineHeight: "1.7",
                      minHeight: 180
                    }}>
                      {analysisResult?.suggested_full_text || content}
                    </div>
                  </div>
                </div>
              </div>
            ) : editorMode === "interactive" ? (
              /* =========================================================================
                 SYNTAX-STYLE HIGHLIGHTED INTERACTIVE DRAFT
                 Problematic phrases highlighted directly with clickable spans
                 ========================================================================= */
              <div>
                <div style={{
                  background: "#07080A",
                  border: "1px solid var(--border-main)",
                  borderRadius: 6,
                  padding: "14px 16px",
                  minHeight: 180,
                  fontSize: "0.92rem",
                  lineHeight: "1.8",
                  color: "var(--text-main)",
                  cursor: "text"
                }}>
                  {renderInteractiveDraft()}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 6 }}>
                  <span>💡 Click any highlighted phrase to inspect violation details and resolve.</span>
                  <span onClick={() => setEditorMode("raw")} style={{ color: "var(--accent-gold)", cursor: "pointer", textDecoration: "underline" }}>
                    Switch to Raw Text Editor
                  </span>
                </div>

                {/* Interactive Violation Detail Inspector Card (appears when a phrase is clicked) */}
                {selectedIssue && (
                  <div style={{
                    marginTop: 12,
                    background: "#0E1116",
                    border: `1px solid ${selectedIssue.severity === "ERROR" ? "var(--status-critical)" : "var(--status-warning)"}`,
                    borderRadius: 6,
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    animation: "fadeIn 0.2s ease"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={`badge ${selectedIssue.severity === "ERROR" ? "badge-critical" : "badge-warning"}`}>
                          {selectedIssue.severity === "ERROR" ? "CRITICAL VIOLATION" : "BRAND WARNING"}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: "0.64rem" }}>
                          {selectedIssue.category}
                        </span>
                        <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                          {selectedIssue.title}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedIssueId(null)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                        title="Close inspector"
                      >
                        ✕
                      </button>
                    </div>

                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                      {selectedIssue.explanation}
                    </p>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 8,
                      background: "#07080A",
                      padding: "8px 10px",
                      borderRadius: 4,
                      border: "1px solid var(--border-subtle)",
                      fontSize: "0.74rem"
                    }}>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Source Citation: </span>
                        <strong style={{ color: "var(--accent-gold)" }}>{selectedIssue.source}</strong>
                      </div>

                      {selectedIssue.suggested_fix && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span>Proposed: <strong style={{ color: "var(--accent-lime)" }}>"{selectedIssue.suggested_fix}"</strong></span>
                          <button
                            type="button"
                            onClick={() => handleApplySingleFix(selectedIssue)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: "3px 8px", fontSize: "0.72rem" }}
                          >
                            <Check size={11} />
                            <span>Apply This Fix</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Raw Textarea Editor */
              <div>
                <textarea
                  className="textarea-input"
                  rows={8}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    runAnalysis(e.target.value);
                  }}
                  placeholder="Write or paste copy here..."
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: "1.7",
                    background: "#07080A",
                    color: "var(--text-main)",
                    resize: "vertical"
                  }}
                />
              </div>
            )}

            {/* Inline Highlighted Phrase Quick-Resolution Chips */}
            {issues.length > 0 && editorMode !== "diff" && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                padding: "10px 12px",
                background: "#0B0C0F",
                borderRadius: 6,
                border: "1px solid var(--border-main)"
              }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                  Violations in Draft:
                </span>
                {issues.slice(0, 5).map((iss) => (
                  <span
                    key={iss.id}
                    onClick={() => handleApplySingleFix(iss)}
                    style={{
                      fontSize: "0.72rem",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: iss.severity === "ERROR" ? "rgba(255, 69, 102, 0.15)" : "rgba(255, 191, 71, 0.15)",
                      color: iss.severity === "ERROR" ? "var(--status-critical)" : "var(--status-warning)",
                      border: `1px solid ${iss.severity === "ERROR" ? "rgba(255, 69, 102, 0.35)" : "rgba(255, 191, 71, 0.35)"}`,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}
                    title="Click to resolve this specific phrase"
                  >
                    <span style={{ textDecoration: "line-through", opacity: 0.8 }}>"{iss.original_text}"</span>
                    <span>➔</span>
                    <strong style={{ color: "var(--accent-lime)" }}>{iss.suggested_fix}</strong>
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Action Bar: Three Consistent Button Styles */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              paddingTop: 8,
              borderTop: "1px solid var(--border-main)"
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                {/* Secondary: Run Verify Draft */}
                <button
                  type="button"
                  onClick={() => runAnalysis(content)}
                  className="btn btn-secondary"
                  disabled={isAnalyzing}
                >
                  <RefreshCw size={14} className={isAnalyzing ? "pulse-dot-lime" : ""} />
                  <span>{isAnalyzing ? "Rechecking..." : "Run Verify Draft"}</span>
                </button>

                {/* Primary: Quick Apply AI Fixes */}
                {issues.length > 0 && (
                  <button
                    type="button"
                    onClick={handleApplyAllFixes}
                    className="btn btn-primary"
                    title="Applies all non-overlapping suggested replacements in one click"
                  >
                    <Wand2 size={15} />
                    <span>Quick Apply AI Fixes</span>
                  </button>
                )}

                {/* Undo AI Fixes */}
                {content !== originalContent && (
                  <button
                    type="button"
                    onClick={handleUndoFixes}
                    className="btn btn-secondary"
                    title="Revert back to original content"
                    style={{ fontSize: "0.78rem" }}
                  >
                    <RotateCcw size={13} />
                    <span>Undo AI Fixes</span>
                  </button>
                )}
              </div>

              {/* Submit for Review */}
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
                background: "rgba(198, 255, 61, 0.1)",
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
            Analytics charcoal surface (#171A20), clickable category filters, clear 22/100 display
           ========================================================================= */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ③ Brand Trust Score Card */}
            <div className="panel-analytics" style={{ padding: 22, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Brand Trust Index
                </span>
                <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
              </div>

              {/* Prominent Score Gauge (Display 22/100 clearly) */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", margin: "4px 0 10px" }}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle
                    cx="65"
                    cy="65"
                    r="54"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
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
                  <span style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: scoreColor, lineHeight: 1 }}>
                    {score}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textTransform: "uppercase", marginTop: 3 }}>
                    / 100 Score
                  </span>
                </div>
              </div>

              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: scoreColor, marginBottom: 8 }}>
                {statusInfo.desc}
              </div>

              {/* Why Is the Score Low? Explanatory Impact Breakdown */}
              {score < 90 && (
                <div style={{
                  background: "#0B0C0F",
                  border: "1px solid var(--border-main)",
                  borderRadius: 6,
                  padding: "10px 12px",
                  marginTop: 6,
                  marginBottom: 12,
                  textAlign: "left",
                  fontSize: "0.74rem"
                }}>
                  <div style={{ fontWeight: 700, color: "var(--accent-gold)", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                    <AlertCircle size={13} color="var(--status-critical)" />
                    <span>Why is Trust Score {score}/100?</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {catScores.claims < 70 && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                        <span style={{ color: "var(--status-critical)" }}>•</span>
                        <span><strong>Claims ({catScores.claims}%):</strong> Unsupported customer metrics ("10,000 customers" vs audited 4,000).</span>
                      </div>
                    )}
                    {catScores.voice < 70 && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                        <span style={{ color: "var(--status-critical)" }}>•</span>
                        <span><strong>Voice & Tone ({catScores.voice}%):</strong> Prohibited slang & superlatives ("cheap", "best in class").</span>
                      </div>
                    )}
                    {catScores.policy < 70 && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                        <span style={{ color: "var(--status-critical)" }}>•</span>
                        <span><strong>Policy & Legal ({catScores.policy}%):</strong> Prohibited financial guarantee ("guaranteed ROI").</span>
                      </div>
                    )}
                    {catScores.freshness < 70 && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                        <span style={{ color: "var(--status-warning)" }}>•</span>
                        <span><strong>Freshness ({catScores.freshness}%):</strong> Expired Q4 2023 pricing tier ("$199/month").</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clickable Category Progress Bars (Click to filter corresponding issues) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8, textAlign: "left" }}>

                {/* Claims Bar */}
                <div
                  onClick={() => setActiveCategoryTab(activeCategoryTab === "CLAIMS" ? "ALL" : "CLAIMS")}
                  className={`category-bar-interactive ${activeCategoryTab === "CLAIMS" ? "active" : ""}`}
                  style={{
                    background: activeCategoryTab === "CLAIMS" ? "rgba(214, 179, 106, 0.14)" : "rgba(11, 12, 15, 0.6)",
                    padding: "8px 10px",
                    borderRadius: 6
                  }}
                  title="Click to filter Claims issues"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", marginBottom: 4 }}>
                    <span style={{ color: activeCategoryTab === "CLAIMS" ? "var(--accent-gold-light)" : "var(--text-secondary)", fontWeight: 600 }}>
                      Claims (35%)
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {issueCountByCategory.CLAIMS > 0 && (
                        <span className="badge badge-critical" style={{ fontSize: "0.6rem", padding: "0 4px" }}>
                          {issueCountByCategory.CLAIMS}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, color: getScoreColor(catScores.claims) }}>{catScores.claims}%</span>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${catScores.claims}%`, height: "100%", background: getScoreColor(catScores.claims), transition: "width 0.3s ease" }} />
                  </div>
                </div>

                {/* Voice & Tone Bar */}
                <div
                  onClick={() => setActiveCategoryTab(activeCategoryTab === "VOICE" ? "ALL" : "VOICE")}
                  className={`category-bar-interactive ${activeCategoryTab === "VOICE" ? "active" : ""}`}
                  style={{
                    background: activeCategoryTab === "VOICE" ? "rgba(214, 179, 106, 0.14)" : "rgba(11, 12, 15, 0.6)",
                    padding: "8px 10px",
                    borderRadius: 6
                  }}
                  title="Click to filter Voice & Terminology issues"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", marginBottom: 4 }}>
                    <span style={{ color: activeCategoryTab === "VOICE" ? "var(--accent-gold-light)" : "var(--text-secondary)", fontWeight: 600 }}>
                      Voice & Tone (25%)
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {issueCountByCategory.VOICE > 0 && (
                        <span className="badge badge-warning" style={{ fontSize: "0.6rem", padding: "0 4px" }}>
                          {issueCountByCategory.VOICE}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, color: getScoreColor(catScores.voice) }}>{catScores.voice}%</span>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${catScores.voice}%`, height: "100%", background: getScoreColor(catScores.voice), transition: "width 0.3s ease" }} />
                  </div>
                </div>

                {/* Policy & Legal Bar */}
                <div
                  onClick={() => setActiveCategoryTab(activeCategoryTab === "POLICY" ? "ALL" : "POLICY")}
                  className={`category-bar-interactive ${activeCategoryTab === "POLICY" ? "active" : ""}`}
                  style={{
                    background: activeCategoryTab === "POLICY" ? "rgba(214, 179, 106, 0.14)" : "rgba(11, 12, 15, 0.6)",
                    padding: "8px 10px",
                    borderRadius: 6
                  }}
                  title="Click to filter Policy & Legal issues"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", marginBottom: 4 }}>
                    <span style={{ color: activeCategoryTab === "POLICY" ? "var(--accent-gold-light)" : "var(--text-secondary)", fontWeight: 600 }}>
                      Policy & Legal (25%)
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {issueCountByCategory.POLICY > 0 && (
                        <span className="badge badge-critical" style={{ fontSize: "0.6rem", padding: "0 4px" }}>
                          {issueCountByCategory.POLICY}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, color: getScoreColor(catScores.policy) }}>{catScores.policy}%</span>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${catScores.policy}%`, height: "100%", background: getScoreColor(catScores.policy), transition: "width 0.3s ease" }} />
                  </div>
                </div>

                {/* Freshness Bar */}
                <div
                  onClick={() => setActiveCategoryTab(activeCategoryTab === "FRESHNESS" ? "ALL" : "FRESHNESS")}
                  className={`category-bar-interactive ${activeCategoryTab === "FRESHNESS" ? "active" : ""}`}
                  style={{
                    background: activeCategoryTab === "FRESHNESS" ? "rgba(214, 179, 106, 0.14)" : "rgba(11, 12, 15, 0.6)",
                    padding: "8px 10px",
                    borderRadius: 6
                  }}
                  title="Click to filter Freshness issues"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", marginBottom: 4 }}>
                    <span style={{ color: activeCategoryTab === "FRESHNESS" ? "var(--accent-gold-light)" : "var(--text-secondary)", fontWeight: 600 }}>
                      Freshness (15%)
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {issueCountByCategory.FRESHNESS > 0 && (
                        <span className="badge badge-warning" style={{ fontSize: "0.6rem", padding: "0 4px" }}>
                          {issueCountByCategory.FRESHNESS}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, color: getScoreColor(catScores.freshness) }}>{catScores.freshness}%</span>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${catScores.freshness}%`, height: "100%", background: getScoreColor(catScores.freshness), transition: "width 0.3s ease" }} />
                  </div>
                </div>

              </div>
            </div>


            {/* ⑤ Structured Issues Review Panel */}
            <div className="panel-analytics" style={{ padding: 18, flex: 1 }}>

              {/* Category Filter Tabs */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border-main)",
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
                        background: activeCategoryTab === cat ? "rgba(214, 179, 106, 0.18)" : "transparent",
                        color: activeCategoryTab === cat ? "var(--accent-gold)" : "var(--text-muted)",
                        padding: "3px 8px",
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
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                  {filteredIssues.length} of {issues.length} flagged
                </span>
              </div>

              {/* Structured Issues List with Subtle Dividers */}
              {filteredIssues.length === 0 ? (
                <div style={{ textAlign: "center", padding: "26px 12px", color: "var(--text-secondary)" }}>
                  <CheckCircle2 size={32} color="var(--accent-lime)" style={{ margin: "0 auto 8px" }} />
                  <h4 style={{ color: "var(--text-main)", fontSize: "0.95rem", marginBottom: 3 }}>Zero Issues in this Category</h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Content conforms to approved brand guidelines.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", maxHeight: 420, overflowY: "auto", paddingRight: 3 }}>
                  {filteredIssues.map((issue, index) => {
                    const isError = issue.severity === "ERROR";
                    const isSelected = selectedIssueId === issue.id;
                    const SevIcon = isError ? AlertCircle : AlertTriangle;

                    return (
                      <div
                        key={issue.id}
                        onClick={() => setSelectedIssueId(issue.id)}
                        style={{
                          padding: "12px 6px",
                          borderBottom: index < filteredIssues.length - 1 ? "1px solid var(--border-main)" : "none",
                          background: isSelected ? "rgba(214, 179, 106, 0.08)" : "transparent",
                          borderRadius: 4,
                          transition: "background 0.15s ease"
                        }}
                      >
                        {/* Issue Header: Severity icon, Description, Category, Action */}
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
                                <span className="badge badge-neutral" style={{ fontSize: "0.64rem" }}>
                                  {issue.category}
                                </span>
                              </div>
                              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>
                                {issue.title}
                              </div>
                            </div>
                          </div>

                          {/* Individual "Fix Issue" Action */}
                          {issue.suggested_fix && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplySingleFix(issue);
                              }}
                              className="btn btn-primary btn-sm"
                              style={{ padding: "3px 8px", fontSize: "0.72rem", gap: 3 }}
                              title="Apply fix to draft"
                            >
                              <Check size={12} />
                              <span>Fix Issue</span>
                            </button>
                          )}
                        </div>

                        {/* Highlighted Flagged Text & Explanation */}
                        <div style={{ marginLeft: 24, marginBottom: 6 }}>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 4 }}>
                            Detected: <span style={{ color: isError ? "var(--status-critical)" : "var(--status-warning)", fontWeight: 700, background: "rgba(0,0,0,0.3)", padding: "1px 5px", borderRadius: 3 }}>"{issue.original_text}"</span>
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                            {issue.explanation}
                          </p>
                        </div>

                        {/* Grounded Citation & Source */}
                        <div style={{
                          marginLeft: 24,
                          background: "#0B0C0F",
                          border: "1px solid var(--border-main)",
                          borderRadius: 4,
                          padding: "6px 9px",
                          fontSize: "0.72rem",
                          color: "var(--text-secondary)",
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 6
                        }}>
                          <span>Source: <strong style={{ color: "var(--accent-gold)" }}>{issue.source}</strong></span>
                          {issue.suggested_fix && (
                            <span>Proposed Fix: <strong style={{ color: "var(--accent-lime)" }}>"{issue.suggested_fix}"</strong></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Supported & Verified Claims Footer */}
              {supported.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border-main)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-lime)", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                    <CheckCircle2 size={13} />
                    <span>Verified & Supported Claims ({supported.length})</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {supported.map((sup, idx) => (
                      <div key={idx} style={{ fontSize: "0.74rem", color: "var(--text-secondary)", background: "#0B0C0F", padding: "4px 8px", borderRadius: 4 }}>
                        ✓ "{sup.text}" — <span style={{ color: "var(--accent-gold)" }}>{sup.source}</span>
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
    </div>
  )
}