import os
import requests

key = ""
with open(".env", "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("OPENROUTER_API_KEY="):
            key = line.split("=", 1)[1].strip().strip("\"'")
            break

headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
payload = {
    "model": "openai/gpt-4o-mini",
    "messages": [
        {
            "role": "system",
            "content": "أنت لغوي خبير في النحو والصرف العربي والسيرة النبوية. مهمتك وضع التشكيل التام الدقيق (الحركات والسكنات والتنوين والشدة وضبط أواخر الكلم وفق الإعراب) للنص دون تغيير أي كلمة أو إضافة مقدمات.",
        },
        {
            "role": "user",
            "content": "مكة المكرمة : الإطار الجغرافي والاجتماعي. في القرن السادس الميلادي، تميزت شبه الجزيرة العربية بتنوع بيئاتها.",
        },
    ],
}
r = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers=headers,
    json=payload,
    timeout=30,
)
print("STATUS:", r.status_code)
print(r.json()["choices"][0]["message"]["content"])
