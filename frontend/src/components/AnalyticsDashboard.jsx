import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Clock, FileCheck, Layers, Award } from "lucide-react";
import { fetchAnalytics } from "../utils/api";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics().then(setData);
  }, []);

  if (!data) return null;

  return (
    <div style={{ maxWidth: 1440, margin: "24px auto", padding: "0 24px" }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Content Audited</span>
            <FileCheck size={20} color="var(--brand-primary)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F8FAFC" }}>{data.total_audited_content}</div>
          <div style={{ fontSize: "0.75rem", color: "#10B981", marginTop: 4 }}>↑ 18% volume increase this week</div>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Avg Brand Trust Score</span>
            <Award size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10B981" }}>{data.average_brand_trust_score}<span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/100</span></div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: 4 }}>Across all channels & AI pipelines</div>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Violations Prevented</span>
            <ShieldCheck size={20} color="#06B6D4" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#06B6D4" }}>{data.prevented_violations_count}</div>
          <div style={{ fontSize: "0.75rem", color: "#6EE7B7", marginTop: 4 }}>Stopped before going live to public</div>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Expiring Facts Radar</span>
            <Clock size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F59E0B" }}>{data.expired_facts_alert + data.expiring_soon_alert}</div>
          <div style={{ fontSize: "0.75rem", color: "#FCD34D", marginTop: 4 }}>{data.expired_facts_alert} expired • {data.expiring_soon_alert} expiring in 30 days</div>
        </div>
      </div>

      {/* Grid: Recurring Mistakes vs Channel Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, marginBottom: 24 }}>
        
        {/* Recurring Mistakes List */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: "1.05rem" }}>Top Recurring Brand Drift Mistakes</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Identifies unclear guidelines & training gaps</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {data.recurring_mistakes?.map((item, idx) => (
              <div key={idx} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#F8FAFC", fontSize: "0.9rem" }}>{item.issue}</span>
                    <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "var(--text-dim)" }}>({item.category})</span>
                  </div>
                  <span className={`badge ${item.risk === "High" ? "badge-error" : (item.risk === "Medium" ? "badge-warning" : "badge-info")}`}>
                    {item.frequency} times flagged
                  </span>
                </div>

                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(item.frequency / 50) * 100}%`, height: "100%", background: item.risk === "High" ? "#EF4444" : "#F59E0B", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Risk Distribution */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: 16 }}>Channel Compliance Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {data.channel_performance?.map((ch, idx) => (
              <div key={idx} style={{ background: "rgba(0,0,0,0.25)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{ch.channel}</span>
                  <span style={{ fontWeight: 700, color: ch.avg_score >= 85 ? "#10B981" : (ch.avg_score >= 70 ? "#F59E0B" : "#EF4444") }}>
                    {ch.avg_score}/100
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-dim)" }}>
                  <span>{ch.checks_count} content pieces</span>
                  <span style={{ color: ch.risk === "High" ? "#FCA5A5" : "inherit" }}>Risk: {ch.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
