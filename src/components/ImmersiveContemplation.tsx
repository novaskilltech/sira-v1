import { useEffect, useSyncExternalStore } from "react";
import { Play, Pause, X, Headphones } from "lucide-react";
import { narration } from "../audio";
import { useApp } from "../context";

interface ImmersiveContemplationProps {
  imageSrc: string;
  alt: string;
  title: string;
  eyebrow?: string;
  locale: "fr" | "ar";
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export function ImmersiveContemplation({
  imageSrc,
  alt,
  title,
  eyebrow,
  locale,
  onClose,
}: ImmersiveContemplationProps) {
  const { reducedMotion, t } = useApp();
  const controller = narration();
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
  );

  const playing = state.state === "playing";

  // Handle ESC key to dismiss contemplation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="immersive-contemplation-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={
        locale === "fr"
          ? "Mode contemplation plein écran"
          : "وضع التأمل في ملء الشاشة"
      }
      onClick={onClose}
    >
      {/* Ambient background blur */}
      <div
        className="contemplation-backdrop-blur"
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-hidden="true"
      />

      {/* Main visual viewport */}
      <div className="contemplation-canvas">
        <img
          src={imageSrc}
          alt={alt}
          className={`contemplation-image ${reducedMotion ? "no-motion" : "ken-burns"}`}
        />
      </div>

      {/* Top bar with title and close prompt */}
      <header
        className="contemplation-top-bar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contemplation-meta">
          {eyebrow && <span className="contemplation-eyebrow">{eyebrow}</span>}
          <h2 className="contemplation-title">{title}</h2>
          <span className="contemplation-era">
            {locale === "fr"
              ? "Arabie · Il y a quatorze siècles"
              : "جزيرة العرب · قبل أربعة عشر قرناً"}
          </span>
        </div>

        <div className="contemplation-actions">
          <span className="contemplation-touch-hint" aria-hidden="true">
            {locale === "fr"
              ? "Toucher l’écran pour revenir à la fiche"
              : "المس الشاشة للعودة إلى الصفحة"}
          </span>
          <button
            type="button"
            className="button round contemplation-close-btn"
            onClick={onClose}
            aria-label={locale === "fr" ? "Fermer le plein écran" : "إغلاق ملء الشاشة"}
          >
            <X size={22} />
          </button>
        </div>
      </header>

      {/* Floating Bottom Mini-Player for uninterrupted listening */}
      <div
        className="contemplation-player-bar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contemplation-player-inner">
          <div className="contemplation-status-badge">
            <Headphones size={18} className="contemplation-headphone-icon" />
            <span className="contemplation-now-playing">
              {locale === "fr"
                ? playing
                  ? "Narration en cours d'écoute…"
                  : "Narration en pause"
                : playing
                  ? "جارٍ الاستماع إلى الرواية الصوتية…"
                  : "الرواية الصوتية متوقفة مؤقتاً"}
            </span>
          </div>

          <div className="contemplation-audio-controls">
            <button
              type="button"
              className="button round primary contemplation-play-toggle"
              aria-label={
                locale === "fr"
                  ? playing
                    ? "Mettre en pause l'immersion"
                    : "Reprendre l'écoute immersive"
                  : playing
                    ? "إيقاف مؤقت"
                    : "تشغيل"
              }
              onClick={() =>
                playing ? controller.pause() : void controller.play()
              }
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="contemplation-scrubber-group">
              <input
                type="range"
                min="0"
                max={state.duration || 180}
                step="0.1"
                value={state.time || 0}
                aria-label={t("seek")}
                onChange={(e) => controller.seek(Number(e.target.value))}
                className="contemplation-slider"
              />
              <div className="contemplation-time-display" dir="ltr">
                <span>{formatTime(state.time || 0)}</span>
                <span className="contemplation-time-separator">/</span>
                <span>{formatTime(state.duration || 180)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
