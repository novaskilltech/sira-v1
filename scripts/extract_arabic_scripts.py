import glob
import json
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

with open("public/content/manifest.v1.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

content_ids = [c["id"] for c in manifest["contents"]]
script_files = ["scripts/generate-pilot-narrations.mjs"] + sorted(
    glob.glob("scripts/generate-lot-*-narrations.mjs")
)

all_arabic_entries = {}

for sf in script_files:
    with open(sf, "r", encoding="utf-8") as f:
        text = f.read()

    # Pattern 1: contentId: "...", locale: "ar", filename: "...", text: `...`
    p1 = re.compile(
        r'contentId:\s*["\']([^"\']+)["\'],\s*locale:\s*["\']ar["\'],\s*filename:\s*["\']([^"\']+)["\'],[\s\S]*?text:\s*`([\s\S]*?)`',
        re.MULTILINE,
    )
    for m in p1.finditer(text):
        cid, fn, content_text = m.groups()
        all_arabic_entries[cid] = {"filename": fn, "text": content_text.strip()}

    # Pattern 2: id: "...", lang: "ar", filename: "...", text: `...`
    p2 = re.compile(
        r'id:\s*["\']([^"\']+)["\'],\s*lang:\s*["\']ar["\'],\s*filename:\s*["\']([^"\']+)["\'],[\s\S]*?text:\s*`([\s\S]*?)`',
        re.MULTILINE,
    )
    for m in p2.finditer(text):
        cid, fn, content_text = m.groups()
        all_arabic_entries[cid] = {"filename": fn, "text": content_text.strip()}

print(f"Extracted Arabic entries: {len(all_arabic_entries)}")
missing = [cid for cid in content_ids if cid not in all_arabic_entries]
print(f"Missing IDs: {missing}")

# Save extracted entries to JSON
with open("scripts/extracted_arabic_texts.json", "w", encoding="utf-8") as f:
    json.dump(all_arabic_entries, f, ensure_ascii=False, indent=2)
print("Saved to scripts/extracted_arabic_texts.json")
