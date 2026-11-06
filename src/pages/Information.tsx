import { useState } from "react";
import { Accessibility, BookOpen, ShieldCheck, Volume2 } from "lucide-react";
import { useApp } from "../context";
import { narration } from "../audio";
import { BackLink, PageHeading } from "../components/Shared";
export default function Information({ legal = false }: { legal?: boolean }) {
  const { t, prefs, updatePrefs, reducedMotion } = useApp();
  const [cleared, setCleared] = useState(false);
  return (
    <div className="page-wrap information">
      <BackLink />
      <PageHeading
        title={t(legal ? "legal" : "help")}
        description={t(legal ? "legalIntro" : "helpIntro")}
      />
      {legal ? (
        <>
          <section>
            <h2>{t("legal")}</h2>
            <p>{t("operatorMissing")}</p>
          </section>
          <section>
            <h2>{t("sourcePromise")}</h2>
            <p>{t("credits")}</p>
            <p>{t("sourceText")}</p>
          </section>
          <section>
            <h2>{t("preferences")}</h2>
            <p>{t("privacyText")}</p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>
              <BookOpen />
              {t("welcome")}
            </h2>
            <p>{t("helpNavigation")}</p>
            <p>{t("uncertaintyHelp")}</p>
          </section>
          <section>
            <h2>
              <Volume2 />
              {t("audio")}
            </h2>
            <p>{t("helpAudio")}</p>
          </section>
          <section>
            <h2>
              <Accessibility />
              {t("help")}
            </h2>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) =>
                  updatePrefs({ reducedMotionOverride: e.target.checked })
                }
              />
              {t("motion")}
            </label>
            <p className="small-note">{t("motionSystem")}</p>
          </section>
          <section>
            <h2>
              <ShieldCheck />
              {t("preferences")}
            </h2>
            <p>{t("privacyText")}</p>
            <button
              className="button secondary"
              onClick={() => {
                narration().clear();
                updatePrefs({
                  locale: prefs.locale,
                  lastContentId: undefined,
                  lastSectionId: undefined,
                  lastVisitedRoute: undefined,
                  audioPositionsByContentLocale: {},
                  reducedMotionOverride: undefined,
                });
                setCleared(true);
              }}
            >
              {t("clear")}
            </button>
            {cleared && <p role="status">{t("cleared")}</p>}
          </section>
        </>
      )}
    </div>
  );
}
