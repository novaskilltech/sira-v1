/** Server/build-side integration boundary. Never import provider secrets into src/. */
export type MediaLocale = 'fr' | 'ar'
export type ReviewState = 'BROUILLON' | 'EN_REVUE' | 'APPROUVE' | 'REFUSE'
export type ScriptReviewDimension = 'historique' | 'linguistique' | 'droits'

export interface ScriptApproval {
  dimension: ScriptReviewDimension
  revision: string
  decision: ReviewState
  evidence: string
}

export interface NarrationScript {
  id: string
  revision: string
  locale: MediaLocale
  text: string
  status: ReviewState | 'DEMO'
  references: string[]
  approvals: ScriptApproval[]
}

export interface TtsRequest {
  script: NarrationScript
  voice: string
  pronunciationGuide?: string
  format: 'wav' | 'mp3'
  signal?: AbortSignal
}

export interface TtsResult {
  bytes: Uint8Array
  mimeType: 'audio/wav' | 'audio/mpeg'
  durationSeconds: number
  provider: string
  providerModel: string
  scriptId: string
  scriptRevision: string
  locale: MediaLocale
  /** Generation is not pronunciation, historical or rights approval. */
  status: 'EN_REVUE'
}

export interface TtsProvider {
  readonly id: string
  synthesize(request: TtsRequest): Promise<TtsResult>
}

export class MediaProductionError extends Error {
  readonly code: 'SCRIPT_NOT_APPROVED' | 'PROVIDER_UNAVAILABLE' | 'INVALID_PROVIDER_OUTPUT'
  constructor(code: 'SCRIPT_NOT_APPROVED' | 'PROVIDER_UNAVAILABLE' | 'INVALID_PROVIDER_OUTPUT', message: string) {
    super(message)
    this.code = code
    this.name = 'MediaProductionError'
  }
}

/** Checks revision-specific review evidence before any provider can be called. */
export function assertScriptApproved(script: NarrationScript): void {
  const required: ScriptReviewDimension[] = ['historique', 'linguistique', 'droits']
  const valid = script.status === 'APPROUVE' && script.text.trim().length > 0 && script.revision.trim().length > 0
    && script.references.some((reference) => reference.trim().length > 0)
    && required.every((dimension) => script.approvals.some((approval) => approval.dimension === dimension
      && approval.revision === script.revision && approval.decision === 'APPROUVE' && approval.evidence.trim().length > 0))
    && !script.approvals.some((approval) => approval.revision === script.revision && approval.decision === 'REFUSE')
  if (!valid) throw new MediaProductionError('SCRIPT_NOT_APPROVED', `Production bloquée : script ${script.id} non approuvé pour sa révision courante.`)
}

/** Plug an authorized provider in here later; model and credentials remain server-side. */
export async function produceNarration(provider: TtsProvider, request: TtsRequest): Promise<TtsResult> {
  assertScriptApproved(request.script)
  request.signal?.throwIfAborted()
  const result = await provider.synthesize(request)
  request.signal?.throwIfAborted()
  const expectedMime = request.format === 'wav' ? 'audio/wav' : 'audio/mpeg'
  if (!result.bytes.length || !Number.isFinite(result.durationSeconds) || result.durationSeconds < 180 || result.durationSeconds > 300
    || result.scriptId !== request.script.id || result.scriptRevision !== request.script.revision
    || result.locale !== request.script.locale || result.mimeType !== expectedMime
    || !result.provider.trim() || !result.providerModel.trim()) {
    throw new MediaProductionError('INVALID_PROVIDER_OUTPUT', 'La sortie audio ne correspond pas au script ou au format et à la durée attendus (180–300 s).')
  }
  return { ...result, status: 'EN_REVUE' }
}

/** Default implementation: explicit, testable absence of a configured service. */
export class UnconfiguredTtsProvider implements TtsProvider {
  readonly id = 'unconfigured'
  async synthesize(request: TtsRequest): Promise<TtsResult> {
    assertScriptApproved(request.script)
    throw new MediaProductionError('PROVIDER_UNAVAILABLE', 'Aucun fournisseur TTS autorisé et configuré. Utiliser uniquement les signaux DEMO pour les essais techniques.')
  }
}
