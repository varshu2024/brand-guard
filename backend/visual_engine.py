"""
BrandGuard Visual Asset Governance Engine.
Analyzes visual creative assets (images, banners, social cards) for brand compliance:
- Extracts dominant colors and computes Delta-E / distance to approved brand palette.
- Detects off-brand or prohibited high-contrast/neon colors.
- Computes luminance contrast ratio for accessibility (WCAG AA compliance).
- Checks minimum dimension and logo clearspace guidelines.
"""

import math
from io import BytesIO
from typing import List, Dict, Any, Tuple
from PIL import Image
from database import db


def hex_to_rgb(hex_str: str) -> Tuple[int, int, int]:
    hex_str = hex_str.lstrip("#")
    if len(hex_str) == 3:
        hex_str = "".join([c*2 for c in hex_str])
    return (int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16))


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02x}{g:02x}{b:02x}".upper()


def color_distance(c1: Tuple[int, int, int], c2: Tuple[int, int, int]) -> float:
    """Euclidean distance in RGB color space normalized to 0-100 scale."""
    rmean = (c1[0] + c2[0]) / 2.0
    r = c1[0] - c2[0]
    g = c1[1] - c2[1]
    b = c1[2] - c2[2]
    # Redmean formula with standard division
    weight_r = 2.0 + rmean / 256.0
    weight_g = 4.0
    weight_b = 2.0 + (255.0 - rmean) / 256.0
    dist = math.sqrt(weight_r * r * r + weight_g * g * g + weight_b * b * b)
    return round((dist / 765.0) * 100.0, 2)


