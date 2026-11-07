import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, ChevronRight, Info } from "lucide-react";
import { useApp } from "../context";
import { AudioPlayer } from "../components/AudioPlayer";
import {
  BackLink,
  DemoNotice,
  PageHeading,
  entryRoute,
} from "../components/Shared";
import { ObjectViewer } from "../components/ObjectViewer";
import { MediaImage } from "../components/MediaImage";
import { AnimationPreview } from "../components/AnimationPreview";
export default function Article() {
  const { id } = useParams();
  const { registry, prefs, updatePrefs, t } = useApp();
  const entry = registry.contents.find((c) => c.id === id);
  const locale = prefs.locale;
  const resumeSection = useRef(
    prefs.lastContentId === id ? prefs.lastSectionId : undefined,
  );
  useEffect(() => {
    if (!entry) return;
    updatePrefs((previous) => ({
      lastContentId: entry.id,
      lastVisitedRoute: entryRoute(entry),
      lastSectionId:
        previous.lastContentId === entry.id
          ? previous.lastSectionId
          : "introduction",
    }));
    const timer = setTimeout(() => {
      if (resumeSection.current && resumeSection.current !== "introduction")
        document
          .getElementById(resumeSection.current)
          ?.scrollIntoView({ behavior: "instant" });
    }, 180);
    return () => clearTimeout(timer);
  }, [entry, updatePrefs]);
  useEffect(() => {
    if (!entry) return;
    const observer = new IntersectionObserver(
      (items) => {
        const item = items.find((item) => item.isIntersecting);
        if (item) updatePrefs({ lastSectionId: item.target.id });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll(".article-section")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [entry, locale, updatePrefs]);
  if (!entry)
    return (
      <div className="page-wrap">
        <BackLink />
        <PageHeading title={t("notFound")} description={t("notFoundText")} />
      </div>
    );
  const data = entry.localized[locale];
  const parent = `/${entry.space === "vie_quotidienne" ? "vie" : entry.space}`;
  const draftImages: Record<string, string> = {
    "CHR-01": "/media/drafts/illustration-chr-01-v1.webp",
    "HEG-ETP-03": "/media/drafts/illustration-heg-etp-03-v1.webp",
    "VIE-01": "/media/drafts/illustration-vie-01-v1.webp",
    "HEG-DOS-08": "/media/demo/illustrations/IMG-HEG-DOS-09.svg",
    "HEG-DOS-11": "/media/demo/illustrations/IMG-HEG-DOS-07.svg",
    "HEG-DOS-12": "/media/demo/illustrations/IMG-HEG-DOS-10.svg",
  };
  const illustration = entry.mediaRefs
    .map((mediaId) =>
      registry.assets.find((asset) => asset.assetId === mediaId),
    )
    .find((asset) => asset?.kind === "illustration_originale");
  const animation = entry.animationIds
    .map((mediaId) =>
      registry.assets.find((asset) => asset.assetId === mediaId),
    )
    .find((asset) => asset?.kind === "animation_scenarisee");
  const imageSrc =
    draftImages[entry.id] ??
    illustration?.url ??
    "/media/demo/atlas-valley.webp";
  const imageCaption = draftImages[entry.id]
    ? locale === "fr"
      ? "Illustration de travail EN REVUE : évocation non documentaire, sans valeur de reconstitution."
      : "رسم عمل قيد المراجعة: تصور غير توثيقي ولا يمثل إعادة بناء تاريخية."
    : (illustration?.caption[locale] ?? t("imageCaption"));
  const related = entry.relations
    .map((id) => registry.contents.find((c) => c.id === id))
    .filter((c) => !!c);
  return (
    <div className="page-wrap article-page">
      <BackLink to={parent} />
      <PageHeading
        eyebrow={`${entry.group[locale]} · ${entry.id}`}
        title={data.title}
      />
      <DemoNotice />
      <div className="article-layout">
        <article>
          <figure className="article-image">
            <MediaImage src={imageSrc} alt={illustration?.alt[locale] ?? ""} />
            <figcaption>{imageCaption}</figcaption>
          </figure>
          {animation && <AnimationPreview asset={animation} locale={locale} />}
          {entry.geography && (
            <div className="uncertainty-note">
              <Info size={22} />
              <p>{entry.geography.uncertainty[locale]}</p>
            </div>
          )}
          <p className="article-lead">{data.intro}</p>
          <nav className="article-toc" aria-label={t("sections")}>
            {data.sections.map((s, i) => (
              <a
                href={`#${s.sectionId}`}
                key={s.sectionId}
                onClick={() => updatePrefs({ lastSectionId: s.sectionId })}
              >
                <span>0{i + 1}</span>
                {s.heading}
              </a>
            ))}
          </nav>
          {data.sections.map((s) => (
            <section
              className="article-section"
              id={s.sectionId}
              key={s.sectionId}
            >
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          <details className="source-panel" id="sources">
            <summary>
              <BookOpen size={20} />
              {t("sources")}
            </summary>
            <div>
              <p>{t("noSources")}</p>
              <dl>
                <dt>{t("revision")}</dt>
                <dd>
                  <bdi>{entry.revision}</bdi>
                </dd>
                <dt>{t("status")}</dt>
                <dd>{t("pending")}</dd>
              </dl>
              {entry.referenceIds.map((id) => {
                const ref = registry.references.find(
                  (r) => r.referenceId === id,
                );
                return ref ? (
                  <p key={id}>
                    {ref.bibliographicCitation} — {ref.locator}
                  </p>
                ) : null;
              })}
            </div>
          </details>
          {related.length > 0 && (
            <section className="related">
              <h2>{t("related")}</h2>
              {related.map((c) => (
                <Link to={entryRoute(c)} key={c.id}>
                  {c.localized[locale].title}
                  <ChevronRight size={18} />
                </Link>
              ))}
            </section>
          )}
        </article>
        <aside className="article-sidebar">
          <AudioPlayer entry={entry} />
          <a className="source-shortcut" href="#sources">
            {t("sourceLink")}
            <ChevronRight size={18} />
          </a>
          {entry.objectIds.length > 0 && (
            <>
              <h2 className="small-heading">{t("objects")}</h2>
              {entry.objectIds.map((id) => (
                <ObjectViewer key={id} id={id} />
              ))}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
