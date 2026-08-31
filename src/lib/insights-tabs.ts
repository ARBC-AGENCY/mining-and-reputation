/**
 * Shared between the server page and the client tab bar.
 *
 * This deliberately does NOT live in the "use client" component: values
 * exported from a client module become client-reference proxies when a server
 * component imports them, so `TAB_VALUES.includes(...)` would throw at runtime.
 */
export const TAB_VALUES = [
  "all",
  "article",
  "interview",
  "news",
  "resource",
] as const;

export type TabValue = (typeof TAB_VALUES)[number];
