import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import {
  MiningVoicesShowcase,
  type VoicesItem,
} from "@/components/sections/MiningVoicesShowcase";
import { parseVideo } from "@/lib/video";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { INTERVIEWS_QUERY } from "@/sanity/lib/queries";

const FALLBACK_POSTER = "/images/Background-2@2560.webp";

/**
 * "Mining Voices" — the video interview series.
 *
 * Copy is static brand positioning, so the section renders with or without
 * content; only the poster and the play target are dynamic. Playback happens in
 * an overlay rather than an inline embed, so no YouTube iframe (≈1MB of JS plus
 * third-party cookies) loads until the viewer actually presses play.
 */
export async function MiningVoicesSection() {
  await getTranslations("home.voices");
  const { data } = await sanityFetch({ query: INTERVIEWS_QUERY });

  const items: VoicesItem[] = (data ?? []).map((post) => {
    let poster: string | null = null;
    if (post.coverImage) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        poster = urlFor(post.coverImage as any)
          .width(1600)
          .height(900)
          .fit("crop")
          .auto("format")
          .url();
      } catch {
        poster = null;
      }
    }
    // No cover image uploaded? Fall back to the video's own thumbnail.
    poster ??= parseVideo(post.videoUrl)?.thumbnailUrl ?? null;

    return {
      slug: post.slug ?? null,
      title: post.title ?? null,
      poster,
      videoUrl: post.videoUrl ?? null,
    };
  });

  return (
    <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <MiningVoicesShowcase
            items={items}
            fallbackPoster={FALLBACK_POSTER}
          />
        </Reveal>
      </div>
    </section>
  );
}
