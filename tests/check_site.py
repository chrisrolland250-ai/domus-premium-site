#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Minimal checks for domuspremium.fr static site (index.html).
Pure stdlib: regex-based parsing.
Usage:
  python tests/check_site.py [path_to_root]
Defaults to current directory (".").
Exit code 0 on success, non-zero on failure.
"""
import sys, re, json
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
INDEX = ROOT / "index.html"

def fail(msg):
    print("❌", msg)
    sys.exit(1)

def ok(msg):
    print("✅", msg)

if not INDEX.exists():
    fail(f"index.html introuvable à {INDEX.resolve()}")

html = INDEX.read_text(encoding="utf-8", errors="ignore")

# --- 1) Menu order & presence ---
m = re.search(r'(<nav[^>]*id="primary-nav"[^>]*>)(.*?)(</nav>)', html, re.I|re.S)
if not m:
    fail("Bloc <nav id='primary-nav'> introuvable")

inner = m.group(2)

def has_link(anchor, label):
    return re.search(rf'href="{re.escape(anchor)}"[^>]*>\s*{re.escape(label)}\s*<', inner, re.I) is not None

expected = [
    ("#services", "Prestations"),
    ("#tarifs", "Tarifs"),
    ("#zone", "Zone"),
    ("#realisations", "Nos réalisations"),
    ("#faq", "FAQ"),
    ("#contact", "Contact"),
]

for a, lbl in expected:
    if not has_link(a, lbl):
        fail(f"Menu: lien manquant → {lbl} ({a})")

# Check relative order
labels_in_nav = [lbl for lbl, _ in re.findall(r'>([^<]+)</a>', inner)]
# Simplify spaces
labels_in_nav = [s.strip() for s in labels_in_nav if s.strip()]
# Only keep labels we care about (in their first occurrence)
order_found = []
for _, lbl in expected:
    for i, s in enumerate(labels_in_nav):
        if s.lower() == lbl.lower():
            order_found.append((lbl, i))
            break

# Ensure increasing positions
positions = [i for _, i in order_found]
if positions != sorted(positions):
    fail(f"Menu: ordre incorrect. Trouvé: {order_found}")

ok("Menu: liens présents et ordre correct (Prestations · Tarifs · Zone · Nos réalisations · FAQ · Contact)")

# --- 2) Section presence ---
for sid in ("services", "tarifs", "zone", "realisations", "faq", "contact"):
    if not re.search(rf'<section[^>]+id="{sid}"', html, re.I):
        fail(f"Section #{sid} manquante")
ok("Sections obligatoires: OK")

# --- 3) Performance hints ---
# CSS preload
if not re.search(r'rel="preload"\s+href="css/styles\.min\.css"\s+as="style"', html, re.I):
    fail("Preload CSS manquant (rel='preload' href='css/styles.min.css' as='style')")
ok("Preload CSS: OK")

# Hero responsive <picture> with fetchpriority
if not re.search(r'<picture>.*?hero-(?:640|960|1280)\.webp.*?</picture>', html, re.I|re.S):
    fail("Hero responsive WebP manquant (srcset hero-640/960/1280.webp)")
if 'fetchpriority="high"' not in html.lower():
    fail("Hero: fetchpriority='high' manquant")
ok("Hero responsive: OK")

# --- 4) Gallery images: WebP + srcset/sizes + lazy ---
gal = re.search(r'<section[^>]+id="realisations"[\s\S]*?</section>', html, re.I)
if not gal:
    fail("Section #realisations introuvable")
ghtml = gal.group(0)
# At least one <picture> with webp and srcset variants 240/480/720
if not re.search(r'<source[^>]+type="image/webp"[^>]+srcset="[^"]*(?:240\.webp|480\.webp|720\.webp)', ghtml, re.I):
    fail("Galerie: <source type='image/webp' srcset='...240/480/720.webp'> manquant")
if not re.search(r'sizes="[^"]+"', ghtml, re.I):
    fail("Galerie: attribut sizes manquant")
if not re.search(r'<img[^>]+loading="lazy"', ghtml, re.I):
    fail("Galerie: loading='lazy' manquant sur <img>")
ok("Galerie inline optimisée: OK")

print("🎉 Tous les checks sont PASSÉS")
sys.exit(0)
