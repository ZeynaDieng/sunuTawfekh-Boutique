/** Clé partagée avec le script inline dans app.html */
export const THEME_STORAGE_KEY = "st-color-scheme";

export function useThemeMode() {
  const isDark = useState("theme-dark", () => false);

  function syncFromDocument() {
    if (!import.meta.client) return;
    isDark.value = document.documentElement.classList.contains("dark");
  }

  /** Bascule clair / sombre et persiste le choix. */
  function toggle() {
    if (!import.meta.client) return;
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    isDark.value = next;
  }

  return { isDark, toggle, syncFromDocument };
}
