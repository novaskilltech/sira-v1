import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { messages, type MessageKey } from "./i18n";
import { loadPreferences, savePreferences, type Preferences } from "./storage";
import type { Registry } from "./schema";
type PreferenceUpdate =
  Partial<Preferences> | ((previous: Preferences) => Partial<Preferences>);
type ContextValue = {
  registry: Registry;
  prefs: Preferences;
  updatePrefs: (patch: PreferenceUpdate) => void;
  t: (key: MessageKey) => string;
  reducedMotion: boolean;
  ui: Record<string, unknown>;
  setUi: (key: string, value: unknown) => void;
};
const Context = createContext<ContextValue | null>(null);
export function AppProvider({
  registry,
  children,
}: {
  registry: Registry;
  children: ReactNode;
}) {
  const [prefs, setPrefs] = useState(loadPreferences);
  const [systemMotion, setSystemMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [ui, setUiState] = useState<Record<string, unknown>>({});
  const updatePrefs = useCallback(
    (patch: PreferenceUpdate) =>
      setPrefs((p) => ({
        ...p,
        ...(typeof patch === "function" ? patch(p) : patch),
      })),
    [],
  );
  const setUi = useCallback(
    (key: string, value: unknown) =>
      setUiState((s) => ({ ...s, [key]: value })),
    [],
  );
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setSystemMotion(m.matches);
    m.addEventListener("change", listener);
    return () => m.removeEventListener("change", listener);
  }, []);
  useEffect(() => {
    document.documentElement.lang = prefs.locale;
    document.documentElement.dir = prefs.locale === "ar" ? "rtl" : "ltr";
    savePreferences(prefs);
  }, [prefs]);
  const value = useMemo<ContextValue>(
    () => ({
      registry,
      prefs,
      updatePrefs,
      t: (key) => messages[prefs.locale][key],
      reducedMotion: prefs.reducedMotionOverride ?? systemMotion,
      ui,
      setUi,
    }),
    [registry, prefs, systemMotion, ui, updatePrefs, setUi],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() {
  const context = useContext(Context);
  if (!context) throw new Error("AppProvider missing");
  return context;
}
