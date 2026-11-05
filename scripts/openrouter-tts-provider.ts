/** OpenRouter TTS adapter. It runs only in the production/build pipeline, never in src/. */
import { assertScriptApproved, MediaProductionError, type TtsProvider, type TtsRequest, type TtsResult } from './media-provider';
import { measureWavDuration } from './openai-tts-provider';

const endpoint = 'https://openrouter.ai/api/v1/audio/speech';
type FetchLike = typeof fetch;
export type OpenRouterTtsOptions = { apiKey?: string; model?: string; fetchImpl?: FetchLike };

/**
 * Model and voice stay explicit configuration: OpenRouter's catalog varies by
 * provider, so a release must record the exact pair used for each narration.
 */
export class OpenRouterTtsProvider implements TtsProvider {
  readonly id = 'openrouter-audio-speech';
  readonly #apiKey: string;
  readonly #model: string;
  readonly #fetch: FetchLike;
  constructor(options: OpenRouterTtsOptions = {}) {
    this.#apiKey = options.apiKey ?? process.env.OPENROUTER_API_KEY ?? '';
    this.#model = options.model ?? process.env.OPENROUTER_TTS_MODEL ?? '';
    this.#fetch = options.fetchImpl ?? fetch;
  }

  async synthesize(request: TtsRequest): Promise<TtsResult> {
    assertScriptApproved(request.script);
    if (!this.#apiKey || !this.#model) throw new MediaProductionError('PROVIDER_UNAVAILABLE', 'OPENROUTER_API_KEY ou OPENROUTER_TTS_MODEL est absente du contexte serveur.');
    if (request.format !== 'wav') throw new MediaProductionError('INVALID_PROVIDER_OUTPUT', 'Le pipeline OpenRouter exige WAV pour mesurer la durée sans ffprobe.');
    request.signal?.throwIfAborted();
    let response: Response;
    try {
      response = await this.#fetch(endpoint, { method: 'POST', signal: request.signal, headers: { Authorization: `Bearer ${this.#apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: this.#model, input: request.script.text, voice: request.voice, response_format: 'wav', speed: 1 }) });
    } catch (error) {
      if (request.signal?.aborted) throw error;
      throw new MediaProductionError('PROVIDER_UNAVAILABLE', `Appel TTS OpenRouter indisponible : ${error instanceof Error ? error.message : 'erreur réseau'}`);
    }
    if (!response.ok || !response.headers.get('content-type')?.startsWith('audio/')) throw new MediaProductionError('PROVIDER_UNAVAILABLE', `Appel TTS OpenRouter refusé ou non audio (${response.status}).`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    return { bytes, mimeType: 'audio/wav', durationSeconds: measureWavDuration(bytes), provider: this.id, providerModel: this.#model, scriptId: request.script.id, scriptRevision: request.script.revision, locale: request.script.locale, status: 'EN_REVUE' };
  }
}
