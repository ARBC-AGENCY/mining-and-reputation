import { Reveal } from "@/components/motion/Reveal";
import {
  MiningVoicesShowcase,
  type VoicesItem,
} from "@/components/sections/MiningVoicesShowcase";
import { parseVideo } from "@/lib/video";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { INTERVIEWS_QUERY } from "@/sanity/lib/queries";

/**
 * Latest video interview.
 *
 * Every visible string comes from the post itself — title, description,
 * category — because interviews stand alone rather than belonging to a series.
 * With no interviews published the section renders nothing at all, rather than
 * showing framing copy for content that does not exist.
 *
 * Playback happens in an overlay, so no YouTube iframe (and no third-party
 * cookie) loads until the viewer presses play.
 */
export async function MiningVoicesSection() {
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
    // No cover uploaded? Use the video's own thumbnail.
    poster ??= parseVideo(post.videoUrl)?.thumbnailUrl ?? null;

    return {
      slug: post.slug ?? null,
      title: post.title ?? null,
      excerpt: post.excerpt ?? null,
      category: post.categories?.[0]?.title ?? null,
      poster,
      videoUrl: post.videoUrl ?? null,
    };
  });

  if (items.length === 0) return null;

  return (
    <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <MiningVoicesShowcase items={items} />
        </Reveal>
      </div>
    </section>
  );
}
