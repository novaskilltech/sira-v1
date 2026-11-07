import fs from "node:fs";

let key = process.env.OPENROUTER_API_KEY;
if (!key && fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    if (line.startsWith("OPENROUTER_API_KEY=")) {
      key = line.slice(19).trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

async function test() {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content:
            "Museum oil painting 16:9 of a tranquil palm oasis well in ancient 7th-century Hijaz under a golden sunset. Strict rule: NO humans, NO silhouettes, NO faces, NO animals.",
        },
      ],
    }),
  });
  console.log("Status:", r.status);
  const data = await r.json();
  const img = data.choices?.[0]?.message?.images?.[0];
  console.log("Has image:", !!img);
}
test().catch(console.error);
