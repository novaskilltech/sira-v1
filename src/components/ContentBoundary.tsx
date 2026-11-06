import { Component, type ReactNode } from "react";
import { messages } from "../i18n";
import type { Locale } from "../schema";
export class ContentBoundary extends Component<
  { children: ReactNode; locale: Locale },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    const t = messages[this.props.locale];
    return (
      <section className="loading-state" role="alert">
        <h1>{t.error}</h1>
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          {t.retry}
        </button>
        <a className="button secondary" href="/">
          {t.home}
        </a>
      </section>
    );
  }
}
