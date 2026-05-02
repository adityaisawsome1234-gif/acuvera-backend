"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { useSession } from "next-auth/react";
import * as Sentry from "@sentry/browser";

async function sha256(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function AnalyticsProvider() {
  const { data: session } = useSession();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (sentryDsn) {
      Sentry.init({ dsn: sentryDsn, tracesSampleRate: 0.1 });
    }
    if (!key) {
      return;
    }
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  useEffect(() => {
    const identifyUser = async () => {
      if (!session?.user?.email) {
        return;
      }
      const idHash = await sha256(session.user.email);
      posthog.identify(idHash, {
        org_count: session.orgs?.length ?? 0,
      });
    };
    identifyUser();
  }, [session]);

  return null;
}
