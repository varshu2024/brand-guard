"""
Generates sample visual banner assets for test demonstration:
1. Compliant NovaPulse Brand Banner (uses Electric Indigo, Cyber Cyan, Midnight Slate)
2. Off-brand Banner (uses prohibited Neon Green, Garish Yellow, low contrast)
"""

import os
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "sample_assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_assets():
    # 1. Compliant Banner
    w, h = 800, 400
    compliant_img = Image.new("RGB", (w, h), color="#0F172A") # Midnight Slate background
    draw = ImageDraw.Draw(compliant_img)
    
    # Electric Indigo and Cyber Cyan shapes
    draw.rectangle([40, 40, 760, 360], outline="#4F46E5", width=4)
    draw.rounded_rectangle([60, 60, 400, 340], radius=16, fill="#4F46E5")
    draw.ellipse([450, 100, 700, 300], fill="#06B6D4")
    draw.rectangle([100, 280, 280, 320], fill="#10B981") # Emerald Spark button
    
    compliant_path = os.path.join(ASSETS_DIR, "compliant_brand_banner.png")
    compliant_img.save(compliant_path)
    print(f"Generated: {compliant_path}")

    # 2. Off-Brand Banner with Prohibited Neon
    offbrand_img = Image.new("RGB", (w, h), color="#FFFF00") # Garish Yellow
    draw_off = ImageDraw.Draw(offbrand_img)
    draw_off.rectangle([30, 30, 770, 370], fill="#00FF00") # Prohibited Neon Green
    draw_off.ellipse([200, 50, 600, 350], fill="#FF00FF")  # Magenta
    
    offbrand_path = os.path.join(ASSETS_DIR, "offbrand_neon_banner.png")
    offbrand_img.save(offbrand_path)
    print(f"Generated: {offbrand_path}")

if __name__ == "__main__":
    generate_assets()
