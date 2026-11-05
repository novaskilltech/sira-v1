import { describe, expect, it, vi } from 'vitest';
import { loadPreferences, savePreferences, storageKey } from '../src/storage';

describe('local, nonessential preferences', () => {
  it('starts safely without stored data', () => {
    expect(loadPreferences()).toEqual({ locale: 'fr', audioPositionsByContentLocale: {} });
  });

  it('round-trips language, route, section, motion and independent narration positions', () => {
    savePreferences({
      locale: 'ar', lastContentId: 'CHR-01', lastSectionId: 'recit', lastVisitedRoute: '/chronologie/CHR-01',
      audioPositionsByContentLocale: { 'CHR-01:fr': 61.5, 'CHR-01:ar': 19 }, reducedMotionOverride: true,
    });
    const prefs = loadPreferences();
    expect(prefs).toMatchObject({
      locale: 'ar', lastContentId: 'CHR-01', lastSectionId: 'recit', lastVisitedRoute: '/chronologie/CHR-01',
      audioPositionsByContentLocale: { 'CHR-01:fr': 61.5, 'CHR-01:ar': 19 }, reducedMotionOverride: true,
    });
    expect(Number.isNaN(Date.parse(prefs.updatedAt!))).toBe(false);
  });

  it.each([
    '{not json', 'null', '[]', '{"locale":"de"}',
    '{"locale":"fr","audioPositionsByContentLocale":{"CHR-01:fr":-1}}',
    '{"locale":"fr","audioPositionsByContentLocale":{"CHR-01:fr":null}}',
  ])('recovers from corrupt or unsupported preferences: %s', stored => {
    localStorage.setItem(storageKey, stored);
    expect(loadPreferences()).toEqual({ locale: 'fr', audioPositionsByContentLocale: {} });
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('ignores unknown fields instead of restoring unrelated data', () => {
    localStorage.setItem(storageKey, JSON.stringify({ locale: 'ar', visitorId: 'not-allowed', coordinates: [1, 2] }));
    expect(loadPreferences()).toEqual({ locale: 'ar', audioPositionsByContentLocale: {} });
  });

  it('does not block reading when browser storage and its cleanup are unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Storage disabled', 'SecurityError'); });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new DOMException('Storage disabled', 'SecurityError'); });
    expect(loadPreferences()).toEqual({ locale: 'fr', audioPositionsByContentLocale: {} });
  });

  it('survives quota failure and keeps the previous valid saved state', () => {
    savePreferences({ locale: 'fr', audioPositionsByContentLocale: { 'CHR-01:fr': 20 } });
    const before = localStorage.getItem(storageKey);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Quota reached', 'QuotaExceededError'); });
    expect(() => savePreferences({ locale: 'ar', audioPositionsByContentLocale: {} })).not.toThrow();
    expect(localStorage.getItem(storageKey)).toBe(before);
  });
});
