import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Headphones, Play, Pause, RotateCcw } from "lucide-react";
import { narration } from "../audio";
import { useApp } from "../context";
import type { ContentEntry } from "../schema";
const format = (n: number) =>
  `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;

const draftAudios: Record<string, Record<string, string>> = {
  "CHR-01": {
    fr: "/media/drafts/narration-chr-01-fr.mp3",
    ar: "/media/drafts/narration-chr-01-ar.mp3",
  },
  "CHR-02": {
    fr: "/media/drafts/narration-chr-02-fr.mp3",
    ar: "/media/drafts/narration-chr-02-ar.mp3",
  },
  "CHR-03": {
    fr: "/media/drafts/narration-chr-03-fr.mp3",
    ar: "/media/drafts/narration-chr-03-ar.mp3",
  },
  "CHR-04": {
    fr: "/media/drafts/narration-chr-04-fr.mp3",
    ar: "/media/drafts/narration-chr-04-ar.mp3",
  },
  "HEG-ETP-01": {
    fr: "/media/drafts/narration-heg-etp-01-fr.mp3",
    ar: "/media/drafts/narration-heg-etp-01-ar.mp3",
  },
  "HEG-ETP-02": {
    fr: "/media/drafts/narration-heg-etp-02-fr.mp3",
    ar: "/media/drafts/narration-heg-etp-02-ar.mp3",
  },
  "HEG-ETP-03": {
    fr: "/media/drafts/narration-heg-etp-03-fr.mp3",
    ar: "/media/drafts/narration-heg-etp-03-ar.mp3",
  },
  "HEG-ETP-04": {
    fr: "/media/drafts/narration-heg-etp-04-fr.mp3",
    ar: "/media/drafts/narration-heg-etp-04-ar.mp3",
  },
  "HEG-ETP-05": {
    fr: "/media/drafts/narration-heg-etp-05-fr.mp3",
    ar: "/media/drafts/narration-heg-etp-05-ar.mp3",
  },
  "HEG-ETP-06": {
    fr: "/media/drafts/narration-heg-etp-06-fr.mp3",
    ar: "/media/drafts/narration-heg-etp-06-ar.mp3",
  },
  "VIE-01": {
    fr: "/media/drafts/narration-vie-01-fr.mp3",
    ar: "/media/drafts/narration-vie-01-ar.mp3",
  },
  "VIE-02": {
    fr: "/media/drafts/narration-vie-02-fr.mp3",
    ar: "/media/drafts/narration-vie-02-ar.mp3",
  },
  "VIE-03": {
    fr: "/media/drafts/narration-vie-03-fr.mp3",
    ar: "/media/drafts/narration-vie-03-ar.mp3",
  },
  "CHR-05": {
    fr: "/media/drafts/narration-chr-05-fr.mp3",
    ar: "/media/drafts/narration-chr-05-ar.mp3",
  },
  "CHR-06": {
    fr: "/media/drafts/narration-chr-06-fr.mp3",
    ar: "/media/drafts/narration-chr-06-ar.mp3",
  },
  "VIE-04": {
    fr: "/media/drafts/narration-vie-04-fr.mp3",
    ar: "/media/drafts/narration-vie-04-ar.mp3",
  },
  "VIE-05": {
    fr: "/media/drafts/narration-vie-05-fr.mp3",
    ar: "/media/drafts/narration-vie-05-ar.mp3",
  },
};

export function AudioPlayer({ entry }: { entry: ContentEntry }) {
  const { registry, prefs, updatePrefs, t } = useApp();
  const controller = narration();
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
  );
  const [test, setTest] = useState(false);
  const [pilot, setPilot] = useState(false);
  const asset = registry.assets.find(
    (a) => a.assetId === entry.audioRefs[prefs.locale],
  );
  const draftUrl = draftAudios[entry.id]?.[prefs.locale];
  const isDraft = !asset?.url && pilot && !!draftUrl;
  const url =
    asset?.url ||
    (isDraft ? draftUrl : null) ||
    (test ? `/media/demo/signal-${prefs.locale}.wav` : null);
  const key = `${entry.id}:${prefs.locale}${test ? ":test" : isDraft ? ":pilot" : ""}`;
  const positions = useRef(prefs.audioPositionsByContentLocale);
  positions.current = prefs.audioPositionsByContentLocale;
  useEffect(() => {
    controller.onPosition = (id, time) =>
      updatePrefs((previous) => ({
        audioPositionsByContentLocale: {
          ...previous.audioPositionsByContentLocale,
          [id]: time,
        },
      }));
    return () => {
      controller.onPosition = () => {};
    };
  }, [controller, updatePrefs]);
  useEffect(() => {
    if (url) controller.select(key, url, positions.current[key] ?? 0);
    return () => controller.pause();
  }, [controller, key, url]);
  const own = state.key === key;
  const playing = own && state.state === "playing";
  return (
    <section className="audio-player" aria-label={t("audio")}>
      <div className="audio-heading">
        <Headphones size={22} />
        <strong>{t("audio")}</strong>
        <span className="locale-badge">{prefs.locale.toUpperCase()}</span>
      </div>
      {!asset?.url && <p>{t("audioMissing")}</p>}
      {!url ? (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {draftUrl && (
            <button
              className="button primary"
              onClick={() => {
                setPilot(true);
                setTest(false);
              }}
            >
              <Play size={18} />
              {prefs.locale === "fr"
                ? "Écouter la narration pilote (3 min)"
                : "الاستماع إلى التسجيل التجريبي (3 د)"}
            </button>
          )}
          <button
            className="button secondary"
            onClick={() => {
              setTest(true);
              setPilot(false);
            }}
          >
            <Play size={18} />
            {t("audioTest")}
          </button>
        </div>
      ) : (
        <>
          <div className="audio-controls">
            <button
              className="button round"
              aria-label={playing ? t("pause") : t("listen")}
              onClick={() =>
                playing ? controller.pause() : void controller.play()
              }
            >
              {playing ? <Pause /> : <Play />}
            </button>
            <input
              type="range"
              min="0"
              max={own ? state.duration || 8 : 8}
              step="0.1"
              value={own ? state.time : 0}
              aria-label={t("seek")}
              onChange={(e) => controller.seek(Number(e.target.value))}
            />
            <span className="audio-time" dir="ltr">
              {format(own ? state.time : 0)} /{" "}
              {format(own ? state.duration : 0)}
            </span>
          </div>
          {own && state.state === "loading" && (
            <p role="status">{t("loading")}</p>
          )}
          {own && state.state === "error" && (
            <div role="alert">
              <p>{t("audioError")}</p>
              <button
                onClick={() => void controller.play()}
                className="button secondary"
              >
                <RotateCcw size={16} />
                {t("retry")}
              </button>
            </div>
          )}
        </>
      )}
      {asset?.url && (
        <p className="small-note">
          {prefs.locale === "fr"
            ? "Voix de synthèse : écoutez et signalez toute prononciation à corriger."
            : "صوت مُولَّد بالذكاء الاصطناعي: يرجى الإبلاغ عن أي نطق يحتاج إلى تصحيح."}
        </p>
      )}
      {isDraft && (
        <p className="small-note" style={{ color: "var(--color-warning-text, #b45309)" }}>
          {prefs.locale === "fr"
            ? "Pilote IA (brouillon non validé) : voix de synthèse documentaire — en attente d'approbation humaine."
            : "تسجيل تجريبي (مسودة غير معتمدة): صوت تركيبي وثائقي — في انتظار الاعتماد البشري."}
        </p>
      )}
      {test && <p className="small-note">{t("audioTestNote")}</p>}
    </section>
  );
}
