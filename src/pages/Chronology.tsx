import { useApp } from "../context";
import { Link } from "react-router-dom";
import {
  BackLink,
  EntryCard,
  PageHeading,
  entryRoute,
} from "../components/Shared";
export default function Chronology() {
  const { registry, prefs, t, ui, setUi } = useApp();
  const entries = registry.contents.filter((c) => c.space === "chronologie");
  const groups = [...new Set(entries.map((c) => c.group.fr))];
  const selected = typeof ui.period === "string" ? ui.period : "";
  const selectedEntry = entries.find((c) => c.id === ui.chronologySelection);
  return (
    <div className="page-wrap">
      <BackLink />
      <PageHeading
        eyebrow={t("chronologyMeta")}
        title={t("chronology")}
        description={t("timelineIntro")}
      />
      <nav className="filter-bar" aria-label={t("periods")}>
        <button
          className={!selected ? "active" : ""}
          onClick={() => setUi("period", "")}
        >
          {t("all")}
        </button>
        {groups.map((group, i) => (
          <button
            key={group}
            className={selected === group ? "active" : ""}
            aria-pressed={selected === group}
            onClick={() => setUi("period", group)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {entries.find((c) => c.group.fr === group)!.group[prefs.locale]}
          </button>
        ))}
      </nav>
      {selectedEntry && (
        <aside
          className="chronology-preview selected-preview"
          aria-live="polite"
        >
          <span className="eyebrow">
            {t("selected")} · {selectedEntry.id}
          </span>
          <h2>{selectedEntry.localized[prefs.locale].title}</h2>
          <p>{selectedEntry.localized[prefs.locale].intro}</p>
          <Link className="button primary" to={entryRoute(selectedEntry)}>
            {t("read")}
          </Link>
        </aside>
      )}
      <div className="timeline">
        {groups
          .filter((g) => !selected || g === selected)
          .map((group) => (
            <section className="period-section" key={group}>
              <header>
                <span className="period-dot" />
                <span className="eyebrow">
                  {String(groups.indexOf(group) + 1).padStart(2, "0")} / 06
                </span>
                <h2>
                  {
                    entries.find((c) => c.group.fr === group)!.group[
                      prefs.locale
                    ]
                  }
                </h2>
              </header>
              <div className="entry-grid">
                {entries
                  .filter((c) => c.group.fr === group)
                  .map((entry, i) => (
                    <EntryCard
                      entry={entry}
                      index={i}
                      key={entry.id}
                      onSelect={(id) => {
                        setUi("chronologySelection", id);
                        requestAnimationFrame(() =>
                          document
                            .querySelector(".chronology-preview")
                            ?.scrollIntoView({
                              behavior: "instant",
                              block: "center",
                            }),
                        );
                      }}
                    />
                  ))}
              </div>
            </section>
          ))}
      </div>
      <div className="toolbar">
        <button
          className="button secondary"
          onClick={() =>
            setUi("period", groups[Math.max(0, groups.indexOf(selected) - 1)])
          }
        >
          {t("previous")}
        </button>
        <button
          className="button secondary"
          onClick={() =>
            setUi(
              "period",
              groups[Math.min(groups.length - 1, groups.indexOf(selected) + 1)],
            )
          }
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
