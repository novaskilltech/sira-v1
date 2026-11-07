import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, ChevronLeft } from "lucide-react";
import { useApp } from "../context";
import type { ContentEntry } from "../schema";
export const entryRoute = (c: ContentEntry) =>
  `/${c.space === "vie_quotidienne" ? "vie" : c.space}/${c.id}`;
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="page-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 tabIndex={-1}>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
export function BackLink({ to = "/" }: { to?: string }) {
  const { t } = useApp();
  return (
    <Link className="back-link" to={to}>
      <ChevronLeft size={18} />
      {t("back")}
    </Link>
  );
}
export function EntryCard({
  entry,
  index = 0,
  onSelect,
}: {
  entry: ContentEntry;
  index?: number;
  onSelect?: (id: string) => void;
}) {
  const { prefs, t } = useApp();
  const content = (
    <>
      <span className="entry-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <span className="small-label">{entry.group[prefs.locale]}</span>
        <h3>{entry.localized[prefs.locale].title}</h3>
        <span className="entry-action">
          <BookOpen size={16} />
          {t(onSelect ? "discover" : "read")}
        </span>
      </div>
      <ArrowUpRight className="entry-arrow" size={22} />
    </>
  );
  return onSelect ? (
    <button className="entry-card" onClick={() => onSelect(entry.id)}>
      {content}
    </button>
  ) : (
    <Link className="entry-card" to={entryRoute(entry)}>
      {content}
    </Link>
  );
}
export function DemoNotice() {
  return null;
}
