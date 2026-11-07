import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Film,
  Layers,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context";
import type { ContentEntry } from "../schema";

export default function Documentary() {
  const { registry, prefs, updatePrefs, t } = useApp();
  const locale = prefs.locale;
  const isAr = locale === "ar";

  // Filter and sort the 60 entries chronologically
  const allEntries = registry.contents;

  // Periods definition
  const periods = [
    {
      id: "all",
      nameFr: "Toute la Sîra (60 épisodes)",
      nameAr: "السيرة كاملة (٦٠ حلقة)",
      filter: () => true,
    },
    {
      id: "p1",
      nameFr: "1. Contexte mecquois (CHR 01–04)",
      nameAr: "١. السياق المكي",
      filter: (c: ContentEntry) =>
        ["CHR-01", "CHR-02", "CHR-03", "CHR-04"].includes(c.id),
    },
    {
      id: "p2",
      nameFr: "2. Débuts de la Révélation (CHR 05–08)",
      nameAr: "٢. بدء الوحي والرسالة",
      filter: (c: ContentEntry) =>
        ["CHR-05", "CHR-06", "CHR-07", "CHR-08"].includes(c.id),
    },
    {
      id: "p3",
      nameFr: "3. Avant l'Hégire (CHR 09–12)",
      nameAr: "٣. ما قبل الهجرة",
      filter: (c: ContentEntry) =>
        ["CHR-09", "CHR-10", "CHR-11", "CHR-12"].includes(c.id),
    },
    {
      id: "p4",
      nameFr: "4. Installation à Médine (CHR 13–16)",
      nameAr: "٤. الاستقرار بالمدينة المنورة",
      filter: (c: ContentEntry) =>
        ["CHR-13", "CHR-14", "CHR-15", "CHR-16"].includes(c.id),
    },
    {
      id: "p5",
      nameFr: "5. Épreuves médinoises (CHR 17–20)",
      nameAr: "٥. الوقائع والعهود",
      filter: (c: ContentEntry) =>
        ["CHR-17", "CHR-18", "CHR-19", "CHR-20"].includes(c.id),
    },
    {
      id: "p6",
      nameFr: "6. Dernières années (CHR 21–24)",
      nameAr: "٦. فتح مكة والوفاة",
      filter: (c: ContentEntry) =>
        ["CHR-21", "CHR-22", "CHR-23", "CHR-24"].includes(c.id),
    },
    {
      id: "heg",
      nameFr: "Corridor de l'Hégire (12 étapes)",
      nameAr: "مسار الهجرة النبوية (١٢ محطة)",
      filter: (c: ContentEntry) => c.space === "hegire",
    },
    {
      id: "vie",
      nameFr: "Culture matérielle & Vie quotidienne (24 thèmes)",
      nameAr: "الثقافة المادية والحياة اليومية (٢٤ موضوعاً)",
      filter: (c: ContentEntry) => c.space === "vie_quotidienne",
    },
  ];

  const [activePeriodId, setActivePeriodId] = useState<string>("all");
  const selectedPeriod = periods.find((p) => p.id === activePeriodId) ?? periods[0];
  const playlist = allEntries.filter(selectedPeriod.filter);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentEntry = playlist[currentIndex] ?? playlist[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(240);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hudVisible, setHudVisible] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [subImageIndex, setSubImageIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Audio source URL
  const audioSrc = `/media/drafts/narration-${currentEntry?.id.toLowerCase()}-${locale}.mp3`;

  // Image rotation calculation (3 images per audio track)
  const primaryImg = `/media/drafts/illustration-${currentEntry?.id.toLowerCase()}-v1.webp`;
  const sub1Img = `/media/drafts/illustration-${currentEntry?.id.toLowerCase()}-sub-1.webp`;
  const sub2Img = `/media/drafts/illustration-${currentEntry?.id.toLowerCase()}-sub-2.webp`;

  const [activeImageSrc, setActiveImageSrc] = useState<string>(primaryImg);
  const [kenBurnsStyle, setKenBurnsStyle] = useState<string>("kb-zoom-in");

  // Track sub-image rotations during audio progression
  useEffect(() => {
    if (!duration || duration <= 0) return;
    const progress = currentTime / duration;
    let nextIdx = 0;
    if (progress >= 0.66) nextIdx = 2;
    else if (progress >= 0.33) nextIdx = 1;

    if (nextIdx !== subImageIndex) {
      setSubImageIndex(nextIdx);
      if (nextIdx === 0) {
        setActiveImageSrc(primaryImg);
        setKenBurnsStyle("kb-zoom-in");
      } else if (nextIdx === 1) {
        setActiveImageSrc(sub1Img);
        setKenBurnsStyle("kb-pan-right");
      } else {
        setActiveImageSrc(sub2Img);
        setKenBurnsStyle("kb-zoom-out");
      }
    }
  }, [currentTime, duration, subImageIndex, primaryImg, sub1Img, sub2Img]);

  // When current entry changes, reset time & image
  useEffect(() => {
    setCurrentTime(0);
    setSubImageIndex(0);
    setActiveImageSrc(primaryImg);
    setKenBurnsStyle("kb-zoom-in");
  }, [currentEntry?.id, primaryImg]);

  // WakeLock management for continuous viewing
  useEffect(() => {
    async function requestWakeLock() {
      if ("wakeLock" in navigator && isPlaying) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch {
          // WakeLock not allowed or inactive
        }
      } else if (wakeLockRef.current && !isPlaying) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    }
    requestWakeLock();
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, [isPlaying]);

  // HUD Auto-hide timeout
  const resetHudTimer = useCallback(() => {
    setHudVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = window.setTimeout(() => {
        setHudVisible(false);
      }, 3500);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetHudTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying, resetHudTimer]);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Audio transport commands
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const skipSeconds = (sec: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(duration, audioRef.current.currentTime + sec),
    );
  };

  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop to start
    }
  };

  const playPrev = () => {
    if (currentTime > 4) {
      // Re-start current track if listened more than 4s
      skipSeconds(-currentTime);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["Space", " "].includes(e.key)) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        skipSeconds(10);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        skipSeconds(-10);
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === "m") {
        setMuted((m) => !m);
      } else if (e.key.toLowerCase() === "n") {
        playNext();
      } else if (e.key.toLowerCase() === "p") {
        playPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const title = currentEntry?.localized[locale].title ?? "";
  const group = currentEntry?.group[locale] ?? "";
  const globalProgressPercent = Math.round(
    ((currentIndex + currentTime / (duration || 1)) / playlist.length) * 100,
  );

  return (
    <div
      ref={containerRef}
      className={`documentary-player ${hudVisible ? "hud-open" : "hud-hidden"} ${
        isFullscreen ? "is-fullscreen" : ""
      }`}
      onMouseMove={resetHudTimer}
      onClick={resetHudTimer}
    >
      {/* Background Audio Engine */}
      <audio
        ref={audioRef}
        src={audioSrc}
        autoPlay={isPlaying}
        muted={muted}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 240);
            if (isPlaying) audioRef.current.play().catch(() => {});
          }
        }}
        onEnded={playNext}
      />

      {/* Cinematic Visual Stage (Ken Burns Canvas) */}
      <div className="documentary-stage" aria-hidden="true">
        <div
          key={`${currentEntry?.id}-${subImageIndex}`}
          className={`documentary-canvas ${kenBurnsStyle}`}
          style={{ backgroundImage: `url(${activeImageSrc})` }}
        >
          {/* Fallback image component for network safety */}
          <img
            src={activeImageSrc}
            alt=""
            className="hidden-preload"
            onError={() => {
              // Gracefully fall back to primary illustration if a sub-image is missing
              if (activeImageSrc !== primaryImg) {
                setActiveImageSrc(primaryImg);
              }
            }}
          />
        </div>
        <div className="documentary-vignette" />
        <div className="documentary-atmosphere" />
      </div>

      {/* Top HUD Bar */}
      <header className="documentary-topbar" onClick={(e) => e.stopPropagation()}>
        <div className="topbar-left">
          <Link
            to="/"
            className="doc-icon-btn back-btn"
            aria-label={locale === "fr" ? "Retour à l'accueil" : "العودة للرئيسية"}
          >
            <ArrowLeft size={20} />
            <span className="doc-btn-label">{locale === "fr" ? "Atlas Sîra" : "أطلس سيرة"}</span>
          </Link>

          <div className="doc-meta-badge">
            <span className="badge-episode">
              {t("filmEpisode")} {currentIndex + 1} / {playlist.length}
            </span>
            <span className="badge-group">{group}</span>
          </div>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="doc-pill-btn period-pill"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <Layers size={16} />
            <span>{isAr ? selectedPeriod.nameAr : selectedPeriod.nameFr}</span>
          </button>

          <button
            type="button"
            className="doc-icon-btn"
            onClick={() => updatePrefs({ locale: isAr ? "fr" : "ar" })}
            aria-label="Basculer la langue"
          >
            <span className="lang-text">{isAr ? "FR" : "عربي"}</span>
          </button>

          <button
            type="button"
            className="doc-icon-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t("filmExitFullscreen") : t("filmFullscreen")}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </header>

      {/* Center Contemplation Notice (Discreet watermark) */}
      {!isPlaying && (
        <div className="documentary-center-play" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="massive-play-button"
            onClick={togglePlay}
            aria-label={t("filmPlayAll")}
          >
            <Play size={44} className="play-icon" />
          </button>
          <div className="center-caption">
            <h2>{title}</h2>
            <p>{isAr ? selectedPeriod.nameAr : selectedPeriod.nameFr}</p>
            <span className="play-hint">
              {locale === "fr"
                ? "Cliquez pour démarrer l'écoute continue"
                : "انقر لبدء السرد الوثائقي المتواصل"}
            </span>
          </div>
        </div>
      )}

      {/* Bottom HUD Bar (Controls, scrubber, titles) */}
      <footer className="documentary-bottombar" onClick={(e) => e.stopPropagation()}>
        <div className="bottombar-info">
          <div className="episode-title-wrap">
            <span className="sub-badge">
              <Sparkles size={14} />
              {locale === "fr" ? "Évocation picturale & récit intégral" : "مشهد تاريخي وسرد متصل"}
            </span>
            <h1 className="doc-title">{title}</h1>
          </div>

          <div className="global-progress-indicator">
            <span>
              {t("filmTotalProgress")} : {globalProgressPercent}%
            </span>
            <div className="global-progress-bar">
              <div
                className="global-progress-fill"
                style={{ width: `${globalProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audio scrub bar with sub-image transition ticks */}
        <div className="scrubber-container">
          <span className="time-display current">{formatTime(currentTime)}</span>
          <div
            className="scrubber-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              skipSeconds(pos * duration - currentTime);
            }}
          >
            <div
              className="scrubber-progress"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            {/* 3 segment marker ticks indicating image crossfades */}
            <div className="scrubber-tick tick-33" title="Changement de vue (1/3)" />
            <div className="scrubber-tick tick-66" title="Changement de vue (2/3)" />
          </div>
          <span className="time-display total">{formatTime(duration)}</span>
        </div>

        {/* Transport Actions */}
        <div className="transport-controls">
          <div className="transport-left">
            <button
              type="button"
              className="doc-ctrl-btn"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label={t("filmChapters")}
            >
              <Film size={20} />
              <span className="ctrl-label">{t("filmChapters")}</span>
            </button>
          </div>

          <div className="transport-center">
            <button
              type="button"
              className="doc-ctrl-btn"
              onClick={playPrev}
              aria-label={t("filmPrev")}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              className="doc-ctrl-btn"
              onClick={() => skipSeconds(-10)}
              aria-label="Reculer de 10 secondes"
            >
              <RotateCcw size={20} />
              <span className="btn-mini-tag">10s</span>
            </button>

            <button
              type="button"
              className="main-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? t("filmPause") : t("filmResume")}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>

            <button
              type="button"
              className="doc-ctrl-btn"
              onClick={() => skipSeconds(10)}
              aria-label="Avancer de 10 secondes"
            >
              <RotateCw size={20} />
              <span className="btn-mini-tag">10s</span>
            </button>

            <button
              type="button"
              className="doc-ctrl-btn"
              onClick={playNext}
              aria-label={t("filmNext")}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="transport-right">
            <div className="volume-control">
              <button
                type="button"
                className="doc-ctrl-btn"
                onClick={() => setMuted(!muted)}
                aria-label={muted ? "Activer le son" : "Couper le son"}
              >
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setMuted(val === 0);
                  if (audioRef.current) audioRef.current.volume = val;
                }}
                className="volume-slider"
                aria-label="Contrôle du volume sonore"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Chapters & Periods Drawer */}
      <aside
        className={`documentary-drawer ${drawerOpen ? "is-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title-row">
            <h2>{t("filmChapters")}</h2>
            <button
              type="button"
              className="doc-icon-btn close-drawer"
              onClick={() => setDrawerOpen(false)}
              aria-label="Fermer le sommaire"
            >
              <X size={20} />
            </button>
          </div>

          {/* Period selector pills */}
          <div className="period-pills-row">
            {periods.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`period-tag-pill ${p.id === activePeriodId ? "active" : ""}`}
                onClick={() => {
                  setActivePeriodId(p.id);
                  setCurrentIndex(0);
                }}
              >
                {isAr ? p.nameAr : p.nameFr}
              </button>
            ))}
          </div>
        </div>

        {/* Playlist Episode List */}
        <div className="drawer-playlist">
          {playlist.map((item, idx) => {
            const isSelected = idx === currentIndex;
            const thumbSrc = `/media/drafts/illustration-${item.id.toLowerCase()}-v1.webp`;
            return (
              <button
                key={item.id}
                type="button"
                className={`drawer-playlist-item ${isSelected ? "is-active" : ""}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  if (!isPlaying && audioRef.current) {
                    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                  }
                }}
              >
                <div
                  className="item-thumb"
                  style={{ backgroundImage: `url(${thumbSrc})` }}
                >
                  {isSelected && isPlaying && (
                    <div className="playing-pulse">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </div>
                <div className="item-text">
                  <span className="item-index">
                    {t("filmEpisode")} {idx + 1} · {item.id}
                  </span>
                  <span className="item-title">{item.localized[locale].title}</span>
                  <span className="item-group">{item.group[locale]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
