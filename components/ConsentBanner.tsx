"use client";

const CONSENT_KEY = "es_tracking_consent";

type Consent = "accepted" | "rejected" | null;

export function getTrackingConsent(): Consent {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(CONSENT_KEY) as Consent) ?? "rejected";
}

export default function ConsentBanner() {
  return null;
}
