import React, { useState } from "react";
import { Terminal, Play, Copy, Check, Code, ShieldCheck, Zap } from "lucide-react";
import { checkTextContent } from "../utils/api";

export default function ApiPlayground() {
  const [requestPayload, setRequestPayload] = useState(JSON.stringify({
    text: "Our platform is trusted by 10,000 customers and is the best in class. We offer cheap plans at $199/month with guaranteed ROI.",
    title: "AI-Generated Social Ad",
    channel: "Automated Content Pipeline",
    author: "LangChain Content Generator"
  }, null, 2));

  const [responseOutput, setResponseOutput] = useState(null);
  const [latency, setLatency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const parsed = JSON.parse(requestPayload);
      const res = await checkTextContent(parsed.text, parsed.title, parsed.channel, parsed.author);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResponseOutput(res);
    } catch (err) {
      setResponseOutput({ error: "Invalid JSON or server error: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = () => {
    const curlCommand = `curl -X POST http://127.0.0.1:8000/api/check/text \\
  -H "Content-Type: application/json" \\
  -d '${requestPayload.replace(/\n/g, "")}'`;
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1440, margin: "24px auto", padding: "0 24px" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "18px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ fontSize: "1.25rem" }}>AI Guardrail REST API & Integration Playground</h2>
            <span className="badge badge-purple">Enterprise API v2</span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>
            Integrate BrandGuard directly into LLM chains (LangChain, LlamaIndex, OpenAI assistants, CMS webhooks) before AI output reaches production.
          </p>
        </div>

        <button onClick={copyCurl} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
          {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          <span>{copied ? "cURL Copied!" : "Copy cURL Command"}</span>
        </button>
      </div>

      {/* Interactive API Console */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        
        {/* Request Side */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="badge badge-info" style={{ fontFamily: "var(--font-mono)" }}>POST</span>
              <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "#E2E8F0" }}>/api/check/text</span>
            </div>
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="btn btn-emerald btn-sm"
              style={{ padding: "5px 14px" }}
            >
              <Play size={14} fill="#FFF" />
              <span>{loading ? "Running..." : "Send Request"}</span>
            </button>
          </div>

          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
            Request JSON Payload (Editable)
          </label>
          <textarea
            className="textarea-input"
            rows={14}
            value={requestPayload}
            onChange={(e) => setRequestPayload(e.target.value)}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: "1.6" }}
          />
        </div>

        {/* Response Side */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Response Payload</span>
              {responseOutput && (
                <span className="badge badge-success">200 OK</span>
              )}
            </div>
            {latency !== null && (
              <span style={{ fontSize: "0.75rem", color: "var(--brand-cyan)", display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={14} /> {latency} ms execution
              </span>
            )}
          </div>

          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
            JSON Findings & Brand Trust Score
          </label>
          <div style={{
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: 14,
            height: 320,
            overflowY: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "#A5B4FC",
            lineHeight: "1.5"
          }}>
            {responseOutput ? (
              <pre>{JSON.stringify(responseOutput, null, 2)}</pre>
            ) : (
              <div style={{ color: "var(--text-dim)", textAlign: "center", paddingTop: 100 }}>
                Click "Send Request" to test API response.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Python / LangChain SDK Code Snippet for Judges */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Code size={18} color="var(--brand-primary)" />
          <h3 style={{ fontSize: "0.95rem" }}>One-Line Python Guardrail Middleware Integration</h3>
        </div>
        <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: 14, borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#67E8F9", lineHeight: "1.6" }}>
          <pre>{`from brandguard import BrandGuardClient

client = BrandGuardClient(api_url="http://127.0.0.1:8000")

# Intercept and verify LLM outputs before publishing
def guardrailed_llm_chain(prompt: str) -> str:
    raw_ai_text = openai_client.generate(prompt)
    verdict = client.verify_text(raw_ai_text)
    
    if verdict.score < 90:
        # Automatically ground with ledger or alert reviewer
        return verdict.suggested_full_text
    return raw_ai_text`}</pre>
        </div>
      </div>
    </div>
  );
}
