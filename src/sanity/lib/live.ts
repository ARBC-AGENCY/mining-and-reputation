// Querying with "sanityFetch" keeps content automatically updated.
// <SanityLive /> is rendered in the locale layout.
// https://github.com/sanity-io/next-sanity#live-content-api
import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  /**
   * Required for freshness in a production build.
   *
   * `sanityFetch` opts into Next's cache. The browser subscribes to the Live
   * Content API and asks for a refresh, but without a read token the server
   * cannot verify the latest event id, so it re-serves the cached response and
   * newly published content never appears until the next deploy.
   *
   * `next dev` is unaffected, which is why this only shows up after deploying.
   * Create a Viewer token at sanity.io/manage and set SANITY_API_READ_TOKEN.
   */
  serverToken: process.env.SANITY_API_READ_TOKEN,
});
