/** Lists current OpenRouter speech-capable models without persisting credentials. */
import fs from 'node:fs/promises';
import path from 'node:path';

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) throw new Error('OPENROUTER_API_KEY is required in the server environment.');
const response = await fetch('https://openrouter.ai/api/v1/models?output_modalities=speech', { headers: { Authorization: `Bearer ${apiKey}` } });
if (!response.ok) throw new Error(`OpenRouter model catalog unavailable (${response.status}).`);
const payload = await response.json() as { data?: Array<{ id?: string; name?: string; supported_parameters?: string[]; architecture?: { output_modalities?: string[]; input_modalities?: string[] } }> };
const models = (payload.data ?? []).map(model => ({ id: model.id, name: model.name, outputModalities: model.architecture?.output_modalities ?? [], supportedParameters: model.supported_parameters ?? [] })).filter(model => model.id);
await fs.mkdir('reports', { recursive: true });
await fs.writeFile(path.resolve('reports/openrouter-tts-models.json'), JSON.stringify({ checkedAt: new Date().toISOString(), models }, null, 2) + '\n');
console.log(`OpenRouter returned ${models.length} speech-capable model(s).`);
for (const model of models) console.log(`${model.id} — ${model.name ?? ''}`);
