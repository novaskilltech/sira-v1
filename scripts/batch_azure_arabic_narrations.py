import asyncio
import json
import os
import sys
import aiohttp
import edge_tts

sys.stdout.reconfigure(encoding="utf-8")

# Read OPENROUTER_API_KEY
key = ""
with open(".env", "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("OPENROUTER_API_KEY="):
            key = line.split("=", 1)[1].strip().strip("\"'")
            break

if not key:
    print("Error: OPENROUTER_API_KEY not found in .env")
    sys.exit(1)

CACHE_FILE = "scripts/vocalized_arabic_texts.json"
OUT_DIR = "public/media/drafts"
os.makedirs(OUT_DIR, exist_ok=True)

# Load existing cache if any
vocalized_cache = {}
if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            vocalized_cache = json.load(f)
    except Exception as e:
        print(f"Error loading cache: {e}")

with open("scripts/extracted_arabic_texts.json", "r", encoding="utf-8") as f:
    raw_entries = json.load(f)

print(
    f"Loaded {len(raw_entries)} raw Arabic scripts. Cache has {len(vocalized_cache)} items."
)

SYSTEM_PROMPT = """أنت لغوي وإمام خبير في النحو والصرف العربي وقواعد الإعراب، متخصص في نصوص السيرة النبوية الشريفة.
مهمتك: ضبط وتشكيل النص العربي المرفق تشكيلاً تاماً وكاملاً بنسبة 100% يشمل:
1. ضبط بنية كل كلمة بالحركات التامة (الفتحة، الضمة، الكسرة، السكون، الشدة، التنوين).
2. ضبط أواخر الكلمات بدقة بالغة وفق موقعها الإعرابي (الفاعل مرفوع، المفعول منصوب، المجرور، المضاف إليه، إلخ).
3. الانتباه التام لأعلام وأسماء السيرة وأماكنها القديمة (مثل: قُرَيْشٍ، قُصَيِّ بْنِ كِلَابٍ، دَارِ النَّدْوَةِ، يَثْرِبَ، بُعَاثٍ، حِرَاءٍ، ثَوْرٍ، قُدَيْدٍ، إلخ).
4. عدم تغيير أو حذف أو استبدال أي كلمة إطلاقاً.
5. أعد النص المشكّل كاملاً فقط دون أي مقدمة أو خاتمة أو تعليق."""


async def vocalize_text(session, cid, raw_text, sem):
    if cid in vocalized_cache and vocalized_cache[cid].get("vocalized"):
        return cid, vocalized_cache[cid]["vocalized"]

    async with sem:
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": raw_text},
            ],
            "temperature": 0.1,
        }
        for attempt in range(3):
            try:
                async with session.post(
                    url, headers=headers, json=payload, timeout=60
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        vocalized = data["choices"][0]["message"][
                            "content"
                        ].strip()
                        print(f"[Vocalized] {cid} OK")
                        return cid, vocalized
                    else:
                        err_text = await resp.text()
                        print(
                            f"[Vocalize Error] {cid} status={resp.status}: {err_text[:100]}"
                        )
            except Exception as e:
                print(f"[Vocalize Exception] {cid} attempt {attempt+1}: {e}")
            await asyncio.sleep(2)
        return cid, raw_text


async def generate_audio(cid, vocalized_text, filename, sem):
    target_path = os.path.join(OUT_DIR, filename)
    async with sem:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(
                    vocalized_text, "ar-SA-HamedNeural", rate="+8%"
                )
                await comm.save(target_path)
                size = os.path.getsize(target_path)
                print(f"[Audio Generated] {cid} -> {filename} ({size} bytes)")
                return True
            except Exception as e:
                print(f"[Audio Error] {cid} attempt {attempt+1}: {e}")
                await asyncio.sleep(2)
        return False


async def main():
    voc_sem = asyncio.Semaphore(5)
    audio_sem = asyncio.Semaphore(3)

    print("\n--- PHASE 1: VOCALIZATION (TASHKEEL) ---")
    async with aiohttp.ClientSession() as session:
        tasks = []
        for cid, data in raw_entries.items():
            tasks.append(
                vocalize_text(session, cid, data["text"], voc_sem)
            )
        results = await asyncio.gather(*tasks)

    for cid, voc in results:
        vocalized_cache[cid] = {
            "filename": raw_entries[cid]["filename"],
            "vocalized": voc,
        }

    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(vocalized_cache, f, ensure_ascii=False, indent=2)
    print(f"\nVocalization complete! Saved {len(vocalized_cache)} texts.")

    print("\n--- PHASE 2: AUDIO GENERATION (AZURE HAMED +8%) ---")
    audio_tasks = []
    for cid, data in vocalized_cache.items():
        audio_tasks.append(
            generate_audio(
                cid, data["vocalized"], data["filename"], audio_sem
            )
        )
    audio_results = await asyncio.gather(*audio_tasks)

    success_count = sum(1 for r in audio_results if r)
    print(
        f"\nAudio generation finished: {success_count}/{len(audio_results)} files created."
    )


if __name__ == "__main__":
    asyncio.run(main())
