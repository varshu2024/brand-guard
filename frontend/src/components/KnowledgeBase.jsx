import React, { useState, useEffect } from "react";
import { BookOpen, Database, MessageSquare, Shield, Palette, Plus, Trash2, Calendar, User, Search, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { fetchLedger, fetchVoiceRules } from "../utils/api";
import { DEFAULT_POLICY_RULES } from "../utils/localEngine";

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState("ledger");
  const [ledger, setLedger] = useState([]);
  const [voiceRules, setVoiceRules] = useState([]);
  const [policyRules, setPolicyRules] = useState(DEFAULT_POLICY_RULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new claim
  const [newClaim, setNewClaim] = useState({
    category: "Product Performance",
    metric_name: "query_throughput",
    approved_value: "100,000 queries/sec",
    unit: "throughput",
    source: "Q3 2024 Systems Benchmarking Audit",
    owner: "Dr. Sarah Chen (Chief Infrastructure Officer)",
    expiry_date: "2025-06-30"
  });

  useEffect(() => {
    fetchLedger().then(setLedger);
    fetchVoiceRules().then(setVoiceRules);
  }, []);

  const handleAddClaim = (e) => {
    e.preventDefault();
    const item = {
      id: `CLM-${String(ledger.length + 1).padStart(3, "0")}`,
      ...newClaim,
      verified_date: new Date().toISOString().split("T")[0]
    };
    setLedger([item, ...ledger]);
    setShowAddModal(false);
  };

  const handleDeleteClaim = (id) => {
    setLedger(ledger.filter((x) => x.id !== id));
  };

  const getFreshnessStatus = (expiryDate) => {
    if (!expiryDate) return { label: "ACTIVE", badge: "badge-healthy", icon: CheckCircle2 };
    const exp = new Date(expiryDate);
    const today = new Date();
    if (exp < today) {
      return { label: "EXPIRED", badge: "badge-critical", icon: AlertTriangle };
    }
    const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 45) {
      return { label: `EXPIRING (${daysLeft}d)`, badge: "badge-warning", icon: Clock };
    }
    return { label: "ACTIVE", badge: "badge-healthy", icon: CheckCircle2 };
  };

  const filteredLedger = ledger.filter((item) =>
    item.metric_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.approved_value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.owner?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1480, margin: "18px auto", padding: "0 24px" }}>
      {/* Header */}
      <div className="graphite-panel" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: "1.15rem", marginBottom: 3 }}>Brand Knowledge Base & Single Source of Truth</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-silver)" }}>
            Audited facts, terminology standards, policy restrictions, and design tokens for NovaPulse Cloud.
          </p>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 4, background: "#101319", padding: 3, borderRadius: 6, border: "1px solid var(--border-bronze)" }}>
          {[
            { id: "ledger", label: "Claim Ledger", icon: Database, count: ledger.length },
            { id: "voice", label: "Voice Guidelines", icon: MessageSquare, count: voiceRules.length },
            { id: "policy", label: "Policy Guardrails", icon: Shield, count: policyRules.length },
            { id: "visuals", label: "Design Tokens", icon: Palette }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 11px",
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--accent-lime-dark)" : "var(--text-silver)",
                  background: isActive ? "var(--accent-lime)" : "transparent",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{ fontSize: "0.68rem", opacity: 0.8 }}>({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Claim Ledger */}
      {activeTab === "ledger" && (
        <div className="graphite-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ position: "relative", width: 320 }}>
              <Search size={15} style={{ position: "absolute", left: 10, top: 11, color: "var(--text-muted)" }} />
              <input
                type="text"
                className="input-text"
                style={{ paddingLeft: 32, fontSize: "0.82rem" }}
                placeholder="Search ledger by metric, value, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} />
              <span>Add Verified Claim</span>
            </button>
          </div>

          {/* Ledger Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-bronze)", color: "var(--text-silver)", fontSize: "0.74rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "10px 12px" }}>ID & Category</th>
                  <th style={{ padding: "10px 12px" }}>Metric Name</th>
                  <th style={{ padding: "10px 12px" }}>Approved Value</th>
                  <th style={{ padding: "10px 12px" }}>Audited Source</th>
                  <th style={{ padding: "10px 12px" }}>Owner</th>
                  <th style={{ padding: "10px 12px" }}>Freshness Status</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((item) => {
                  const freshness = getFreshnessStatus(item.expiry_date);
                  const Icon = freshness.icon;
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        transition: "background 0.15s ease"
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: 700, color: "var(--accent-gold-light)" }}>{item.id}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.category}</div>
                      </td>
                      <td style={{ padding: "12px", fontFamily: "var(--font-mono)", color: "var(--text-warm)" }}>
                        {item.metric_name}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontWeight: 700, color: "var(--accent-lime)", background: "rgba(196, 248, 42, 0.1)", padding: "2px 7px", borderRadius: 4 }}>
                          {item.approved_value}
                        </span>
                      </td>
                      <td style={{ padding: "12px", maxWidth: 260, color: "var(--text-silver)", fontSize: "0.78rem" }}>
                        {item.source}
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-warm)", fontSize: "0.78rem" }}>
                        {item.owner}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className={`badge ${freshness.badge}`} style={{ gap: 4 }}>
                          {Icon && <Icon size={11} />}
                          <span>{freshness.label}</span>
                        </span>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>
                          Exp: {item.expiry_date || "Permanent"}
                        </div>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteClaim(item.id)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                          title="Delete fact"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Voice Guidelines */}
      {activeTab === "voice" && (
        <div className="graphite-panel" style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
            {voiceRules.map((rule) => (
              <div key={rule.id} style={{ background: "#11141B", border: "1px solid var(--border-bronze)", borderRadius: 6, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span className={`badge ${rule.severity === "ERROR" ? "badge-critical" : "badge-warning"}`}>
                    {rule.category}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {rule.id}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
                  <span style={{ textDecoration: "line-through", color: "var(--status-critical)", fontWeight: 600, background: "rgba(244, 63, 94, 0.1)", padding: "2px 7px", borderRadius: 4, fontSize: "0.82rem" }}>
                    "{rule.trigger_phrase}"
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>➔</span>
                  <span style={{ color: "var(--accent-lime)", fontWeight: 700, background: "rgba(196, 248, 42, 0.1)", padding: "2px 7px", borderRadius: 4, fontSize: "0.82rem" }}>
                    "{rule.replacement}"
                  </span>
                </div>

                <p style={{ fontSize: "0.76rem", color: "var(--text-silver)", lineHeight: "1.5" }}>
                  {rule.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Policy Guardrails */}
      {activeTab === "policy" && (
        <div className="graphite-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {policyRules.map((rule) => (
              <div key={rule.id} style={{ background: "#11141B", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: 6, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="badge badge-critical">RESTRICTED PHRASE</span>
                    <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>"{rule.trigger_phrase}"</strong>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Rule {rule.id}</span>
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-silver)", marginBottom: 8 }}>
                  <strong>Compliance Mandate:</strong> {rule.requirement}
                </p>

                <div style={{ background: "#0E1015", border: "1px solid var(--border-bronze)", padding: "6px 10px", borderRadius: 4, fontSize: "0.76rem", color: "var(--accent-lime)" }}>
                  <strong>Suggested Alternative:</strong> "{rule.suggested_fix}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Design Tokens */}
      {activeTab === "visuals" && (
        <div className="graphite-panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: "0.95rem", marginBottom: 12, color: "var(--text-primary)" }}>Approved Brand Palette Swatches</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { name: "Electric Indigo", hex: "#4F46E5", role: "Primary Actions" },
              { name: "Cyber Cyan", hex: "#06B6D4", role: "Secondary Accents" },
              { name: "Emerald Spark", hex: "#10B981", role: "Success States" },
              { name: "Midnight Slate", hex: "#0F172A", role: "Card Backgrounds" },
              { name: "Crisp Off-White", hex: "#F8FAFC", role: "High-Contrast Typography" }
            ].map((c) => (
              <div key={c.hex} style={{ background: "#11141B", border: "1px solid var(--border-bronze)", borderRadius: 6, padding: 12 }}>
                <div style={{ height: 48, borderRadius: 4, backgroundColor: c.hex, border: "1px solid rgba(255,255,255,0.15)", marginBottom: 8 }} />
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{c.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--accent-gold-light)", margin: "2px 0 4px" }}>{c.hex}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{c.role}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: "0.95rem", marginBottom: 10, color: "var(--text-primary)" }}>Typography & Protection</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "#11141B", padding: 14, borderRadius: 6, border: "1px solid var(--border-bronze)" }}>
              <div style={{ fontWeight: 700, color: "var(--accent-gold-light)", marginBottom: 6, fontSize: "0.85rem" }}>Font Stacks</div>
              <ul style={{ fontSize: "0.78rem", color: "var(--text-silver)", paddingLeft: 16, lineHeight: 1.7 }}>
                <li>Display: <code>Space Grotesk, sans-serif</code></li>
                <li>Body Copy: <code>Plus Jakarta Sans, sans-serif</code></li>
                <li>Metrics / Code: <code>JetBrains Mono, monospace</code></li>
              </ul>
            </div>

            <div style={{ background: "#11141B", padding: 14, borderRadius: 6, border: "1px solid var(--border-bronze)" }}>
              <div style={{ fontWeight: 700, color: "var(--accent-gold-light)", marginBottom: 6, fontSize: "0.85rem" }}>Logo Clearspace Rules</div>
              <ul style={{ fontSize: "0.78rem", color: "var(--text-silver)", paddingLeft: 16, lineHeight: 1.7 }}>
                <li>Minimum clearspace: 0.25x width padding on all 4 borders</li>
                <li>Minimum width: 120px for digital web rendering</li>
                <li>Prohibited: drop shadows, stretching, and color alterations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Claim Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 11, 14, 0.88)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div className="graphite-panel" style={{ width: "100%", maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 14, color: "var(--text-primary)" }}>Add Verified Claim to Ledger</h3>
            <form onSubmit={handleAddClaim} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Category</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.category}
                  onChange={(e) => setNewClaim({ ...newClaim, category: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Metric Name</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.metric_name}
                  onChange={(e) => setNewClaim({ ...newClaim, metric_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Approved Value</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.approved_value}
                  onChange={(e) => setNewClaim({ ...newClaim, approved_value: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Audited Source (Doc # / Policy)</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.source}
                  onChange={(e) => setNewClaim({ ...newClaim, source: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Owner</label>
                  <input
                    type="text"
                    className="input-text"
                    value={newClaim.owner}
                    onChange={(e) => setNewClaim({ ...newClaim, owner: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.72rem", color: "var(--text-silver)" }}>Expiry Date</label>
                  <input
                    type="date"
                    className="input-text"
                    value={newClaim.expiry_date}
                    onChange={(e) => setNewClaim({ ...newClaim, expiry_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Save Fact to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
