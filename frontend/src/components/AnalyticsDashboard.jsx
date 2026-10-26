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
    <div style={{ maxWidth: 1480, margin: "18px auto", padding: "0 24px" }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="panel-analytics" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Total Content Audited</span>
            <FileCheck size={18} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)" }}>{data.total_audited_content}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--accent-lime)", marginTop: 2 }}>↑ 18% volume increase this week</div>
        </div>

        <div className="panel-analytics" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Avg Brand Trust Score</span>
            <Award size={18} color="var(--accent-lime)" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-lime)" }}>
            {data.average_brand_trust_score}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/100</span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Across all channels & AI pipelines</div>
        </div>

        <div className="panel-analytics" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Violations Prevented</span>
            <ShieldCheck size={18} color="var(--accent-gold-light)" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-gold-light)" }}>{data.prevented_violations_count}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--accent-lime)", marginTop: 2 }}>Stopped before public distribution</div>
        </div>

        <div className="panel-analytics" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Expiring Facts Radar</span>
            <Clock size={18} color="var(--status-warning)" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--status-warning)" }}>
            {data.expired_facts_alert + data.expiring_soon_alert}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#FFBF47", marginTop: 2 }}>
            {data.expired_facts_alert} expired • {data.expiring_soon_alert} expiring in 30 days
          </div>
        </div>
      </div>

      {/* Grid: Recurring Mistakes vs Channel Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
        
        {/* Recurring Mistakes List */}
        <div className="panel-analytics" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: "0.95rem" }}>Top Recurring Brand Drift Mistakes</h3>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Identifies unclear guidelines & training gaps</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.recurring_mistakes?.map((item, idx) => (
              <div key={idx} style={{ background: "#0B0C0F", border: "1px solid var(--border-main)", borderRadius: 6, padding: "10px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.85rem" }}>{item.issue}</span>
                    <span style={{ marginLeft: 6, fontSize: "0.7rem", color: "var(--text-muted)" }}>({item.category})</span>
                  </div>
                  <span className={`badge ${item.risk === "High" ? "badge-critical" : (item.risk === "Medium" ? "badge-warning" : "badge-neutral")}`}>
                    {item.frequency} times flagged
                  </span>
                </div>

                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    width: `${(item.frequency / 50) * 100}%`,
                    height: "100%",
                    background: item.risk === "High" ? "var(--status-critical)" : "var(--status-warning)",
                    borderRadius: 2
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Risk Distribution */}
        <div className="panel-analytics" style={{ padding: 20 }}>
          <h3 style={{ fontSize: "0.95rem", marginBottom: 14 }}>Channel Compliance Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.channel_performance?.map((ch, idx) => (
              <div key={idx} style={{ background: "#0B0C0F", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border-main)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{ch.channel}</span>
                  <span style={{ fontWeight: 700, color: ch.avg_score >= 85 ? "var(--accent-lime)" : (ch.avg_score >= 70 ? "var(--status-warning)" : "var(--status-critical)") }}>
                    {ch.avg_score}/100
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  <span>{ch.checks_count} pieces audited</span>
                  <span style={{ color: ch.risk === "High" ? "var(--status-critical)" : "inherit" }}>Risk: {ch.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
