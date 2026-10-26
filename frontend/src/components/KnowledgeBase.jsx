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
    if (!expiryDate) return { label: "ACTIVE", badge: "badge-success" };
    const exp = new Date(expiryDate);
    const today = new Date();
    if (exp < today) {
      return { label: "EXPIRED", badge: "badge-error", icon: AlertTriangle };
    }
    const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 45) {
      return { label: `EXPIRING (${daysLeft}d)`, badge: "badge-warning", icon: Clock };
    }
    return { label: "ACTIVE", badge: "badge-success", icon: CheckCircle2 };
  };

  const filteredLedger = ledger.filter((item) =>
    item.metric_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.approved_value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.owner?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1440, margin: "24px auto", padding: "0 24px" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "18px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 4 }}>Brand Knowledge Base & Single Source of Truth</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Centralized repository of audited claims, terminology rules, policy restrictions, and visual tokens.
          </p>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 6, background: "rgba(0,0,0,0.3)", padding: 4, borderRadius: 10 }}>
          {[
            { id: "ledger", label: "Claim Ledger", icon: Database, count: ledger.length },
            { id: "voice", label: "Voice & Terms", icon: MessageSquare, count: voiceRules.length },
            { id: "policy", label: "Policy Guardrails", icon: Shield, count: policyRules.length },
            { id: "visuals", label: "Visual Tokens", icon: Palette }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn btn-sm"
                style={{
                  background: isActive ? "var(--brand-primary)" : "transparent",
                  color: isActive ? "#FFFFFF" : "var(--text-muted)",
                  fontSize: "0.82rem"
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Claim Ledger */}
      {activeTab === "ledger" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ position: "relative", width: 340 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-dim)" }} />
              <input
                type="text"
                className="input-text"
                style={{ paddingLeft: 36, fontSize: "0.85rem" }}
                placeholder="Search ledger by metric, value, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-emerald btn-sm"
            >
              <Plus size={16} />
              <span>Add Verified Claim</span>
            </button>
          </div>

          {/* Ledger Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: "0.76rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 14px" }}>ID & Category</th>
                  <th style={{ padding: "12px 14px" }}>Metric Name</th>
                  <th style={{ padding: "12px 14px" }}>Approved Value</th>
                  <th style={{ padding: "12px 14px" }}>Audited Source</th>
                  <th style={{ padding: "12px 14px" }}>Owner</th>
                  <th style={{ padding: "12px 14px" }}>Freshness Status</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
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
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        transition: "background 0.15s ease"
                      }}
                    >
                      <td style={{ padding: "14px" }}>
                        <div style={{ fontWeight: 700, color: "#A5B4FC" }}>{item.id}</div>
                        <div style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>{item.category}</div>
                      </td>
                      <td style={{ padding: "14px", fontFamily: "var(--font-mono)", color: "#E2E8F0" }}>
                        {item.metric_name}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span style={{ fontWeight: 700, color: "#10B981", background: "rgba(16, 185, 129, 0.12)", padding: "3px 8px", borderRadius: 6 }}>
                          {item.approved_value}
                        </span>
                      </td>
                      <td style={{ padding: "14px", maxWidth: 260, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                        {item.source}
                      </td>
                      <td style={{ padding: "14px", color: "#CBD5E1", fontSize: "0.8rem" }}>
                        {item.owner}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span className={`badge ${freshness.badge}`} style={{ gap: 4 }}>
                          {Icon && <Icon size={12} />}
                          <span>{freshness.label}</span>
                        </span>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 3 }}>
                          Exp: {item.expiry_date || "Permanent"}
                        </div>
                      </td>
                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteClaim(item.id)}
                          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}
                          title="Delete fact"
                        >
                          <Trash2 size={16} />
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

      {/* Tab 2: Voice & Terminology Rules */}
      {activeTab === "voice" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
            {voiceRules.map((rule) => (
              <div key={rule.id} style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className={`badge ${rule.severity === "ERROR" ? "badge-error" : "badge-warning"}`}>
                    {rule.category}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                    {rule.id}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
                  <span style={{ textDecoration: "line-through", color: "#EF4444", fontWeight: 600, background: "rgba(239, 68, 68, 0.12)", padding: "2px 8px", borderRadius: 6 }}>
                    "{rule.trigger_phrase}"
                  </span>
                  <span style={{ color: "var(--text-dim)" }}>➔</span>
                  <span style={{ color: "#10B981", fontWeight: 700, background: "rgba(16, 185, 129, 0.12)", padding: "2px 8px", borderRadius: 6 }}>
                    "{rule.replacement}"
                  </span>
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  {rule.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Policy Guardrails */}
      {activeTab === "policy" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {policyRules.map((rule) => (
              <div key={rule.id} style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="badge badge-error">RESTRICTED PHRASE</span>
                    <strong style={{ color: "#F8FAFC", fontSize: "0.95rem" }}>"{rule.trigger_phrase}"</strong>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Rule {rule.id}</span>
                </div>

                <p style={{ fontSize: "0.84rem", color: "#CBD5E1", marginBottom: 10 }}>
                  <strong>Compliance Mandate:</strong> {rule.requirement}
                </p>

                <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 6, fontSize: "0.8rem", color: "#6EE7B7" }}>
                  <strong>Suggested Alternative:</strong> "{rule.suggested_fix}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Visual Style Tokens */}
      {activeTab === "visuals" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: "1rem", marginBottom: 14 }}>Approved Brand Palette Swatches</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { name: "Electric Indigo", hex: "#4F46E5", role: "Primary Brand / Actions" },
              { name: "Cyber Cyan", hex: "#06B6D4", role: "Secondary Accents & Highlights" },
              { name: "Emerald Spark", hex: "#10B981", role: "Success States & CTAs" },
              { name: "Midnight Slate", hex: "#0F172A", role: "Dark Background / Cards" },
              { name: "Crisp Off-White", hex: "#F8FAFC", role: "High-Contrast Typography" }
            ].map((c) => (
              <div key={c.hex} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: 14 }}>
                <div style={{ height: 60, borderRadius: 8, backgroundColor: c.hex, border: "1px solid rgba(255,255,255,0.2)", marginBottom: 10 }} />
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{c.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--brand-cyan)", margin: "2px 0 6px" }}>{c.hex}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>{c.role}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Typography & Logo Rules</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: 16, borderRadius: 10 }}>
              <div style={{ fontWeight: 700, color: "#A5B4FC", marginBottom: 8 }}>Font Families</div>
              <ul style={{ fontSize: "0.82rem", color: "#CBD5E1", paddingLeft: 18, lineHeight: 1.8 }}>
                <li>Headings: <code>Outfit, Inter, sans-serif</code></li>
                <li>Body Copy: <code>Inter, system-ui, sans-serif</code></li>
                <li>Code / Metrics: <code>JetBrains Mono, monospace</code></li>
              </ul>
            </div>

            <div style={{ background: "rgba(0,0,0,0.25)", padding: 16, borderRadius: 10 }}>
              <div style={{ fontWeight: 700, color: "#A5B4FC", marginBottom: 8 }}>Logo Clearspace & Protection</div>
              <ul style={{ fontSize: "0.82rem", color: "#CBD5E1", paddingLeft: 18, lineHeight: 1.8 }}>
                <li>Minimum clearspace: 0.25x logo width on all sides</li>
                <li>Minimum asset width: 120px for digital web display</li>
                <li>Strictly prohibited: drop shadows, stretching, and gradient alterations</li>
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
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: 540, padding: 28 }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 16 }}>Add New Grounded Claim to Ledger</h3>
            <form onSubmit={handleAddClaim} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Category</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.category}
                  onChange={(e) => setNewClaim({ ...newClaim, category: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Metric Name (Code)</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.metric_name}
                  onChange={(e) => setNewClaim({ ...newClaim, metric_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Approved Value</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.approved_value}
                  onChange={(e) => setNewClaim({ ...newClaim, approved_value: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Audited Source (Document / Audit ID)</label>
                <input
                  type="text"
                  className="input-text"
                  value={newClaim.source}
                  onChange={(e) => setNewClaim({ ...newClaim, source: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Owner</label>
                  <input
                    type="text"
                    className="input-text"
                    value={newClaim.owner}
                    onChange={(e) => setNewClaim({ ...newClaim, owner: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Expiry Date</label>
                  <input
                    type="date"
                    className="input-text"
                    value={newClaim.expiry_date}
                    onChange={(e) => setNewClaim({ ...newClaim, expiry_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-emerald"
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