def relative_luminance(rgb: Tuple[int, int, int]) -> float:
    """WCAG 2.1 relative luminance calculation."""
    srgb = [x / 255.0 for x in rgb]
    lum = []
    for c in srgb:
        if c <= 0.03928:
            lum.append(c / 12.92)
        else:
            lum.append(((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2]


def contrast_ratio(rgb1: Tuple[int, int, int], rgb2: Tuple[int, int, int]) -> float:
    l1 = relative_luminance(rgb1)
    l2 = relative_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return round((lighter + 0.05) / (darker + 0.05), 2)


class VisualGovernanceEngine:
    def __init__(self):
        pass

    def analyze_image_bytes(self, image_bytes: bytes, filename: str = "asset.png") -> Dict[str, Any]:
        """
        Parses an uploaded image, extracts dominant color swatches,
        matches against approved brand palette, and tests accessibility contrast.
        """
        try:
            image = Image.open(BytesIO(image_bytes))
            image = image.convert("RGB")
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to decode image: {str(e)}",
                "score": 0,
                "issues": []
            }

        width, height = image.size
        aspect_ratio = round(width / max(1, height), 2)

        # Extract dominant colors using palette quantization
        thumb = image.copy()
        thumb.thumbnail((150, 150))
        quantized = thumb.quantize(colors=6, method=Image.Quantize.MEDIANCUT)
        palette = quantized.getpalette()[:18]  # top 6 RGB triplets

        extracted_colors = []
        for i in range(0, len(palette), 3):
            r, g, b = palette[i], palette[i+1], palette[i+2]
            extracted_colors.append({
                "hex": rgb_to_hex(r, g, b),
                "rgb": (r, g, b)
            })

        # Match against approved brand palette
        approved_palette = db.visual_rules.get("approved_palette", [])
        approved_rgbs = [hex_to_rgb(c["hex"]) for c in approved_palette]

        issues: List[Dict[str, Any]] = []
        matched_palette_items = []
        off_brand_colors = []

        for swatch in extracted_colors:
            s_rgb = swatch["rgb"]
            min_dist = float("inf")
            best_match = None

            for app in approved_palette:
                app_rgb = hex_to_rgb(app["hex"])
                dist = color_distance(s_rgb, app_rgb)
                if dist < min_dist:
                    min_dist = dist
                    best_match = app

            swatch_hex = swatch["hex"]
            # Tolerance threshold for palette match: within 18% distance
            if min_dist <= 18.0 and best_match:
                matched_palette_items.append({
                    "extracted_hex": swatch_hex,
                    "matched_brand_color": best_match["name"],
                    "brand_hex": best_match["hex"],
                    "role": best_match["role"],
                    "delta_e": min_dist
                })
            else:
                off_brand_colors.append({
                    "hex": swatch_hex,
                    "closest_color": best_match["name"] if best_match else "Unknown",
                    "closest_hex": best_match["hex"] if best_match else "#000000",
                    "distance": min_dist
                })

        # Check for banned neon colors
        banned_colors = db.visual_rules.get("banned_colors", [])
        for swatch in extracted_colors:
            for b_col in banned_colors:
                b_rgb = hex_to_rgb(b_col["hex"])
                dist = color_distance(swatch["rgb"], b_rgb)
                if dist < 12.0:
                    issues.append({
                        "id": f"VIS-BAN-{len(issues)+1}",
                        "type": "Prohibited Color In Use",
                        "severity": "ERROR",
                        "title": f"Prohibited Color: {b_col['name']} ({swatch['hex']})",
                        "explanation": f"The detected swatch {swatch['hex']} is within prohibited range of {b_col['name']}. {b_col.get('reason', '')}",
                        "suggested_fix": f"Replace with approved Electric Indigo (#4F46E5) or Cyber Cyan (#06B6D4)",
                        "source": "Brand Visual Identity Manual v2.4 (Prohibited Assets)"
                    })

        # Off-brand color issue if more than half colors don't match
        if len(off_brand_colors) > 3:
            issues.append({
                "id": f"VIS-PAL-{len(issues)+1}",
                "type": "Palette Deviation",
                "severity": "WARNING",
                "title": f"Off-Brand Palette Detected ({len(off_brand_colors)} unapproved colors)",
                "explanation": f"Asset contains {len(off_brand_colors)} colors deviating significantly from approved NovaPulse brand swatches.",
                "suggested_fix": f"Map swatches to NovaPulse core palette: Electric Indigo (#4F46E5), Cyber Cyan (#06B6D4), Midnight Slate (#0F172A).",
                "source": "Design System Style Guide (Color Tokens)"
            })

        # Accessibility Contrast check between top 2 extracted colors
        c_ratio = 4.5
        if len(extracted_colors) >= 2:
            c_ratio = contrast_ratio(extracted_colors[0]["rgb"], extracted_colors[1]["rgb"])
            if c_ratio < 3.0:
                issues.append({
                    "id": f"VIS-CON-{len(issues)+1}",
                    "type": "Accessibility Contrast Warning",
                    "severity": "WARNING",
                    "title": f"Low Contrast Ratio ({c_ratio}:1)",
                    "explanation": f"Contrast between primary and secondary swatches is {c_ratio}:1, below WCAG AA minimum standard (4.5:1 for body, 3.0:1 for large display).",
                    "suggested_fix": "Increase luminance difference between text and background elements.",
                    "source": "WCAG 2.1 AA / Brand Accessibility Policy"
                })

        # Dimension / Resolution check
        min_w = db.visual_rules.get("logo_guidelines", {}).get("min_width_px", 120)
        if width < min_w:
            issues.append({
                "id": f"VIS-RES-{len(issues)+1}",
                "type": "Low Resolution Asset",
                "severity": "WARNING",
                "title": f"Asset Width ({width}px) Below Minimum ({min_w}px)",
                "explanation": f"Asset will appear pixelated on high-DPI displays.",
                "suggested_fix": f"Provide vector SVG or 2x raster asset of at least {min_w * 2}px.",
                "source": "Creative Asset Specification v1.8"
            })

        # Compute visual score
        deductions = sum(25 if i["severity"] == "ERROR" else 15 for i in issues)
        visual_score = max(20, min(100, 100 - deductions))

        return {
            "success": True,
            "filename": filename,
            "dimensions": f"{width} x {height} px",
            "aspect_ratio": aspect_ratio,
            "score": visual_score,
            "contrast_ratio": c_ratio,
            "extracted_colors": [c["hex"] for c in extracted_colors],
            "matched_brand_colors": matched_palette_items,
            "off_brand_colors": off_brand_colors,
            "issues": issues,
            "verdict": "COMPLIANT" if visual_score >= 85 else ("NEEDS_ADJUSTMENT" if visual_score >= 60 else "NON_COMPLIANT")
        }


visual_engine = VisualGovernanceEngine()
