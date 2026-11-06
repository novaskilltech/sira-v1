import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context";
import { MapArt, ObjectArt } from "../components/Artwork";
import { entryRoute } from "../components/Shared";
import { MediaImage } from "../components/MediaImage";
export default function Home() {
  const { t, prefs, registry } = useApp();
  const last = registry.contents.find((c) => c.id === prefs.lastContentId);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" />
            {t("tagline")}
          </div>
          <h1 tabIndex={-1}>
            {t("headline")
              .split("\n")
              .map((line, i) => (
                <span key={i}>{line}</span>
              ))}
          </h1>
          <p>{t("intro")}</p>
          <a className="button primary" href="#explorer">
            {t("explore")}
            <ArrowRight size={19} />
          </a>
          <div className="hero-note">
            <Compass size={18} />
            <span>{t("noTracking")}</span>
          </div>
        </div>
        <figure className="hero-image">
          <MediaImage
            src="/media/demo/atlas-valley.webp"
            alt=""
            fetchPriority="high"
          />
          <span className="image-index" aria-hidden="true">
            SÎRA / 01
          </span>
          <figcaption>{t("imageCaption")}</figcaption>
        </figure>
      </section>
      <section className="explore-section" id="explorer">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t("discovery")}</span>
            <h2>{t("choose")}</h2>
            <p>{t("chooseIntro")}</p>
          </div>
          <span className="section-number" aria-hidden="true">
            01 — 03
          </span>
        </div>
        <div className="feature-grid">
          {(["chronology", "hegira", "life"] as const).map((key, i) => (
            <Link
              to={["/chronologie", "/hegire", "/vie"][i]}
              className={`feature-card feature-${key}`}
              key={key}
            >
              <div className="feature-art">
                {i === 0 ? (
                  <>
                    <img src="/media/demo/atlas-valley.webp" alt="" />
                    <div className="timeline-lines" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </>
                ) : i === 1 ? (
                  <MapArt />
                ) : (
                  <ObjectArt />
                )}
                <span className="feature-number">0{i + 1}</span>
              </div>
              <div className="feature-body">
                <span className="eyebrow">{t(`${key}Meta`)}</span>
                <h3>
                  {t(key)}
                  <ArrowUpRight size={24} />
                </h3>
                <p>{t(`${key}Desc`)}</p>
                <span className="feature-link">
                  {t("discover")}
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {last && (
        <Link className="resume-panel" to={entryRoute(last)}>
          <BookOpen size={28} />
          <div>
            <span className="eyebrow">{t("resume")}</span>
            <h3>{last.localized[prefs.locale].title}</h3>
            <p>{t("resumeDetail")}</p>
          </div>
          <ArrowRight />
        </Link>
      )}
      <section className="editorial-strip">
        <div className="editorial-title">
          <Compass size={32} />
          <h2>{t("invitation")}</h2>
        </div>
        <p>{t("invitationText")}</p>
        <div className="editorial-options">
          <span>
            <BookOpen size={19} />
            {t("read")}
          </span>
          <span>
            <Headphones size={19} />
            {t("listen")}
          </span>
        </div>
      </section>
      <aside className="trust-note">
        <ShieldCheck size={26} />
        <div>
          <strong>{t("sourcePromise")}</strong>
          <p>{t("sourceText")}</p>
        </div>
        <Link to="/aide" className="text-link">
          {t("discover")}
          <ArrowUpRight size={16} />
        </Link>
      </aside>
    </>
  );
}
