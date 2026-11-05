import { describe, expect, it, vi } from 'vitest';
import { produceNarration, type NarrationScript } from '../scripts/media-provider';
import { OpenRouterTtsProvider } from '../scripts/openrouter-tts-provider';

const script: NarrationScript = { id: 'TEST-ONLY-OPENROUTER', revision: 'test-r1', locale: 'ar', text: 'نص اختبار تقني فقط.', status: 'APPROUVE', references: ['TEST-ONLY-REFERENCE'], approvals: ['historique', 'linguistique', 'droits'].map(dimension => ({ dimension: dimension as 'historique' | 'linguistique' | 'droits', revision: 'test-r1', decision: 'APPROUVE' as const, evidence: 'TEST ONLY — no publication evidence' })) };
function wav(seconds = 180) { const dataLength = seconds * 1000; const bytes = new Uint8Array(44 + dataLength); const view = new DataView(bytes.buffer); bytes.set([...'RIFF'].map(char => char.charCodeAt(0)), 0); view.setUint32(4, bytes.length - 8, true); bytes.set([...'WAVEfmt '].map(char => char.charCodeAt(0)), 8); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 1000, true); view.setUint32(28, 1000, true); view.setUint16(32, 1, true); view.setUint16(34, 8, true); bytes.set([...'data'].map(char => char.charCodeAt(0)), 36); view.setUint32(40, dataLength, true); return bytes; }
describe('OpenRouter TTS adapter', () => {
  it('sends a revision-approved WAV request to the documented speech endpoint', async () => {
    const fetchImpl = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(async () => new Response(wav(), { status: 200, headers: { 'content-type': 'audio/wav' } }));
    const provider = new OpenRouterTtsProvider({ apiKey: 'test-key-never-a-secret', model: 'test/speech', fetchImpl: fetchImpl as unknown as typeof fetch });
    const result = await produceNarration(provider, { script, voice: 'test-voice', format: 'wav' });
    expect(result).toMatchObject({ durationSeconds: 180, provider: 'openrouter-audio-speech', providerModel: 'test/speech', status: 'EN_REVUE' });
    const [url, options] = fetchImpl.mock.calls[0]!; expect(url).toBe('https://openrouter.ai/api/v1/audio/speech'); expect(JSON.parse(String(options?.body))).toMatchObject({ model: 'test/speech', voice: 'test-voice', response_format: 'wav' });
  });
  it('rejects non-audio responses without writing a narration', async () => {
    const fetchImpl = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(async () => new Response('{"error":"no"}', { status: 429, headers: { 'content-type': 'application/json' } }));
    const provider = new OpenRouterTtsProvider({ apiKey: 'test-key-never-a-secret', model: 'test/speech', fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(produceNarration(provider, { script, voice: 'test-voice', format: 'wav' })).rejects.toMatchObject({ code: 'PROVIDER_UNAVAILABLE' });
  });
});
