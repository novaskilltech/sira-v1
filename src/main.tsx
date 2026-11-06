import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context";
import { registrySchema, validateRegistry, type Registry } from "./schema";
import { loadPreferences } from "./storage";
import { messages } from "./i18n";
import App from "./App";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "./styles.css";
function Bootstrap() {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const locale = loadPreferences().locale;
  const msg = messages[locale];
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setError(false);
    fetch("/content/manifest.v1.json", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw Error("manifest unavailable");
        const parsed = registrySchema.parse(await response.json());
        const issues = validateRegistry(
          parsed,
          import.meta.env.MODE === "public",
        );
        if (issues.length) throw Error("manifest invalid");
        if (active) setRegistry(parsed);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);
  if (!registry)
    return (
      <main
        className="bootstrap"
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <span className="bootstrap-brand">Sîra</span>
        <h1>{error ? msg.error : msg.loadingRegistry}</h1>
        {error && (
          <button
            className="button primary"
            onClick={() => setAttempt((a) => a + 1)}
          >
            {msg.retry}
          </button>
        )}
      </main>
    );
  return (
    <AppProvider registry={registry}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
);
