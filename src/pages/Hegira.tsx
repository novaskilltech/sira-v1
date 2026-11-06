import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Compass,
  Maximize,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../context";
import { BackLink, PageHeading, entryRoute } from "../components/Shared";
type View = { zoom: number; x: number; y: number };
const initial: View = { zoom: 1, x: 0, y: 0 };
export default function Hegira() {
  const { registry, prefs, t, reducedMotion, ui, setUi } = useApp();
  const steps = registry.contents.filter(
    (c) => c.space === "hegire" && c.kind === "sequence",
  );
  const dossiers = registry.contents.filter(
    (c) => c.space === "hegire" && c.kind === "dossier",
  );
  const selected = typeof ui.step === "string" ? ui.step : "HEG-ETP-03";
  const current = steps.find((c) => c.id === selected) ?? steps[2];
  const view = (ui.mapView as View | undefined) ?? initial;
  const progress = typeof ui.mapProgress === "number" ? ui.mapProgress : 0;
  const [running, setRunning] = useState(false);
  const points = useRef(new Map<number, { x: number; y: number }>());
  const previousDistance = useRef(0);
  const setView = (patch: Partial<View>) =>
    setUi("mapView", { ...view, ...patch });
  const zoom = (amount: number) =>
    setView({ zoom: Math.max(1, Math.min(2.5, view.zoom + amount)) });
  useEffect(() => {
    if (!running || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (progress >= 100) setRunning(false);
      else setUi("mapProgress", Math.min(100, progress + 2));
    }, 120);
    return () => window.clearTimeout(timer);
  }, [running, progress, reducedMotion, setUi]);
  const labels =
    prefs.locale === "fr"
      ? ["La Mecque", "Thawr", "Qubâ’", "Médine"]
      : ["مكة", "ثور", "قباء", "المدينة"];
  const markers = [
    { id: steps[0].id, x: 392, y: 445, label: labels[0] },
    { id: steps[2].id, x: 333, y: 501, label: labels[1] },
    { id: steps[4].id, x: 349, y: 145, label: labels[2] },
    { id: steps[5].id, x: 395, y: 84, label: labels[3] },
  ];
  return (
    <div className="page-wrap">
      <BackLink />
      <PageHeading
        eyebrow={t("hegiraMeta")}
        title={t("map")}
        description={t("mapIntro")}
      />
      <div className="map-layout">
        <section className="map-panel">
          <div className="map-topline">
            <Compass size={18} />
            <span>{t("mapLabel")}</span>
            <span dir="ltr">01—06</span>
          </div>
          <div
            className="map-viewport"
            dir="ltr"
            onPointerDown={(e) => {
              if ((e.target as Element).closest('button,[role="button"]'))
                return;
              e.currentTarget.setPointerCapture(e.pointerId);
              points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            }}
            onPointerMove={(e) => {
              const old = points.current.get(e.pointerId);
              if (!old) return;
              points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              const list = [...points.current.values()];
              if (list.length === 2) {
                const distance = Math.hypot(
                  list[0].x - list[1].x,
                  list[0].y - list[1].y,
                );
                if (previousDistance.current)
                  zoom((distance - previousDistance.current) / 180);
                previousDistance.current = distance;
              } else {
                setView({
                  x: Math.max(
                    -220,
                    Math.min(220, view.x + (e.clientX - old.x)),
                  ),
                  y: Math.max(
                    -220,
                    Math.min(220, view.y + (e.clientY - old.y)),
                  ),
                });
              }
            }}
            onPointerUp={(e) => {
              points.current.delete(e.pointerId);
              previousDistance.current = 0;
            }}
            onPointerCancel={() => {
              points.current.clear();
              previousDistance.current = 0;
            }}
          >
            <svg
              viewBox="0 0 650 600"
              role="group"
              aria-label={t("mapLabel")}
              data-testid="hegira-map"
            >
              <defs>
                <pattern
                  id="hatching"
                  width="9"
                  height="9"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(35)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="9"
                    stroke="#99583a"
                    strokeWidth="2"
                    opacity=".23"
                  />
                </pattern>
                <radialGradient id="mapground">
                  <stop stopColor="#eee4cf" />
                  <stop offset="1" stopColor="#d3c2a2" />
                </radialGradient>
              </defs>
              <rect width="650" height="600" fill="url(#mapground)" />
              <g
                transform={`translate(${view.x} ${view.y}) translate(325 300) scale(${view.zoom}) translate(-325 -300)`}
                data-testid="map-transform"
              >
                <path
                  d="M0 0H132Q170 100 113 207T82 420L0 600Z"
                  fill="#9eafa7"
                  opacity=".65"
                />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <path
                    key={i}
                    d={`M${170 + i * 46} -60Q${320 + i * 41} 110 ${185 + i * 43} 280T${290 + i * 48} 650`}
                    fill="none"
                    stroke={i % 2 ? "#b09c7c" : "#c3af8b"}
                    strokeWidth={i % 2 ? 24 : 15}
                    opacity=".3"
                  />
                ))}
                {[0, 1, 2, 3, 4].map((i) => (
                  <path
                    key={i}
                    d={`M200 ${40 + i * 125}q90-50 170 20t220-5`}
                    fill="none"
                    stroke="#faf7f0"
                    opacity=".38"
                    strokeWidth="2"
                  />
                ))}
                <path
                  d="M333 501Q220 420 249 332T292 230Q300 174 349 145L395 84"
                  fill="none"
                  stroke="url(#hatching)"
                  strokeWidth="64"
                />
                <path
                  d="M392 445Q359 463 333 501Q220 420 249 332T292 230Q300 174 349 145L395 84"
                  fill="none"
                  stroke="#84541c"
                  strokeWidth="3"
                  strokeDasharray="5 9"
                />
                <path
                  d="M392 445Q359 463 333 501Q220 420 249 332T292 230Q300 174 349 145L395 84"
                  fill="none"
                  stroke="#235a55"
                  strokeWidth="5"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={
                    100 - (reducedMotion && progress > 0 ? 100 : progress)
                  }
                  data-testid="route-progress"
                />
                {markers.map((m) => (
                  <g
                    key={m.id}
                    className="map-marker-visual"
                    aria-hidden="true"
                  >
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="27"
                      fill={selected === m.id ? "#235a55" : "#faf7f0"}
                      stroke="#235a55"
                      strokeWidth="2"
                    />
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="6"
                      fill={selected === m.id ? "#faf7f0" : "#235a55"}
                    />
                    <rect
                      x={m.x + 37}
                      y={m.y - 18}
                      width={prefs.locale === "ar" ? 87 : 102}
                      height="36"
                      rx="3"
                      fill="#faf7f0"
                    />
                    <text
                      x={m.x + 44}
                      y={m.y + 6}
                      fill="#203331"
                      fontSize="18"
                      direction={prefs.locale === "ar" ? "rtl" : "ltr"}
                      textAnchor={prefs.locale === "ar" ? "end" : "start"}
                    >
                      {m.label}
                    </text>
                  </g>
                ))}
              </g>
              <g transform="translate(600 45)" aria-hidden="true">
                <path d="M0 0L-8 23 0 18 8 23Z" fill="#235a55" />
                <text y="-10" textAnchor="middle" fill="#203331" fontSize="13">
                  N
                </text>
              </g>
            </svg>
            {markers.map((m) => (
              <button
                key={m.id}
                className="map-marker"
                data-id={m.id}
                aria-label={`${m.label} — ${t("generalMarker")}`}
                aria-pressed={selected === m.id}
                onClick={() => setUi("step", m.id)}
                style={{
                  left: `${((325 + (m.x - 325) * view.zoom + view.x) / 650) * 100}%`,
                  top: `${((300 + (m.y - 300) * view.zoom + view.y) / 600) * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="map-controls">
            <div className="toolbar">
              <button aria-label={t("zoomIn")} onClick={() => zoom(0.25)}>
                <Plus />
              </button>
              <button aria-label={t("zoomOut")} onClick={() => zoom(-0.25)}>
                <Minus />
              </button>
              <button
                aria-label={t("reset")}
                onClick={() => setUi("mapView", initial)}
              >
                <Maximize />
              </button>
              <span className="zoom-level" dir="ltr">
                {Math.round(view.zoom * 100)}%
              </span>
            </div>
            <div className="toolbar directional" dir="ltr">
              <button
                aria-label={t("panLeft")}
                onClick={() => setView({ x: Math.max(-220, view.x - 30) })}
              >
                <ArrowLeft />
              </button>
              <button
                aria-label={t("panRight")}
                onClick={() => setView({ x: Math.min(220, view.x + 30) })}
              >
                <ArrowRight />
              </button>
              <button
                aria-label={t("panUp")}
                onClick={() => setView({ y: Math.max(-220, view.y - 30) })}
              >
                <ArrowUp />
              </button>
              <button
                aria-label={t("panDown")}
                onClick={() => setView({ y: Math.min(220, view.y + 30) })}
              >
                <ArrowDown />
              </button>
            </div>
          </div>
          <div className="route-controls">
            <button
              className="button primary"
              onClick={() => {
                if (reducedMotion) {
                  setUi("mapProgress", 100);
                  return;
                }
                if (progress >= 100) setUi("mapProgress", 0);
                setRunning(!running);
              }}
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              <span>
                {running
                  ? t("pause")
                  : progress > 0 && progress < 100
                    ? t("continue")
                    : t("playRoute")}
              </span>
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setUi("mapProgress", reducedMotion ? 100 : 0);
                setRunning(!reducedMotion);
              }}
            >
              <RotateCcw size={17} />
              {t("replay")}
            </button>
            <progress
              max="100"
              value={reducedMotion && progress > 0 ? 100 : progress}
              aria-label={t("progress")}
            />
          </div>
          {reducedMotion && <p className="small-note">{t("staticRoute")}</p>}
          <p className="map-disclaimer">
            <span className="dashed-line" />
            {t("mapCaution")}
          </p>
        </section>
        <aside className="map-sidebar">
          <div className="selected-preview" aria-live="polite">
            <span className="eyebrow">
              {t("selected")} /{" "}
              {String(steps.indexOf(current) + 1).padStart(2, "0")}
            </span>
            <h2>{current.localized[prefs.locale].title}</h2>
            <p>{current.geography?.uncertainty[prefs.locale]}</p>
            <Link className="button primary" to={entryRoute(current)}>
              {t("discover")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <h2 className="small-heading">{t("steps")}</h2>
          <ol className="step-list">
            {steps.map((c, i) => (
              <li key={c.id}>
                <button
                  aria-pressed={selected === c.id}
                  className={selected === c.id ? "selected" : ""}
                  onClick={() => setUi("step", c.id)}
                >
                  <span className="step-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    {c.localized[prefs.locale].title}
                    <small>
                      {c.geography?.kind === "not_mappable"
                        ? t("episode")
                        : c.geography?.kind === "illustrative_corridor"
                          ? t("corridor")
                          : t("generalMarker")}
                    </small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <section className="dossiers-section">
        <span className="eyebrow">{t("hegira")}</span>
        <h2>{t("dossiers")}</h2>
        <div className="dossier-grid">
          {dossiers.map((c) => (
            <Link to={entryRoute(c)} key={c.id}>
              <span>{c.localized[prefs.locale].title}</span>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
