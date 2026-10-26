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
    <div style={{ maxWidth: 1480, margin: "18px auto", padding: "0 24px" }}>
      {/* Header */}
      <div className="graphite-panel" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ fontSize: "1.15rem" }}>AI Guardrail REST API & Integration Playground</h2>
            <span className="badge badge-gold">Enterprise v2</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-silver)", marginTop: 2 }}>
            Integrate BrandGuard directly into LLM chains (LangChain, LlamaIndex, OpenAI assistants, CMS webhooks) before AI copy reaches production.
          </p>
        </div>

        <button onClick={copyCurl} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
          {copied ? <Check size={13} color="var(--accent-lime)" /> : <Copy size={13} />}
          <span>{copied ? "cURL Copied!" : "Copy cURL"}</span>
        </button>
      </div>

      {/* Interactive API Console */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        
        {/* Request Side */}
        <div className="graphite-panel" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="badge badge-gold" style={{ fontFamily: "var(--font-mono)" }}>POST</span>
              <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-warm)" }}>/api/check/text</span>
            </div>
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="btn btn-primary btn-sm"
            >
              <Play size={13} fill="currentColor" />
              <span>{loading ? "Running..." : "Send Request"}</span>
            </button>
          </div>

          <label style={{ fontSize: "0.72rem", color: "var(--text-silver)", display: "block", marginBottom: 5 }}>
            Request JSON Payload (Editable)
          </label>
          <textarea
            className="textarea-input"
            rows={13}
            value={requestPayload}
            onChange={(e) => setRequestPayload(e.target.value)}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", lineHeight: "1.5" }}
          />
        </div>

        {/* Response Side */}
        <div className="graphite-panel" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Response Payload</span>
              {responseOutput && (
                <span className="badge badge-healthy">200 OK</span>
              )}
            </div>
            {latency !== null && (
              <span style={{ fontSize: "0.72rem", color: "var(--accent-lime)", display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={13} /> {latency} ms latency
              </span>
            )}
          </div>

          <label style={{ fontSize: "0.72rem", color: "var(--text-silver)", display: "block", marginBottom: 5 }}>
            JSON Verdict & Citations
          </label>
          <div style={{
            background: "#0D0E12",
            border: "1px solid var(--border-bronze)",
            borderRadius: 6,
            padding: 12,
            height: 300,
            overflowY: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--accent-gold-light)",
            lineHeight: "1.5"
          }}>
            {responseOutput ? (
              <pre>{JSON.stringify(responseOutput, null, 2)}</pre>
            ) : (
              <div style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: 90 }}>
                Click "Send Request" to test API response.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Python / LangChain SDK Code Snippet */}
      <div className="graphite-panel" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
          <Code size={16} color="var(--accent-gold)" />
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>One-Line Python Guardrail Middleware Integration</h3>
        </div>
        <div style={{ background: "#0D0E12", border: "1px solid var(--border-bronze)", padding: 12, borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--text-warm)", lineHeight: "1.6" }}>
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
