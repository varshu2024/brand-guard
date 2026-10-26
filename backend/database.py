"""
Database and in-memory store for BrandGuard with JSON persistence.
Preloaded with 'NovaPulse Cloud' realistic brand assets, claim ledger, voice guidelines, and policy rules.
"""

import json
import os
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(__file__), "data_store.json")

# Default seed data
DEFAULT_LEDGER = [
    {
        "id": "CLM-001",
        "category": "Customer Traction",
        "metric_name": "customer_count",
        "claim_text": "NovaPulse is trusted by over 4,000 enterprise members across 35 countries.",
        "approved_value": "4,000",
        "unit": "members",
        "source": "Q3 2024 Audited Financial & Operations Report (Doc #AFR-2024-Q3)",
        "owner": "Marcus Vance (VP Marketing)",
        "verified_date": "2024-09-30",
        "expiry_date": "2024-12-31",
        "notes": "Do not cite 10,000 or 5,000. Real audited figure is 4,000 enterprise members."
    },
    {
        "id": "CLM-002",
        "category": "SLA & Reliability",
        "metric_name": "uptime_sla",
        "claim_text": "NovaPulse Cloud delivers an industry-verified 99.95% uptime SLA.",
        "approved_value": "99.95%",
        "unit": "percentage",
        "source": "Infrastructure SLA Policy v4.2 / Legal Signed Annex",
        "owner": "Dr. Sarah Chen (Chief Infrastructure Officer)",
        "verified_date": "2024-08-15",
        "expiry_date": "2025-08-15",
        "notes": "Never claim 100% or 99.999%. Our contractual commitment is exactly 99.95%."
    },
    {
        "id": "CLM-003",
        "category": "Pricing & Packaging",
        "metric_name": "starter_pricing",
        "claim_text": "Enterprise starter tier starts at $299/month billed annually.",
        "approved_value": "$299/mo",
        "unit": "currency",
        "source": "Pricing Sheet 2024.3 effective October 1",
        "owner": "Elena Rostova (Head of Growth)",
        "verified_date": "2024-10-01",
        "expiry_date": "2025-01-31",
        "notes": "Old $199/mo tier was retired in Q2. Any mention of $199 is strictly outdated."
    },
    {
        "id": "CLM-004",
        "category": "Security & Certifications",
        "metric_name": "compliance_certs",
        "claim_text": "Certified for SOC 2 Type II, ISO 27001:2022, and HIPAA compliance.",
        "approved_value": "SOC 2 Type II, ISO 27001:2022, HIPAA",
        "unit": "certification",
        "source": "Coalfire Security Audit Certification Oct 2024",
        "owner": "James Albright (CISO)",
        "verified_date": "2024-10-10",
        "expiry_date": "2025-10-10",
        "notes": "PCI-DSS Level 1 audit in progress, NOT yet certified. Do not claim PCI-DSS compliant."
    },
    {
        "id": "CLM-005",
        "category": "Performance Benchmark",
        "metric_name": "processing_latency",
        "claim_text": "Processes streaming brand events with sub-50ms p95 latency.",
        "approved_value": "50ms p95",
        "unit": "latency",
        "source": "Benchmark Whitepaper v2.0 (Tested on AWS us-east-1)",
        "owner": "Kevin Patel (Principal Architect)",
        "verified_date": "2024-07-01",
        "expiry_date": "2024-11-01",  # Expired or near expiry for test demo
        "notes": "Verification expired on Nov 1, 2024. Needs re-benchmarking before public citation."
    },
    {
        "id": "CLM-006",
        "category": "Customer Support",
        "metric_name": "support_response",
        "claim_text": "24/7 dedicated enterprise response within 15 minutes for P1 tickets.",
        "approved_value": "15 minutes",
        "unit": "duration",
        "source": "Customer Support Charter v3",
        "owner": "Priya Sharma (VP Customer Experience)",
        "verified_date": "2024-09-01",
        "expiry_date": "2025-09-01",
        "notes": "Standard tier response is 4 hours; only Enterprise P1 is 15 minutes."
    }
]

