import { describe, expect, it, vi } from 'vitest';
import { NarrationController, narration } from '../src/audio';

function player() {
  const element = new Audio();
  const play = vi.spyOn(element, 'play').mockResolvedValue(undefined);
  const pause = vi.spyOn(element, 'pause').mockImplementation(() => {});
  const controller = new NarrationController(element);
  const metadata = (duration = 240) => {
    Object.defineProperty(element, 'duration', { configurable: true, value: duration });
    element.dispatchEvent(new Event('loadedmetadata'));
  };
  const tick = (time: number) => {
    element.currentTime = time;
    element.dispatchEvent(new Event('timeupdate'));
  };
  return { element, controller, play, pause, metadata, tick };
}

describe('exclusive, voluntary narration', () => {
  it('shares one controller across the application', () => {
    expect(narration()).toBe(narration());
    expect(narration().element.preload).toBe('none');
  });

  it('does not play on selecting a fiche, loading metadata or seeking', () => {
    const { controller, play, metadata } = player();
    controller.select('CHR-01:fr', '/media/test/fr.mp3', 12);
    metadata();
    expect(controller.getSnapshot()).toMatchObject({ key: 'CHR-01:fr', state: 'idle', time: 12, duration: 240 });
    controller.seek(32);
    expect(controller.getSnapshot()).toMatchObject({ state: 'idle', time: 32 });
    expect(play).not.toHaveBeenCalled();
  });

  it('stops the current audio when selecting another fiche and waits for a new explicit play', async () => {
    const { controller, element, play, pause, metadata } = player();
    controller.select('CHR-01:fr', '/media/test/fr.mp3');
    metadata();
    await controller.play();
    expect(controller.getSnapshot().state).toBe('playing');
    const pausedBefore = pause.mock.calls.length;
    controller.select('VIE-01:fr', '/media/test/vie.mp3');
    expect(pause).toHaveBeenCalledTimes(pausedBefore + 1);
    expect(element.src).toContain('/media/test/vie.mp3');
    expect(controller.getSnapshot()).toMatchObject({ key: 'VIE-01:fr', state: 'idle' });
    expect(play).toHaveBeenCalledTimes(1);
    await controller.play();
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('keeps per-fiche and per-language positions separate and restores without autoplay', async () => {
    const { controller, play, metadata, tick } = player();
    const saved: Record<string, number> = {};
    controller.onPosition = (key, time) => { saved[key] = time; };
    controller.select('CHR-01:fr', '/media/test/fr.mp3');
    metadata();
    await controller.play();
    tick(58);
    controller.select('CHR-01:ar', '/media/test/ar.mp3', 7);
    metadata(280);
    expect(controller.getSnapshot()).toMatchObject({ key: 'CHR-01:ar', state: 'idle', time: 7 });
    controller.seek(19);
    controller.select('VIE-01:fr', '/media/test/vie.mp3');
    metadata();
    controller.seek(5);
    controller.select('CHR-01:fr', '/media/test/fr.mp3', saved['CHR-01:fr']);
    metadata();
    expect(controller.getSnapshot()).toMatchObject({ time: 58, state: 'idle' });
    expect(saved).toMatchObject({ 'CHR-01:fr': 58, 'CHR-01:ar': 19, 'VIE-01:fr': 5 });
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('pauses and seeks within duration boundaries without restarting playback', async () => {
    const { controller, play, metadata, tick } = player();
    controller.select('CHR-01:fr', '/media/test/fr.mp3');
    metadata(200);
    await controller.play();
    tick(17);
    controller.pause();
    expect(controller.getSnapshot()).toMatchObject({ state: 'paused', time: 17 });
    controller.seek(999);
    expect(controller.getSnapshot()).toMatchObject({ state: 'paused', time: 200 });
    controller.seek(-9);
    expect(controller.getSnapshot().time).toBe(0);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('preserves the current stream when the same fiche is selected again', async () => {
    const { controller, play, pause, metadata, tick } = player();
    controller.select('CHR-01:fr', '/media/test/fr.mp3');
    metadata();
    await controller.play();
    tick(41);
    const pauseCount = pause.mock.calls.length;
    controller.select('CHR-01:fr', '/media/test/fr.mp3', 0);
    expect(controller.getSnapshot()).toMatchObject({ state: 'playing', time: 41 });
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(pauseCount);
  });

  it('shows an error on rejected playback and allows an explicit retry', async () => {
    const { controller, play, metadata } = player();
    controller.select('CHR-01:fr', '/media/test/fr.mp3');
    metadata();
    play.mockRejectedValueOnce(new DOMException('User activation needed', 'NotAllowedError'));
    await expect(controller.play()).resolves.toBeUndefined();
    expect(controller.getSnapshot().state).toBe('error');
    await controller.play();
    expect(controller.getSnapshot().state).toBe('playing');
  });

  it('does not apply a delayed play result after the user pauses or switches fiche', async () => {
    const { controller, play } = player();
    let resolvePlay!: () => void;
    play.mockImplementationOnce(() => new Promise<void>(resolve => { resolvePlay = resolve; }));
    controller.select('CHR-01:fr', '/media/test/fr.mp3');
    const pendingPlay = controller.play();
    expect(controller.getSnapshot().state).toBe('loading');
    controller.select('CHR-02:fr', '/media/test/next.mp3');
    resolvePlay();
    await pendingPlay;
    expect(controller.getSnapshot()).toMatchObject({ key: 'CHR-02:fr', state: 'idle' });
  });

  it('signals decoding errors, resets ended positions, and releases the source on clear', () => {
    const { controller, element, metadata, tick } = player();
    const onPosition = vi.fn();
    controller.onPosition = onPosition;
    controller.select('CHR-01:fr', '/media/test/fr.mp3');
    metadata();
    element.dispatchEvent(new Event('error'));
    expect(controller.getSnapshot().state).toBe('error');
    tick(240);
    element.dispatchEvent(new Event('ended'));
    expect(controller.getSnapshot()).toMatchObject({ state: 'paused', time: 0 });
    expect(onPosition).toHaveBeenLastCalledWith('CHR-01:fr', 0);
    controller.clear();
    expect(onPosition).toHaveBeenLastCalledWith('CHR-01:fr', 0);
    expect(element.hasAttribute('src')).toBe(false);
    expect(controller.getSnapshot()).toEqual({ key: '', state: 'idle', time: 0, duration: 0 });
  });
});
