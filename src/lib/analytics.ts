import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "digisakhi_visit_counted";
const FALLBACK_COUNT_KEY = "digisakhi_visitor_fallback";
const INITIAL_COUNT = 15000;

let bumpPromise: Promise<number> | null = null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", "G-DB9J1H69C3", {
    page_path: path,
    page_title: title || document.title,
  });
}

export async function recordPageView(path: string) {
  const { error } = await supabase.from("page_views").insert({
    path,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  });
  if (error) {
    // Table may not exist yet until migration is applied.
  }
}

export async function getVisitorCount(): Promise<number> {
  const { data, error } = await supabase
    .from("site_stats")
    .select("value")
    .eq("key", "visitor_count")
    .maybeSingle();

  if (!error && data && typeof data.value === "number") {
    return Number(data.value);
  }

  const stored = Number(localStorage.getItem(FALLBACK_COUNT_KEY) || INITIAL_COUNT);
  return Number.isFinite(stored) ? stored : INITIAL_COUNT;
}

async function doBumpVisitorCount(): Promise<number> {
  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    return getVisitorCount();
  }

  const { data, error } = await supabase.rpc("increment_visitor_count");
  if (!error && typeof data === "number") {
    sessionStorage.setItem(SESSION_KEY, "1");
    localStorage.setItem(FALLBACK_COUNT_KEY, String(data));
    return data;
  }

  // Fallback when Supabase migration is not applied yet.
  const current = await getVisitorCount();
  const next = current + 1;
  localStorage.setItem(FALLBACK_COUNT_KEY, String(next));
  sessionStorage.setItem(SESSION_KEY, "1");
  return next;
}

/** Increments the ticker once per browser session (deduped across callers). */
export function bumpVisitorCountOncePerSession(): Promise<number> {
  if (!bumpPromise) {
    bumpPromise = doBumpVisitorCount();
  }
  return bumpPromise;
}
