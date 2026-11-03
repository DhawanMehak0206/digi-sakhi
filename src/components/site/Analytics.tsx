import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { bumpVisitorCountOncePerSession, recordPageView, trackPageView } from "@/lib/analytics";

/**
 * Tracks SPA route changes in Google Analytics + Supabase page_views,
 * and bumps the visitor ticker once per browser session.
 */
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    trackPageView(path, document.title);
    void recordPageView(path);
  }, [location.pathname, location.search]);

  useEffect(() => {
    void bumpVisitorCountOncePerSession();
  }, []);

  return null;
}
