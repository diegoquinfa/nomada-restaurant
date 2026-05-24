import posthog from "posthog-js";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
    });
  }, []);

  return <>{children}</>;
}

export function PostHogPageView() {
  const location = useRouterState({ select: (s) => s.location });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Ok
  useEffect(() => {
    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [location.pathname, location.search]);

  return null;
}
