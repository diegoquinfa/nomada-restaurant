import posthog from "posthog-js";
import { useEffect } from "react";

const POSTHOG_KEY =
  import.meta.env.PUBLIC_POSTHOG_KEY ?? import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST =
  import.meta.env.PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_POSTHOG_HOST;

/** Initializes PostHog once. Returns false when no key is configured. */
function initPostHog(): boolean {
  if (!POSTHOG_KEY) return false;

  if (!posthog.__loaded) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
    });
  }

  return true;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
}

export function PostHogPageView() {
  useEffect(() => {
    if (!initPostHog()) return;

    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, []);

  return null;
}
