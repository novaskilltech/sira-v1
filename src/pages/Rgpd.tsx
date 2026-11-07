import { useState } from "react";
import {
  ShieldCheck,
  Cookie,
  HardDrive,
  UserCheck,
  Mail,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { useApp } from "../context";
import { narration } from "../audio";
import { BackLink, PageHeading } from "../components/Shared";

export default function Rgpd() {
  const { t, prefs, updatePrefs } = useApp();
  const [cleared, setCleared] = useState(false);

  const handleClearPreferences = () => {
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
    setTimeout(() => setCleared(false), 5000);
  };

  return (
    <div className="page-wrap information rgpd-page">
      <BackLink />
      <PageHeading
        title={t("rgpdTitle")}
        description={t("rgpdDesc")}
      />

      <section>
        <h2>
          <ShieldCheck size={24} />
          {t("rgpdMinimizationTitle")}
        </h2>
        <p>{t("rgpdMinimizationText")}</p>
      </section>

      <section>
        <h2>
          <Cookie size={24} />
          {t("rgpdCookiesTitle")}
        </h2>
        <p>{t("rgpdCookiesText")}</p>
      </section>

      <section>
        <h2>
          <HardDrive size={24} />
          {t("rgpdStorageTitle")}
        </h2>
        <p>{t("rgpdStorageText")}</p>
        <div style={{ marginTop: "18px" }}>
          <button
            type="button"
            className="button secondary"
            onClick={handleClearPreferences}
          >
            <RotateCcw size={16} />
            {t("clear")}
          </button>
          {cleared && (
            <p role="status" style={{ color: "var(--green)", marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle size={16} />
              {t("cleared")}
            </p>
          )}
        </div>
      </section>

      <section>
        <h2>
          <UserCheck size={24} />
          {t("rgpdDsarTitle")}
        </h2>
        <p>{t("rgpdDsarText")}</p>
        <p style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Mail size={18} style={{ color: "var(--ochre-text)" }} />
          <strong>
            <a href="mailto:novaskilltech@gmail.com" style={{ textDecoration: "underline", color: "var(--green)" }}>
              novaskilltech@gmail.com
            </a>
          </strong>
        </p>
      </section>
    </div>
  );
}
