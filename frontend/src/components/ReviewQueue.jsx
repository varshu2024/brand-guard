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
      return <span className="badge badge-healthy">Approved</span>;
    }
    if (status === "CHANGES_REQUESTED") {
      return <span className="badge badge-warning">Changes Requested</span>;
    }
    return <span className="badge badge-critical">Flagged for Review</span>;
  };

  return (
    <div style={{ maxWidth: 1480, margin: "18px auto", padding: "0 24px" }}>
      {/* Header */}
      <div className="graphite-panel" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.15rem", marginBottom: 3 }}>Governance Review Queue & Approval Workflows</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-silver)" }}>
            Empower brand managers and legal reviewers to audit, approve, or request changes with full explainability.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="badge badge-gold">{reviews.length} Active Drafts</span>
        </div>
      </div>

      {/* Grid: Left Queue List, Right Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 20, alignItems: "start" }}>
        
        {/* Submissions List */}
        <div className="graphite-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: 12, color: "var(--text-primary)" }}>Pending Submissions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reviews.map((rev) => {
              const isSelected = selectedReview?.id === rev.id;
              return (
                <div
                  key={rev.id}
                  onClick={() => setSelectedReview(rev)}
                  style={{
                    background: isSelected ? "rgba(196, 248, 42, 0.08)" : "#11141B",
                    border: `1px solid ${isSelected ? "var(--accent-lime)" : "var(--border-bronze)"}`,
                    borderRadius: 6,
                    padding: 14,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--accent-gold-light)", fontFamily: "var(--font-mono)" }}>
                        {rev.id} • {rev.channel}
                      </div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
                        {rev.title}
                      </div>
                    </div>
                    {getStatusBadge(rev.status)}
                  </div>

                  <p style={{ fontSize: "0.78rem", color: "var(--text-silver)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{rev.content}"
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-subtle)", paddingTop: 6 }}>
                    <span>Author: <strong style={{ color: "var(--text-warm)" }}>{rev.author}</strong></span>
                    <span>Score: <strong style={{ color: rev.score >= 90 ? "var(--accent-lime)" : "var(--status-critical)" }}>{rev.score}/100</strong></span>
                    <span>{rev.timestamp?.split(" ")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail & Approval Action Panel */}
        <div className="graphite-panel" style={{ padding: 20 }}>
          {selectedReview ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid var(--border-bronze)", paddingBottom: 10 }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{selectedReview.id}</span>
                  <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}>{selectedReview.title}</h3>
                </div>
                {getStatusBadge(selectedReview.status)}
              </div>

              {/* Content Box */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: "0.72rem", color: "var(--text-silver)", display: "block", marginBottom: 5 }}>
                  Submitted Content Body
                </label>
                <div style={{ background: "#0D0E12", border: "1px solid var(--border-bronze)", borderRadius: 6, padding: 12, fontSize: "0.82rem", color: "var(--text-warm)", lineHeight: "1.6" }}>
                  {selectedReview.content}
                </div>
              </div>

              {/* Reviewer Action Controls */}
              <div style={{ background: "#11141B", border: "1px solid var(--border-bronze)", borderRadius: 6, padding: 14, marginBottom: 14 }}>
                <h4 style={{ fontSize: "0.82rem", color: "var(--accent-gold-light)", marginBottom: 8 }}>Reviewer Decision & Sign-Off</h4>
                
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: "0.7rem", color: "var(--text-silver)" }}>Acting Reviewer</label>
                  <input
                    type="text"
                    className="input-text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: "0.7rem", color: "var(--text-silver)" }}>Audit Notes / Justification</label>
                  <textarea
                    className="textarea-input"
                    rows={3}
                    placeholder="Enter compliance justification or revision feedback..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleAction("APPROVE")}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve Publication</span>
                  </button>

                  <button
                    onClick={() => handleAction("REQUEST_CHANGES")}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, borderColor: "var(--status-warning)", color: "#FBBF24" }}
                  >
                    <AlertTriangle size={14} />
                    <span>Request Changes</span>
                  </button>
                </div>

                {actionSuccess && (
                  <div style={{ marginTop: 8, textAlign: "center", color: "var(--accent-lime)", fontSize: "0.76rem" }}>
                    ✓ Decision recorded in tamper-proof audit log!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px 16px", color: "var(--text-silver)" }}>
              <UserCheck size={38} color="var(--accent-gold)" style={{ margin: "0 auto 10px" }} />
              <h3 style={{ color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: 4 }}>No Draft Selected</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Click any draft on the left to inspect issues, review citations, and grant publish approvals.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
