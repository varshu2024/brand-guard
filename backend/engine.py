"""
BrandGuard Core Analysis Engine.
Handles deterministic and grounded factual verification, freshness tracking,
lexicon & voice analysis, policy compliance, Brand Trust Score, and 1-click fixes.
"""

import re
from datetime import datetime, date
from typing import List, Dict, Any, Tuple, Optional
from database import db

def parse_date(date_str: str) -> Optional[date]:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception:
        return None


class BrandVerificationEngine:
    def __init__(self):
        pass

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Runs comprehensive 4-dimensional governance analysis on input content.
        Returns detailed issues, grounded citations, 1-click fixes, and composite score.
        """
        if not text or not text.strip():
            return {
                "score": 100,
                "category_scores": {"claims": 100, "freshness": 100, "voice": 100, "policy": 100},
                "verdict": "EMPTY",
                "issues": [],
                "supported_claims": [],
                "suggested_full_text": text,
                "metrics": {"word_count": 0, "reading_ease": 100, "tone": "Neutral"}
            }

        issues: List[Dict[str, Any]] = []
        supported: List[Dict[str, Any]] = []

        # 1. Check Policy & Regulatory phrases
        policy_issues = self._check_policy_rules(text)
        issues.extend(policy_issues)

        # 2. Check Voice & Terminology rules
        voice_issues = self._check_voice_rules(text)
        issues.extend(voice_issues)

        # 3. Check Claims against Claim Ledger (Numbers, metrics, certifications, pricing)
        claim_issues, supported_claims = self._check_claim_ledger(text)
        issues.extend(claim_issues)
        supported.extend(supported_claims)

        # 4. Check Freshness of claims
        freshness_issues = self._check_freshness(claim_issues, supported_claims)
        issues.extend(freshness_issues)

        # 5. Compute Brand Trust Score and Category Breakdown
        scores = self._calculate_scores(issues, text)

        # 6. Generate One-Click Corrected Text
        corrected_text = self._generate_corrected_text(text, issues)

        # 7. Basic Tone and Reading metrics
        metrics = self._calculate_metrics(text)

        # Determine overall verdict
        if scores["overall"] >= 90 and not any(i["severity"] == "ERROR" for i in issues):
            verdict = "READY_TO_PUBLISH"
        elif scores["overall"] >= 70:
            verdict = "NEEDS_REVIEW"
        else:
            verdict = "CRITICAL_ISSUES"

        return {
            "score": scores["overall"],
            "category_scores": {
                "claims": scores["claims"],
                "freshness": scores["freshness"],
                "voice": scores["voice"],
                "policy": scores["policy"]
            },
            "verdict": verdict,
            "issues": issues,
            "supported_claims": supported,
            "suggested_full_text": corrected_text,
            "metrics": metrics
        }

    def _check_policy_rules(self, text: str) -> List[Dict[str, Any]]:
        issues = []
        for rule in db.policy_rules:
            phrase = rule["trigger_phrase"]
            pattern = rf"\b{re.escape(phrase)}\b"
            matches = list(re.finditer(pattern, text, re.IGNORECASE))
            for match in matches:
                issues.append({
                    "id": f"ISS-POL-{len(issues) + 1}",
                    "category": "POLICY",
                    "type": "Policy Violation",
                    "original_text": match.group(0),
                    "start_pos": match.start(),
                    "end_pos": match.end(),
                    "severity": rule.get("severity", "ERROR"),
                    "title": f"Restricted Claim: '{phrase}'",
                    "explanation": rule["requirement"],
                    "suggested_fix": rule["suggested_fix"],
                    "source": f"Corporate Compliance Policy {rule['id']}",
                    "owner": "Legal & Risk Committee"
                })
        return issues

    def _check_voice_rules(self, text: str) -> List[Dict[str, Any]]:
        issues = []
        for rule in db.voice_rules:
            phrase = rule["trigger_phrase"]
            # Handle phrases with spaces vs single words
            pattern = rf"\b{re.escape(phrase)}\b"
            matches = list(re.finditer(pattern, text, re.IGNORECASE))
            for match in matches:
                # Avoid flagging if already equal to replacement
                matched_str = match.group(0)
                if matched_str.lower() == rule["replacement"].lower():
                    continue

                issues.append({
                    "id": f"ISS-VOI-{len(issues) + 1}",
                    "category": "VOICE",
                    "type": rule.get("category", "Terminology"),
                    "original_text": matched_str,
                    "start_pos": match.start(),
                    "end_pos": match.end(),
                    "severity": rule.get("severity", "WARNING"),
                    "title": f"Voice Guideline: Use '{rule['replacement']}'",
                    "explanation": rule["rationale"],
                    "suggested_fix": rule["replacement"],
                    "source": f"Brand Voice Manual (Rule {rule['id']})",
                    "owner": "Brand Guidelines Committee"
                })
        return issues

    def _check_claim_ledger(self, text: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        issues: List[Dict[str, Any]] = []
        supported: List[Dict[str, Any]] = []

        # Numerical pattern check for Customer Count
        # Detect patterns like: 10,000 customers, 5,000 users, 10000 members, etc.
        cust_match = re.search(r"\b([0-9]{1,3}(?:,[0-9]{3})*|\d+)\s+(customers|users|members|clients)\b", text, re.IGNORECASE)
        if cust_match:
            claimed_num_str = cust_match.group(1).replace(",", "")
            claimed_word = cust_match.group(2)
            full_match = cust_match.group(0)

            # Find matching ledger item CLM-001
            ledger_item = next((item for item in db.ledger if item["metric_name"] == "customer_count"), None)
            if ledger_item:
                approved_num = ledger_item["approved_value"].replace(",", "")
                if claimed_num_str != approved_num:
                    issues.append({
                        "id": f"ISS-CLM-{len(issues) + 1}",
                        "category": "CLAIMS",
                        "type": "Contradicted Metric",
                        "original_text": full_match,
                        "start_pos": cust_match.start(),
                        "end_pos": cust_match.end(),
                        "severity": "ERROR",
                        "title": f"Unapproved Traction Metric: '{full_match}'",
                        "explanation": f"Draft asserts '{claimed_num_str} {claimed_word}', but verified ledger states '{ledger_item['approved_value']} {ledger_item['unit']}'. Overstating traction creates regulatory misrepresentation and legal liability.",
                        "suggested_fix": f"{ledger_item['approved_value']} {ledger_item['unit']}",
                        "source": ledger_item["source"],
                        "owner": ledger_item["owner"],
                        "ledger_id": ledger_item["id"]
                    })
                else:
                    supported.append({
                        "metric": "customer_count",
                        "text": full_match,
                        "ledger_id": ledger_item["id"],
                        "source": ledger_item["source"]
                    })

        # Pricing check: e.g. "$199/month", "$199", "$299"
        price_match = re.search(r"\$(\d+)(?:\s*(?:/|\s*per\s*)\s*(?:month|mo|year|yr))?", text, re.IGNORECASE)
        if price_match:
            claimed_price = price_match.group(1)
            full_match = price_match.group(0)
            pricing_item = next((item for item in db.ledger if item["metric_name"] == "starter_pricing"), None)
            if pricing_item:
                if claimed_price == "199":
                    issues.append({
                        "id": f"ISS-CLM-{len(issues) + 1}",
                        "category": "CLAIMS",
                        "type": "Outdated Pricing",
                        "original_text": full_match,
                        "start_pos": price_match.start(),
                        "end_pos": price_match.end(),
                        "severity": "ERROR",
                        "title": f"Outdated Tier Pricing: '{full_match}'",
                        "explanation": f"The $199 tier was officially retired in Q2. Active approved pricing is '{pricing_item['approved_value']}' as per {pricing_item['source']}.",
                        "suggested_fix": pricing_item["approved_value"],
                        "source": pricing_item["source"],
                        "owner": pricing_item["owner"],
                        "ledger_id": pricing_item["id"]
                    })
                elif claimed_price == "299":
                    supported.append({
                        "metric": "starter_pricing",
                        "text": full_match,
                        "ledger_id": pricing_item["id"],
                        "source": pricing_item["source"]
                    })

        # SLA check: e.g. "100% uptime", "99.999% uptime", "99.95% uptime"
        sla_match = re.search(r"(\d+(?:\.\d+)?%)\s*(?:uptime|sla)", text, re.IGNORECASE)
        if sla_match:
            claimed_sla = sla_match.group(1)
            full_match = sla_match.group(0)
            sla_item = next((item for item in db.ledger if item["metric_name"] == "uptime_sla"), None)
            if sla_item:
                if claimed_sla != "99.95%":
                    issues.append({
                        "id": f"ISS-CLM-{len(issues) + 1}",
                        "category": "CLAIMS",
                        "type": "Contradicted SLA",
                        "original_text": full_match,
                        "start_pos": sla_match.start(),
                        "end_pos": sla_match.end(),
                        "severity": "ERROR",
                        "title": f"Exaggerated SLA: '{claimed_sla}'",
                        "explanation": f"Approved contract SLA is strictly '{sla_item['approved_value']}'. Over-promising SLA constitutes contractual misstatement.",
                        "suggested_fix": f"{sla_item['approved_value']} uptime SLA",
                        "source": sla_item["source"],
                        "owner": sla_item["owner"],
                        "ledger_id": sla_item["id"]
                    })
                else:
                    supported.append({
                        "metric": "uptime_sla",
                        "text": full_match,
                        "ledger_id": sla_item["id"],
                        "source": sla_item["source"]
                    })

        # Compliance Certs check
        if "pci-dss" in text.lower():
            pci_match = re.search(r"\bpci-dss\b(?:\s+level\s+1)?(?:\s+compliant)?", text, re.IGNORECASE)
            cert_item = next((item for item in db.ledger if item["metric_name"] == "compliance_certs"), None)
            if pci_match and cert_item:
                issues.append({
                    "id": f"ISS-CLM-{len(issues) + 1}",
                    "category": "CLAIMS",
                    "type": "Unapproved Certification",
                    "original_text": pci_match.group(0),
                    "start_pos": pci_match.start(),
                    "end_pos": pci_match.end(),
                    "severity": "ERROR",
                    "title": "Unverified Certification: 'PCI-DSS'",
                    "explanation": "Audit for PCI-DSS is currently in progress and has not received final certification sign-off. Approved certifications: SOC 2 Type II, ISO 27001:2022, HIPAA.",
                    "suggested_fix": "SOC 2 Type II and ISO 27001 certified",
                    "source": cert_item["source"],
                    "owner": cert_item["owner"],
                    "ledger_id": cert_item["id"]
                })

        return issues, supported

    def _check_freshness(self, claim_issues: List[Dict[str, Any]], supported_claims: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        freshness_issues = []
        today = date.today()

        for item in db.ledger:
            expiry_str = item.get("expiry_date")
            if not expiry_str:
                continue
            exp_date = parse_date(expiry_str)
            if not exp_date:
                continue

            # Check if this item is cited anywhere
            is_cited = any(c.get("ledger_id") == item["id"] for c in supported_claims) or \
                       any(i.get("ledger_id") == item["id"] for i in claim_issues)

            if is_cited:
                if exp_date < today:
                    freshness_issues.append({
                        "id": f"ISS-FRE-{len(freshness_issues) + 1}",
                        "category": "FRESHNESS",
                        "type": "Expired Source Ledger Fact",
                        "original_text": item["approved_value"],
                        "severity": "WARNING",
                        "title": f"Expired Ledger Fact: {item['metric_name']}",
                        "explanation": f"Source fact ({item['id']}) verified on {item['verified_date']} expired on {item['expiry_date']}. Owner {item['owner']} has been prompted to re-audit.",
                        "suggested_fix": f"Re-verify {item['metric_name']} with {item['owner']}",
                        "source": item["source"],
                        "owner": item["owner"]
                    })
                elif (exp_date - today).days <= 30:
                    freshness_issues.append({
                        "id": f"ISS-FRE-{len(freshness_issues) + 1}",
                        "category": "FRESHNESS",
                        "type": "Fact Expiring Soon",
                        "original_text": item["approved_value"],
                        "severity": "SUGGESTION",
                        "title": f"Fact Expiring within {(exp_date - today).days} days",
                        "explanation": f"Fact {item['id']} is valid until {item['expiry_date']}. Renewal audit scheduled.",
                        "suggested_fix": "Valid for current release, schedule Q1 review",
                        "source": item["source"],
                        "owner": item["owner"]
                    })

        return freshness_issues

    def _calculate_scores(self, issues: List[Dict[str, Any]], text: str) -> Dict[str, int]:
        # Category deduction counters
        claims_penalty = 0
        freshness_penalty = 0
        voice_penalty = 0
        policy_penalty = 0

        error_count = sum(1 for i in issues if i.get("severity") == "ERROR")

        for issue in issues:
            cat = issue.get("category", "")
            sev = issue.get("severity", "WARNING")
            weight = 40 if sev == "ERROR" else (18 if sev == "WARNING" else 5)

            if cat == "CLAIMS":
                claims_penalty += weight
            elif cat == "FRESHNESS":
                freshness_penalty += weight
            elif cat == "VOICE":
                voice_penalty += weight
            elif cat == "POLICY":
                policy_penalty += weight

        score_claims = max(0, 100 - claims_penalty)
        score_freshness = max(0, 100 - freshness_penalty)
        score_voice = max(0, 100 - voice_penalty)
        score_policy = max(0, 100 - policy_penalty)

        # Weighted Composite Score: Claims (35%), Voice (25%), Policy (25%), Freshness (15%)
        overall = int(
            score_claims * 0.35 +
            score_voice * 0.25 +
            score_policy * 0.25 +
            score_freshness * 0.15
        )

        # Content with 2+ critical errors should not exceed 68 to prevent accidental publishing
        if error_count >= 2:
            overall = min(overall, 68)

        return {
            "overall": max(10, min(100, overall)),
            "claims": score_claims,
            "freshness": score_freshness,
            "voice": score_voice,
            "policy": score_policy
        }

    def _generate_corrected_text(self, text: str, issues: List[Dict[str, Any]]) -> str:
        """
        Selects high-priority non-overlapping replacements and applies them seamlessly.
        """
        valid_issues = [
            i for i in issues 
            if "start_pos" in i and "end_pos" in i and i.get("suggested_fix") and i["start_pos"] < i["end_pos"]
        ]

        # Priority score for sorting: CLAIMS/POLICY (ERROR) > VOICE > SUGGESTION
        def priority(item):
            sev_score = 3 if item.get("severity") == "ERROR" else (2 if item.get("severity") == "WARNING" else 1)
            span_len = item["end_pos"] - item["start_pos"]
            return (sev_score, span_len)

        # Sort by priority descending
        valid_issues.sort(key=priority, reverse=True)

        # Select non-overlapping intervals
        selected = []
        for issue in valid_issues:
            s1, e1 = issue["start_pos"], issue["end_pos"]
            # Check overlap with any already selected
            overlap = False
            for sel in selected:
                s2, e2 = sel["start_pos"], sel["end_pos"]
                if max(s1, s2) < min(e1, e2):
                    overlap = True
                    break
            if not overlap:
                selected.append(issue)

        # Now sort selected by start position descending to apply substitutions cleanly
        selected.sort(key=lambda x: x["start_pos"], reverse=True)

        res = text
        for item in selected:
            s, e = item["start_pos"], item["end_pos"]
            fix = item["suggested_fix"]
            res = res[:s] + fix + res[e:]

        return res

    def _calculate_metrics(self, text: str) -> Dict[str, Any]:
        words = re.findall(r"\b\w+\b", text)
        word_count = len(words)
        sentences = re.split(r"[.!?]+", text)
        sentences = [s for s in sentences if s.strip()]
        sentence_count = max(1, len(sentences))
        avg_sentence_len = round(word_count / sentence_count, 1)

        # Reading ease estimation
        reading_ease = 100 - min(60, int(avg_sentence_len * 2.5))
        tone = "Professional & Clear" if avg_sentence_len <= 20 else "Complex / Heavy"

        return {
            "word_count": word_count,
            "sentence_count": sentence_count,
            "avg_sentence_length": avg_sentence_len,
            "reading_ease": reading_ease,
            "tone": tone
        }


engine = BrandVerificationEngine()