DEFAULT_VOICE_RULES = [
    {
        "id": "RUL-001",
        "category": "Terminology",
        "trigger_phrase": "users",
        "replacement": "members",
        "rationale": "Brand identity guideline: We cultivate a community; our customers and community are referred to as 'members', never generic 'users'.",
        "severity": "ERROR"
    },
    {
        "id": "RUL-002",
        "category": "Terminology",
        "trigger_phrase": "customers",
        "replacement": "members",
        "rationale": "Brand voice specifies 'members' or 'enterprise partners' rather than 'customers'.",
        "severity": "WARNING"
    },
    {
        "id": "RUL-003",
        "category": "Banned Jargon",
        "trigger_phrase": "synergy",
        "replacement": "collaboration",
        "rationale": "Empty corporate jargon is prohibited by NovaPulse Content Voice Guideline Section 3.1.",
        "severity": "WARNING"
    },
    {
        "id": "RUL-004",
        "category": "Banned Jargon",
        "trigger_phrase": "game-changing",
        "replacement": "transformative or innovative",
        "rationale": "Overhyped promotional cliché. Show tangible results rather than vague buzzwords.",
        "severity": "SUGGESTION"
    },
    {
        "id": "RUL-005",
        "category": "Banned Jargon",
        "trigger_phrase": "cheap",
        "replacement": "cost-effective or accessible",
        "rationale": "Word 'cheap' devalues the enterprise brand perception.",
        "severity": "ERROR"
    },
    {
        "id": "RUL-006",
        "category": "Naming Consistency",
        "trigger_phrase": "Nova Pulse",
        "replacement": "NovaPulse",
        "rationale": "Official trademark is 'NovaPulse' (one single word with PascalCase). Do not insert a space.",
        "severity": "ERROR"
    },
    {
        "id": "RUL-007",
        "category": "Naming Consistency",
        "trigger_phrase": "NovaPulse AI Engine",
        "replacement": "NovaPulse Cognitive Core",
        "rationale": "Product rebranded from 'AI Engine' to 'Cognitive Core' in Fall 2024 release.",
        "severity": "ERROR"
    }
]

DEFAULT_POLICY_RULES = [
    {
        "id": "POL-001",
        "trigger_phrase": "best in class",
        "category": "Unsubstantiated Claim",
        "requirement": "Comparative superlatives require third-party benchmark (e.g. Gartner Magic Quadrant or Forrester Wave citation) or legal counsel sign-off.",
        "suggested_fix": "industry-leading or proven in high-throughput environments",
        "severity": "ERROR"
    },
    {
        "id": "POL-002",
        "trigger_phrase": "guaranteed ROI",
        "category": "Legal Liability",
        "requirement": "Financial performance guarantees are illegal under FTC and SEC advertising guardrails without explicit disclaimers.",
        "suggested_fix": "demonstrated average ROI based on customer case studies",
        "severity": "ERROR"
    },
    {
        "id": "POL-003",
        "trigger_phrase": "100% secure",
        "category": "Security Misrepresentation",
        "requirement": "CISO mandate: No system is mathematically 100% secure. Mention specific defense-in-depth protocols instead.",
        "suggested_fix": "enterprise-grade security with continuous zero-trust validation",
        "severity": "ERROR"
    },
    {
        "id": "POL-004",
        "trigger_phrase": "unlimited access",
        "category": "Fair Use Policy",
        "requirement": "All plans operate under Fair Use Policy rate limits. Clarify 'comprehensive access subject to fair use'.",
        "suggested_fix": "high-capacity access designed for enterprise scale",
        "severity": "WARNING"
    }
]

DEFAULT_VISUAL_RULES = {
    "brand_name": "NovaPulse Cloud",
    "primary_color": "#4F46E5",     # Electric Indigo
    "secondary_color": "#06B6D4",   # Cyber Cyan
    "accent_color": "#10B981",      # Emerald Spark
    "dark_neutral": "#0F172A",      # Midnight Slate
    "light_neutral": "#F8FAFC",     # Crisp Off-White
    "approved_palette": [
        {"name": "Electric Indigo", "hex": "#4F46E5", "role": "Primary Brand"},
        {"name": "Cyber Cyan", "hex": "#06B6D4", "role": "Secondary / Accent"},
        {"name": "Emerald Spark", "hex": "#10B981", "role": "Success / Conversion"},
        {"name": "Midnight Slate", "hex": "#0F172A", "role": "Dark Background / Text"},
        {"name": "Crisp Off-White", "hex": "#F8FAFC", "role": "Light Background"}
    ],
    "banned_colors": [
        {"name": "Harsh Neon Green", "hex": "#00FF00", "reason": "Violates accessibility contrast standards"},
        {"name": "Garish Yellow", "hex": "#FFFF00", "reason": "Off-brand low legibility"}
    ],
    "typography": {
        "primary_font": "Inter, system-ui, sans-serif",
        "heading_font": "Outfit, Inter, sans-serif",
        "monospace_font": "JetBrains Mono, monospace"
    },
    "logo_guidelines": {
        "min_clearspace_ratio": 0.25,
        "min_width_px": 120,
        "monochrome_allowed": True,
        "prohibited_modifications": ["Do not drop-shadow", "Do not stretch aspect ratio", "Do not alter gradient angle"]
    }
}

