/** Generates two short, non-historical OpenRouter TTS sound checks only. */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) throw new Error('OPENROUTER_API_KEY is required in the server environment.');
const model = process.env.OPENROUTER_TTS_MODEL ?? 'x-ai/grok-voice-tts-1.0';
const samples = [
  { locale: 'fr', voice: process.env.OPENROUTER_TTS_VOICE_FR ?? 'ara', text: 'Ceci est un échantillon de voix générée par intelligence artificielle pour vérifier le lecteur audio de Sîra. Il ne contient aucun récit historique et n’est pas destiné à la publication.' },
  { locale: 'ar', voice: process.env.OPENROUTER_TTS_VOICE_AR ?? 'ara', text: 'هذه عينة صوتية مولدة بالذكاء الاصطناعي للتحقق من مشغل الصوت في سيرة. لا تتضمن أي رواية تاريخية وليست مخصصة للنشر.' },
] as const;
const output = path.resolve('public/media/demo'); await mkdir(output, { recursive: true });
const evidence: Array<Record<string, unknown>> = [];
for (const sample of samples) {
  const response = await fetch('https://openrouter.ai/api/v1/audio/speech', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, input: sample.text, voice: sample.voice, response_format: 'mp3', speed: 1 }) });
  if (!response.ok) throw new Error(`OpenRouter DEMO TTS refused for ${sample.locale} (${response.status}): ${(await response.text()).slice(0, 500)}`);
  if (!response.headers.get('content-type')?.startsWith('audio/')) throw new Error(`OpenRouter DEMO TTS returned a non-audio response for ${sample.locale}.`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const file = `tts-demo-${sample.locale}-openrouter.mp3`; await writeFile(path.join(output, file), bytes);
  evidence.push({ file, locale: sample.locale, provider: 'openrouter', model, voice: sample.voice, durationSeconds: null, sha256: createHash('sha256').update(bytes).digest('hex'), status: 'DEMO_NON_VALIDE', publicationAllowed: false, statement: 'Technical AI-voice sound check only; MP3 duration intentionally not used for publication.' });
  console.log(`${file}: ${bytes.length} bytes; DEMO NON VALIDE`);
}
await writeFile(path.join(output, 'tts-demo-openrouter-provenance.json'), JSON.stringify({ generatedAt: new Date().toISOString(), samples: evidence }, null, 2) + '\n');
