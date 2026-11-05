import { describe, expect, it, vi } from 'vitest';
import { produceNarration, type NarrationScript } from '../scripts/media-provider';
import { OpenAiTtsProvider } from '../scripts/openai-tts-provider';

const approved = (locale: 'fr' | 'ar' = 'fr'): NarrationScript => ({
  id: 'TEST-ONLY-NARRATION', revision: 'test-r1', locale, text: 'Script de test technique uniquement.', status: 'APPROUVE', references: ['TEST-ONLY-REFERENCE'],
  approvals: ['historique', 'linguistique', 'droits'].map(dimension => ({ dimension: dimension as 'historique' | 'linguistique' | 'droits', revision: 'test-r1', decision: 'APPROUVE' as const, evidence: 'TEST ONLY — not evidence for publication' })),
});
function wav(seconds = 180) {
  const byteRate = 1000; const dataLength = seconds * byteRate; const bytes = new Uint8Array(44 + dataLength); const view = new DataView(bytes.buffer);
  bytes.set([...'RIFF'].map(char => char.charCodeAt(0)), 0); view.setUint32(4, bytes.length - 8, true); bytes.set([...'WAVEfmt '].map(char => char.charCodeAt(0)), 8); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 1000, true); view.setUint32(28, byteRate, true); view.setUint16(32, 1, true); view.setUint16(34, 8, true); bytes.set([...'data'].map(char => char.charCodeAt(0)), 36); view.setUint32(40, dataLength, true); return bytes;
}
describe('OpenAI TTS adapter', () => {
  it('calls the server endpoint only for an approved script and measures WAV duration', async () => {
    const fetchImpl = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(async () => new Response(wav(), { status: 200 }));
    const provider = new OpenAiTtsProvider({ apiKey: 'test-key-never-a-secret', fetchImpl: fetchImpl as unknown as typeof fetch });
    const result = await produceNarration(provider, { script: approved(), voice: 'marin', format: 'wav' });
    expect(result).toMatchObject({ durationSeconds: 180, mimeType: 'audio/wav', provider: 'openai-audio-speech', status: 'EN_REVUE' });
    const [url, options] = fetchImpl.mock.calls[0]!; expect(url).toBe('https://api.openai.com/v1/audio/speech'); expect(JSON.parse(String(options?.body))).toMatchObject({ model: 'gpt-4o-mini-tts', voice: 'marin', response_format: 'wav' });
  });
  it('does not make a request for an unapproved script or when a key is absent', async () => {
    const fetchImpl = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(); const provider = new OpenAiTtsProvider({ fetchImpl: fetchImpl as unknown as typeof fetch }); const script = approved(); script.status = 'EN_REVUE';
    await expect(produceNarration(provider, { script, voice: 'cedar', format: 'wav' })).rejects.toMatchObject({ code: 'SCRIPT_NOT_APPROVED' }); expect(fetchImpl).not.toHaveBeenCalled();
    await expect(produceNarration(new OpenAiTtsProvider({ apiKey: '', fetchImpl: fetchImpl as unknown as typeof fetch }), { script: approved('ar'), voice: 'cedar', format: 'wav' })).rejects.toMatchObject({ code: 'PROVIDER_UNAVAILABLE' });
  });
});
