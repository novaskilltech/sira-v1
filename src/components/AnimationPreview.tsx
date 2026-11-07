import { Pause, Play } from "lucide-react";
import { useState } from "react";
import type { MediaAsset } from "../schema";
import { MediaImage } from "./MediaImage";

export function AnimationPreview({
  asset,
  locale,
}: {
  asset: MediaAsset;
  locale: "fr" | "ar";
}) {
  const [playing, setPlaying] = useState(false);
  const label =
    locale === "fr" ? "Aperçu d’animation DEMO" : "معاينة حركة تجريبية";
  const action = playing
    ? locale === "fr"
      ? "Mettre en pause"
      : "إيقاف مؤقت"
    : locale === "fr"
      ? "Lire l’aperçu"
      : "تشغيل المعاينة";
  const primaryContentId = asset.contentIds[0];
  const previewSrc = primaryContentId
    ? `/media/drafts/illustration-${primaryContentId.toLowerCase()}-v1.webp`
    : (asset.url ?? "");
  return (
    <section className="animation-preview" aria-label={label}>
      <MediaImage src={previewSrc} alt={asset.alt[locale]} />
      <div className="animation-controls">
        <p>{asset.caption[locale]}</p>
        <button
          className="button secondary"
          type="button"
          aria-pressed={playing}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
          {action}
        </button>
      </div>
      <svg
        className={`animation-motion ${playing ? "is-playing" : ""}`}
        viewBox="0 0 520 56"
        aria-hidden="true"
      >
        <path
          d="M18 29H502"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 7"
          opacity=".45"
        />
        <circle
          className="animation-marker"
          cx="36"
          cy="29"
          r="8"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
