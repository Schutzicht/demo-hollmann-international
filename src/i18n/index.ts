import { ui, defaultLang } from "./ui";

export type Lang = keyof typeof ui;

export const languages: Record<string, { label: string; native: string }> = {
  en: { label: "English", native: "EN" },
  de: { label: "Deutsch", native: "DE" },
  zh: { label: "中文", native: "中文" },
  ar: { label: "العربية", native: "ع" },
};

export const localeList = Object.keys(ui) as Lang[];
export const rtlLangs: Lang[] = ["ar"];
export const isRtl = (lang: string) => rtlLangs.includes(lang as Lang);
export const dir = (lang: string) => (isRtl(lang) ? "rtl" : "ltr");

function deepMerge<T>(base: T, override: any): T {
  if (override == null) return base;
  if (Array.isArray(base)) return (override ?? base) as T;
  if (typeof base === "object") {
    const out: any = { ...base };
    for (const k of Object.keys(base as any)) {
      out[k] = deepMerge((base as any)[k], (override as any)?.[k]);
    }
    return out;
  }
  return (override ?? base) as T;
}

export type Dict = typeof ui.en;

// Returns the full dictionary for a language, falling back to English per key.
export function getDict(lang: string): Dict {
  const l = (lang in ui ? lang : defaultLang) as Lang;
  return deepMerge(ui.en, ui[l]) as Dict;
}

// Resolve the active language from an Astro instance.
export function getLang(Astro: { currentLocale?: string }): Lang {
  const l = Astro.currentLocale ?? defaultLang;
  return (l in ui ? l : defaultLang) as Lang;
}

// Map the current path to the same page in another locale.
export function localizePath(pathname: string, target: string): string {
  const stripped = pathname.replace(/^\/(de|zh|ar)(?=\/|$)/, "") || "/";
  if (target === defaultLang) return stripped === "" ? "/" : stripped;
  return "/" + target + (stripped === "/" ? "" : stripped);
}

export { defaultLang };
