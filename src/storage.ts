import { z } from 'zod';
const schema = z.object({ locale: z.enum(['fr','ar']).default('fr'), lastContentId: z.string().optional(), lastSectionId: z.string().optional(), lastVisitedRoute: z.string().optional(), audioPositionsByContentLocale: z.record(z.string(),z.number().nonnegative().finite()).default({}), reducedMotionOverride: z.boolean().optional(), updatedAt: z.string().optional() });
export type Preferences = z.infer<typeof schema>;
export const storageKey = 'sira.preferences.v1';
export function loadPreferences(): Preferences {
 try { return schema.parse(JSON.parse(localStorage.getItem(storageKey) || '{}')); }
 catch { try { localStorage.removeItem(storageKey); } catch { /* storage unavailable */ } return schema.parse({}); }
}
export function savePreferences(p: Preferences) { try { localStorage.setItem(storageKey, JSON.stringify({...p,updatedAt:new Date().toISOString()})); } catch { /* Private mode: session remains usable. */ } }
