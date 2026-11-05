/** OpenAI Audio Speech adapter. It runs only in the production/build pipeline, never in src/. */
import { assertScriptApproved, MediaProductionError, type TtsProvider, type TtsRequest, type TtsResult } from './media-provider';

const endpoint = 'https://api.openai.com/v1/audio/speech';
type FetchLike = typeof fetch;
export type OpenAiTtsOptions = { apiKey?: string; model?: string; fetchImpl?: FetchLike };

export function measureWavDuration(bytes: Uint8Array): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.byteLength < 44 || String.fromCharCode(...bytes.subarray(0, 4)) !== 'RIFF' || String.fromCharCode(...bytes.subarray(8, 12)) !== 'WAVE') throw new MediaProductionError('INVALID_PROVIDER_OUTPUT', 'La réponse TTS n’est pas un WAV valide.');
  let cursor = 12; let byteRate = 0; let dataLength = 0;
  while (cursor + 8 <= bytes.byteLength) {
    const id = String.fromCharCode(...bytes.subarray(cursor, cursor + 4)); const length = view.getUint32(cursor + 4, true); cursor += 8;
    if (cursor + length > bytes.byteLength) throw new MediaProductionError('INVALID_PROVIDER_OUTPUT', 'Le WAV retourné est tronqué.');
    if (id === 'fmt ' && length >= 16) byteRate = view.getUint32(cursor + 8, true);
    if (id === 'data') { dataLength = length; break; }
    cursor += length + (length % 2);
  }
  if (!byteRate || !dataLength) throw new MediaProductionError('INVALID_PROVIDER_OUTPUT', 'Le WAV retourné ne contient pas de durée mesurable.');
  return dataLength / byteRate;
}

/**
 * The current Speech API supports WAV and input up to 4096 characters.
 * WAV is deliberately required here so the release pipeline measures duration
 * without depending on a host ffprobe installation.
 */
export class OpenAiTtsProvider implements TtsProvider {
  readonly id = 'openai-audio-speech';
  readonly #apiKey: string;
  readonly #model: string;
  readonly #fetch: FetchLike;
  constructor(options: OpenAiTtsOptions = {}) {
    this.#apiKey = options.apiKey ?? process.env.OPENAI_API_KEY ?? '';
    this.#model = options.model ?? 'gpt-4o-mini-tts';
    this.#fetch = options.fetchImpl ?? fetch;
  }

  async synthesize(request: TtsRequest): Promise<TtsResult> {
    assertScriptApproved(request.script);
    if (!this.#apiKey) throw new MediaProductionError('PROVIDER_UNAVAILABLE', 'OPENAI_API_KEY est absente du contexte serveur.');
    if (request.format !== 'wav') throw new MediaProductionError('INVALID_PROVIDER_OUTPUT', 'Le fournisseur OpenAI est configuré en WAV pour mesurer la durée de publication.');
    if (request.script.text.length > 4096) throw new MediaProductionError('INVALID_PROVIDER_OUTPUT', 'Le script dépasse la limite de 4096 caractères de l’API TTS. Le découper en segments revus.');
    request.signal?.throwIfAborted();
    let response: Response;
    try {
      response = await this.#fetch(endpoint, { method: 'POST', signal: request.signal, headers: { Authorization: `Bearer ${this.#apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: this.#model, voice: request.voice, input: request.script.text, response_format: 'wav', instructions: request.pronunciationGuide }) });
    } catch (error) {
      if (request.signal?.aborted) throw error;
      throw new MediaProductionError('PROVIDER_UNAVAILABLE', `Appel TTS OpenAI indisponible : ${error instanceof Error ? error.message : 'erreur réseau'}`);
    }
    if (!response.ok) throw new MediaProductionError('PROVIDER_UNAVAILABLE', `Appel TTS OpenAI refusé (${response.status}).`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    return { bytes, mimeType: 'audio/wav', durationSeconds: measureWavDuration(bytes), provider: this.id, providerModel: this.#model, scriptId: request.script.id, scriptRevision: request.script.revision, locale: request.script.locale, status: 'EN_REVUE' };
  }
}
