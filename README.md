# BrandGuard — Pre-Publish Brand Governance & Trust Layer

> **Round 2 Submission (The Build)**  
> **Problem Statement by Inkloom AI** • **Organised by We Code Coders**  
> **Team:** GIRL CODER (Solo Developer: Varshini Uppada)  
> **Repository:** [https://github.com/varshu2024/brand-guard](https://github.com/varshu2024/brand-guard)  
> **Submission Document:** [`BrandGuard_Round_2_Submission.pdf`](./BrandGuard_Round_2_Submission.pdf)  

---

## 🛡️ What is BrandGuard?
**BrandGuard** is an automated pre-publish brand governance platform that intercepts content before publication and checks it against approved guidelines, verified facts, and design tokens.

### 🎨 Obsidian Luxe UI/UX Architecture
BrandGuard features a custom **Obsidian Luxe** enterprise design system:
- **Surface Depth Hierarchy**: Near-black background (`#0B0C0F`) with subtle bronze corner radial gradients, deep charcoal content editor (`#111318`), telemetry analytics panels (`#171A20`), and refined borders (`#34302A`).
- **Interactive In-Draft Risk Inspector**: Flagged phrases are highlighted with syntax-style badges directly within the draft. Clicking any phrase reveals an in-context violation inspector card displaying policy explanations, official ledger source citations, and 1-click AI fixes.
- **Guided Next-Action Workflow**: Direct guided stepper: `HIGH RISK (22/100) ➔ 9 ISSUES DETECTED ➔ REVIEW SUGGESTED FIXES (DIFF) ➔ RECHECK COMPLIANCE`.
- **First-Class Before & After Diff Engine**: Side-by-side split comparison calculating real-time projected impact (`Score 22 ➔ 97/100 (+75 pts)`) with instant 1-click fix acceptance and undo support.
- **Clickable Risk Breakdown**: Interactive category bars for Claims, Voice, Policy, and Freshness with active selection borders that dynamically filter detected issues.

Unlike grammar checkers or generic tone checkers, BrandGuard addresses the four real-world failure types defined by Inkloom AI:
1. **Contradicted Claims:** Detects false customer traction, unapproved SLAs, and unbacked certifications.
2. **Outdated Information:** Tracks fact freshness and flags claims citing expired facts or retired pricing tiers.
3. **Inconsistent Language & Tone:** Enforces approved brand terminology (`members` vs `users`/`customers`), brand trademarks (`NovaPulse`), and eliminates hollow buzzwords (`synergy`, `game-changing`).
4. **Off-Brand Visuals:** Analyzes uploaded creative assets for dominant color compliance, calculates Delta-E distance to approved brand palettes, and audits WCAG 2.1 accessibility contrast.

---

## ⚡ 1-Click Quick Start (Windows)

To start both the FastAPI backend and the Vite frontend simultaneously, simply double-click or run:

```powershell
.\start_dev.bat
```
*Or via PowerShell:*
```powershell
.\start_dev.ps1
```

### Manual Setup:

#### 1. Backend (FastAPI):
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*API will run at `http://127.0.0.1:8000` (Swagger docs: `http://127.0.0.1:8000/docs`).*

#### 2. Frontend (Vite + React):
```powershell
cd frontend
npm install
npm run dev
```
*Frontend will run at `http://127.0.0.1:5173`.*

---

## 🧪 Benchmark & Accuracy Evaluation
BrandGuard includes an automated evaluation benchmark suite testing detection accuracy on seeded test cases:

```powershell
python backend/test_evaluation.py
```
**Results:** `4/4 test cases passed (100.0% precision & recall with zero false negatives)`.

---

## 🚀 Key Modules & Capabilities

### 1. Content Studio & Verifier
- **Split-Screen Workspace:** Live markdown/text editor with instant character and word counters.
- **1-Click Judge Scenarios:** Pre-loaded test cases for instant evaluation:
  - *Scenario 1: AI Marketing Draft* (flags false 10k customer traction, outdated $199 pricing, and restricted superlatives).
  - *Scenario 2: Cloud Press Release* (validates grounded SOC 2 / HIPAA claims and scores 97/100).
  - *Scenario 3: Developer Blog* (detects expired benchmark and unapproved SLA).
- **Brand Trust Score (0-100):** Real-time weighted gauge broken down into Claims (35%), Voice (25%), Policy (25%), and Freshness (15%).
- **1-Click Apply All Fixes:** Non-overlapping substitution engine that fixes all flagged issues at once and elevates the score to 96+!

### 2. Visual Asset Inspector
- **Quantized Color Extraction:** Computes top 6 dominant RGB swatches from images using PIL.
- **Delta-E Color Distance:** Calculates distance to the approved NovaPulse brand palette (Electric Indigo, Cyber Cyan, Emerald Spark, Midnight Slate).
- **WCAG 2.1 Contrast Ratio:** Audits text-to-background luminance contrast against AA standards (minimum 4.5:1).
- **Prohibited Color Guardrail:** Flags banned high-saturation neon greens and garish yellows.

### 3. Brand Knowledge Base
- **Claim Ledger:** Audited single source of truth for corporate facts with sources, owners, verification dates, and expiration countdowns.
- **Voice & Terminology:** Preferred substitutions and severity levels.
- **Policy Restrictions:** Guardrails against illegal financial claims (`guaranteed ROI`) and absolute security claims (`100% secure`).
- **Visual Design System:** Color tokens, typography, and logo clearspace standards.

### 4. Reviewer Queue & Audit Trail
- **Human-in-the-Loop:** Automated escalation of unverified or low-scoring drafts to authorized reviewers.
- **Reviewer Actions:** Approve publication, request changes, or override with justification.
- **Tamper-Proof Audit Log:** Chronological record of all scans, approvals, edits, and reviewer decisions.

### 5. Governance Drift Analytics
- **KPI Metrics:** Audited content volume, average trust score, and prevented violations.
- **Recurring Mistakes Intelligence:** Identifies top repeat violations across teams to spotlight internal training needs.
- **Channel Risk Breakdown:** Compares compliance across AI copy, PR releases, and social ads.

### 6. AI Guardrail REST API & Playground
- **Direct Integration:** Interactive JSON console testing `POST /api/check/text` with sub-100ms latency.
- **Python / LangChain Middleware Snippet:** Demonstrates one-line integration to verify AI outputs before publishing.

---

## 🌟 Planned Round 3 Major Improvements
1. **Multi-Modal Figma/Canva & Slide Layout Engine:** Computer vision bounding box detection for logo clearspace and slide layer typography.
2. **Automated Web Crawler for Expired Facts:** Continuous post-publish monitoring crawling live websites to flag pages citing expired ledger facts.
3. **Role-Based Governance Workspace with Cryptographic Audit Signing:** Multi-stakeholder threshold approval for high-risk claims with immutable SHA-256 hash chaining.

---

## 👩‍💻 Participant Details
- **Team Name:** GIRL CODER (Solo Participant)
- **Developer:** Varshini Uppada
- **Institution:** Satya Institute of Technology and Management, Vizianagaram, India (B.Tech ECE, 2027)
- **Contact:** varshuppada@gmail.com
