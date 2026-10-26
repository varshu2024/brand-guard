import React, { useState, useEffect } from "react";
import { Layers, CheckCircle2, XCircle, AlertTriangle, ShieldAlert, History, MessageSquare, ArrowUpRight, UserCheck } from "lucide-react";
import { fetchReviews, submitReviewAction } from "../utils/api";

export default function ReviewQueue() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewerName, setReviewerName] = useState("Marcus Vance (VP Marketing)");
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionSuccess, setActionSuccess] = useState(false);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

  const handleAction = async (actionType) => {
    if (!selectedReview) return;
    await submitReviewAction(selectedReview.id, actionType, reviewerName, reviewNotes);
    
    // Update local state
    const newStatus = actionType === "APPROVE" ? "APPROVED" : (actionType === "REQUEST_CHANGES" ? "CHANGES_REQUESTED" : "FLAGGED");
    setReviews(reviews.map((r) => r.id === selectedReview.id ? { ...r, status: newStatus, reviewer: reviewerName } : r));
    
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setSelectedReview(null);
      setReviewNotes("");
    }, 1200);
  };

  const getStatusBadge = (status) => {
    if (status === "APPROVED" || status === "OVERRIDDEN_APPROVED") {
      return <span className="badge badge-success">Approved</span>;
    }
    if (status === "CHANGES_REQUESTED") {
      return <span className="badge badge-warning">Changes Requested</span>;
    }
    return <span className="badge badge-error">Flagged for Review</span>;
  };

  return (
    <div style={{ maxWidth: 1440, margin: "24px auto", padding: "0 24px" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "18px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Governance Review Queue & Approval Workflows</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Empower brand managers and legal reviewers to audit, approve, or request changes with full explainability.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="badge badge-info">{reviews.length} Total Submissions</span>
        </div>
      </div>

      {/* Grid: Left Queue List, Right Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24, alignItems: "start" }}>
        
        {/* Submissions List */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: "0.95rem", marginBottom: 14 }}>Pending & Processed Drafts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviews.map((rev) => {
              const isSelected = selectedReview?.id === rev.id;
              return (
                <div
                  key={rev.id}
                  onClick={() => setSelectedReview(rev)}
                  style={{
                    background: isSelected ? "rgba(99, 102, 241, 0.15)" : "rgba(15, 23, 42, 0.6)",
                    border: `1px solid ${isSelected ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                    borderRadius: 10,
                    padding: 16,
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                        {rev.id} • {rev.channel}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F8FAFC", marginTop: 2 }}>
                        {rev.title}
                      </div>
                    </div>
                    {getStatusBadge(rev.status)}
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{rev.content}"
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--text-dim)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
                    <span>Author: <strong>{rev.author}</strong></span>
                    <span>Score: <strong style={{ color: rev.score >= 90 ? "#10B981" : "#EF4444" }}>{rev.score}/100</strong></span>
                    <span>{rev.timestamp?.split(" ")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail & Approval Action Panel */}
        <div className="glass-panel" style={{ padding: 24 }}>
          {selectedReview ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
                <div>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{selectedReview.id}</span>
                  <h3 style={{ fontSize: "1.1rem", color: "#F8FAFC" }}>{selectedReview.title}</h3>
                </div>
                {getStatusBadge(selectedReview.status)}
              </div>

              {/* Content Box */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Submitted Content Body
                </label>
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: 14, fontSize: "0.88rem", color: "#E2E8F0", lineHeight: "1.6" }}>
                  {selectedReview.content}
                </div>
              </div>

              {/* Reviewer Action Controls */}
              <div style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: 10, padding: 16, marginBottom: 18 }}>
                <h4 style={{ fontSize: "0.85rem", color: "#A5B4FC", marginBottom: 10 }}>Reviewer Decision & Sign-Off</h4>
                
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Acting Reviewer</label>
                  <input
                    type="text"
                    className="input-text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Audit Notes / Justification</label>
                  <textarea
                    className="textarea-input"
                    rows={3}
                    placeholder="Enter compliance justification or revision feedback for author..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleAction("APPROVE")}
                    className="btn btn-emerald btn-sm"
                    style={{ flex: 1 }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve Publication</span>
                  </button>

                  <button
                    onClick={() => handleAction("REQUEST_CHANGES")}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, borderColor: "rgba(245, 158, 11, 0.4)", color: "#FCD34D" }}
                  >
                    <AlertTriangle size={16} />
                    <span>Request Changes</span>
                  </button>
                </div>

                {actionSuccess && (
                  <div style={{ marginTop: 10, textAlign: "center", color: "#6EE7B7", fontSize: "0.8rem" }}>
                    ✓ Decision recorded and saved to Tamper-Proof Audit Log!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <UserCheck size={44} color="#6366F1" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ color: "#E2E8F0", marginBottom: 6 }}>No Draft Selected</h3>
              <p style={{ fontSize: "0.85rem" }}>Click any draft on the left to inspect issues, review citations, and grant publish approvals.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
