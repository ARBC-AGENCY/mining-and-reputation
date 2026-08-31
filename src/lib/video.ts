export type VideoProvider = "youtube" | "vimeo";

export type ParsedVideo = {
  provider: VideoProvider;
  id: string;
  /** Privacy-friendly embed URL, ready for an iframe src. */
  embedUrl: string;
  /** Auto-derived poster, YouTube only — Vimeo needs an API call. */
  thumbnailUrl: string | null;
};

/**
 * Parses a YouTube or Vimeo URL into the pieces the player and poster need.
 *
 * YouTube uses youtube-nocookie.com so no tracking cookie is set until the
 * viewer actually presses play.
 */
export function parseVideo(url: string | null | undefined): ParsedVideo | null {
  if (!url) return null;

  const yt =
    url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ??
    url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ??
    url.match(/youtube\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{6,})/);
  if (yt?.[1]) {
    return {
      provider: "youtube",
      id: yt[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    return {
      provider: "vimeo",
      id: vimeo[1],
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&dnt=1`,
      // Vimeo posters require an oEmbed call, so fall back to the cover image.
      thumbnailUrl: null,
    };
  }

  return null;
}
