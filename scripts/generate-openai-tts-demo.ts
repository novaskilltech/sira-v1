/**
 * Produces two short, non-historical sound checks only.
 * This intentionally bypasses no publication gate: files are DEMO/NON_VALIDE,
 * unreferenced by the manifest, and cannot be mistaken for the 120 narrations.
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { measureWavDuration } from './openai-tts-provider';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error('OPENAI_API_KEY is required in the server environment to make a DEMO sound check.');
const samples = [
  { locale: 'fr', voice: 'marin', text: 'Ceci est un échantillon de voix générée par intelligence artificielle pour vérifier le lecteur audio de Sîra. Il ne contient aucun récit historique et n’est pas destiné à la publication.', instructions: 'Speak French clearly, calmly, and naturally. This is a technical sound check, not a historical narration.' },
  { locale: 'ar', voice: 'cedar', text: 'هذه عينة صوتية مولدة بالذكاء الاصطناعي للتحقق من مشغل الصوت في سيرة. لا تتضمن أي رواية تاريخية وليست مخصصة للنشر.', instructions: 'Speak clear Modern Standard Arabic at a calm pace. This is a technical sound check, not a historical narration.' },
] as const;
const output = path.resolve('public/media/demo'); await mkdir(output, { recursive: true });
const evidence: Array<Record<string, unknown>> = [];
for (const sample of samples) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice: sample.voice, input: sample.text, instructions: sample.instructions, response_format: 'wav' }) });
  if (!response.ok) throw new Error(`OpenAI DEMO TTS refused for ${sample.locale} (${response.status}).`);
  const bytes = new Uint8Array(await response.arrayBuffer()); const durationSeconds = measureWavDuration(bytes);
  const file = `tts-demo-${sample.locale}.wav`; await writeFile(path.join(output, file), bytes);
  evidence.push({ file, locale: sample.locale, provider: 'openai-audio-speech', model: 'gpt-4o-mini-tts', voice: sample.voice, durationSeconds, sha256: createHash('sha256').update(bytes).digest('hex'), status: 'DEMO_NON_VALIDE', publicationAllowed: false, statement: 'Technical AI-voice sound check only; not a historical narration.' });
  console.log(`${file}: ${durationSeconds.toFixed(2)} seconds; DEMO NON_VALIDE`);
}
await writeFile(path.join(output, 'tts-demo-provenance.json'), JSON.stringify({ generatedAt: new Date().toISOString(), samples: evidence }, null, 2) + '\n');