DEFAULT_REVIEWS = [
    {
        "id": "REV-101",
        "title": "Q4 Social Campaign - AI Generated Draft",
        "author": "Apex Digital Agency",
        "department": "Performance Marketing",
        "channel": "LinkedIn / X Ads",
        "content": "Our platform is trusted by 10,000 customers and is the best in class. Get cheap starting tiers at $199/month with guaranteed ROI for all users!",
        "score": 42,
        "status": "FLAGGED",
        "timestamp": "2024-10-24 14:30:00",
        "issues_count": 6,
        "reviewer": "Unassigned"
    },
    {
        "id": "REV-102",
        "title": "Cloud Migration Press Release Draft",
        "author": "Jessica Reed",
        "department": "PR & Communications",
        "channel": "PR Newswire",
        "content": "NovaPulse announces SOC 2 Type II and HIPAA certifications, powering over 4,000 enterprise members with 99.95% uptime SLA.",
        "score": 96,
        "status": "APPROVED",
        "timestamp": "2024-10-25 09:15:00",
        "issues_count": 0,
        "reviewer": "Marcus Vance (VP Marketing)"
    },
    {
        "id": "REV-103",
        "title": "Technical Blog: Latency Benchmarks",
        "author": "Liam Taylor",
        "department": "Developer Relations",
        "channel": "Tech Blog",
        "content": "Nova Pulse delivers sub-50ms p95 streaming latency. Our game-changing synergy provides 100% secure analytics for cloud users.",
        "score": 58,
        "status": "CHANGES_REQUESTED",
        "timestamp": "2024-10-25 16:45:00",
        "issues_count": 5,
        "reviewer": "Elena Rostova (Head of Growth)"
    }
]

DEFAULT_AUDIT_LOG = [
    {
        "id": "AUD-001",
        "timestamp": "2024-10-25 09:18:22",
        "user": "Marcus Vance (VP Marketing)",
        "action": "APPROVED_CONTENT",
        "details": "Approved REV-102 'Cloud Migration Press Release Draft' with score 96/100."
    },
    {
        "id": "AUD-002",
        "timestamp": "2024-10-25 17:02:11",
        "user": "Elena Rostova (Head of Growth)",
        "action": "REQUESTED_CHANGES",
        "details": "Requested revision on REV-103: 'Expired benchmark cited and unapproved 100% security claim'."
    },
    {
        "id": "AUD-003",
        "timestamp": "2024-10-26 10:05:00",
        "user": "System (AI Guardrail API)",
        "action": "AUTOMATED_SCAN",
        "details": "API verified payload from external LangChain worker; flagged 3 terminology errors."
    }
]


class Store:
    def __init__(self):
        self.ledger: List[Dict[str, Any]] = []
        self.voice_rules: List[Dict[str, Any]] = []
        self.policy_rules: List[Dict[str, Any]] = []
        self.visual_rules: Dict[str, Any] = {}
        self.reviews: List[Dict[str, Any]] = []
        self.audit_log: List[Dict[str, Any]] = []
        self.load()

    def load(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.ledger = data.get("ledger", DEFAULT_LEDGER)
                    self.voice_rules = data.get("voice_rules", DEFAULT_VOICE_RULES)
                    self.policy_rules = data.get("policy_rules", DEFAULT_POLICY_RULES)
                    self.visual_rules = data.get("visual_rules", DEFAULT_VISUAL_RULES)
                    self.reviews = data.get("reviews", DEFAULT_REVIEWS)
                    self.audit_log = data.get("audit_log", DEFAULT_AUDIT_LOG)
                    return
            except Exception as e:
                print(f"Error loading data file, falling back to seed defaults: {e}")
        self.reset_to_seed()

    def save(self):
        data = {
            "ledger": self.ledger,
            "voice_rules": self.voice_rules,
            "policy_rules": self.policy_rules,
            "visual_rules": self.visual_rules,
            "reviews": self.reviews,
            "audit_log": self.audit_log
        }
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    def reset_to_seed(self):
        self.ledger = [dict(x) for x in DEFAULT_LEDGER]
        self.voice_rules = [dict(x) for x in DEFAULT_VOICE_RULES]
        self.policy_rules = [dict(x) for x in DEFAULT_POLICY_RULES]
        self.visual_rules = dict(DEFAULT_VISUAL_RULES)
        self.reviews = [dict(x) for x in DEFAULT_REVIEWS]
        self.audit_log = [dict(x) for x in DEFAULT_AUDIT_LOG]
        self.save()

    def add_audit(self, user: str, action: str, details: str):
        entry = {
            "id": f"AUD-{len(self.audit_log) + 1:03d}",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "user": user,
            "action": action,
            "details": details
        }
        self.audit_log.insert(0, entry)
        self.save()


db = Store()
