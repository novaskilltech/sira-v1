import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { CircleHelp, Globe2, Menu, X } from "lucide-react";
import { useApp } from "./context";
import { narration } from "./audio";
import { AtlasMark } from "./components/Artwork";
import { PageHeading } from "./components/Shared";
import { ContentBoundary } from "./components/ContentBoundary";
import Home from "./pages/Home";
const Chronology = lazy(() => import("./pages/Chronology"));
const Hegira = lazy(() => import("./pages/Hegira"));
const Life = lazy(() => import("./pages/Life"));
const Article = lazy(() => import("./pages/Article"));
const Information = lazy(() => import("./pages/Information"));
export default function App() {
  const { t, prefs, updatePrefs, reducedMotion } = useApp();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const scrollPositions = useRef(new Map<string, number>());
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  useEffect(() => {
    narration().pause();
    setMenu(false);
    const saved = scrollPositions.current.get(location.pathname) ?? 0;
    const remember = () =>
      scrollPositions.current.set(location.pathname, window.scrollY);
    const timer = setTimeout(() => {
      window.scrollTo({ top: saved, behavior: "instant" });
      document.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
      window.addEventListener("scroll", remember, { passive: true });
    }, 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", remember);
    };
  }, [location.pathname]);
  useEffect(() => {
    narration().pause();
  }, [prefs.locale]);
  useEffect(() => {
    const pause = () => {
      if (document.visibilityState === "hidden") narration().pause();
    };
    const blur = () => narration().pause();
    document.addEventListener("visibilitychange", pause);
    window.addEventListener("pagehide", blur);
    window.addEventListener("blur", blur);
    return () => {
      document.removeEventListener("visibilitychange", pause);
      window.removeEventListener("pagehide", blur);
      window.removeEventListener("blur", blur);
    };
  }, []);
  return (
    <div className={reducedMotion ? "app reduce-motion" : "app"}>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <header className="global-header">
        <Link className="brand" to="/" aria-label={`Sîra — ${t("home")}`}>
          <AtlasMark />
          <span>
            <strong>
              Sîra
              <span className="brand-ar" lang="ar">
                سيرة
              </span>
            </strong>
            <small>{t("tagline")}</small>
          </span>
        </Link>
        <nav
          className={menu ? "main-nav open" : "main-nav"}
          aria-label={t("welcome")}
        >
          <NavLink to="/" end>
            {t("home")}
          </NavLink>
          <NavLink to="/chronologie">{t("chronology")}</NavLink>
          <NavLink to="/hegire">{t("hegira")}</NavLink>
          <NavLink to="/vie">{t("life")}</NavLink>
        </nav>
        <div className="header-tools">
          <div className="language-switch" aria-label="Langue / اللغة">
            <Globe2 size={17} />
            <button
              lang="fr"
              aria-pressed={prefs.locale === "fr"}
              onClick={() => updatePrefs({ locale: "fr" })}
            >
              FR
            </button>
            <span aria-hidden="true">/</span>
            <button
              lang="ar"
              aria-pressed={prefs.locale === "ar"}
              onClick={() => updatePrefs({ locale: "ar" })}
            >
              عربي
            </button>
          </div>
          <Link
            className="icon-button help-link"
            to="/aide"
            aria-label={t("help")}
          >
            <CircleHelp size={21} />
          </Link>
          <button
            className="icon-button menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? t("back") : t("welcome")}
            aria-expanded={menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {!online && (
        <div role="status" className="network-banner">
          {t("offline")}{" "}
          <button
            onClick={() => {
              setOnline(navigator.onLine);
            }}
          >
            {t("retry")}
          </button>
        </div>
      )}
      <main id="main">
        <ContentBoundary key={location.pathname} locale={prefs.locale}>
          <Suspense
            fallback={
              <div className="loading-state" role="status">
                {t("loading")}
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chronologie" element={<Chronology />} />
              <Route path="/hegire" element={<Hegira />} />
              <Route path="/vie" element={<Life />} />
              {["chronologie", "hegire", "vie"].map((space) => (
                <Route
                  key={space}
                  path={`/${space}/:id`}
                  element={<Article key={location.pathname} />}
                />
              ))}
              <Route path="/aide" element={<Information />} />
              <Route path="/mentions" element={<Information legal />} />
              <Route
                path="*"
                element={
                  <div className="page-wrap">
                    <PageHeading
                      title={t("notFound")}
                      description={t("notFoundText")}
                    />
                    <Link className="button primary" to="/">
                      {t("home")}
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </ContentBoundary>
      </main>
      <footer className="global-footer">
        <Link className="footer-brand" to="/">
          Sîra <span lang="ar">سيرة</span>
        </Link>
        <p>{t("noTracking")}</p>
        <nav>
          <Link to="/aide">{t("help")}</Link>
          <Link to="/mentions">{t("legal")}</Link>
        </nav>
      </footer>
    </div>
  );
}
