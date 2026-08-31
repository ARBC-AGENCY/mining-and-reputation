import Image from "next/image";
import { ArrowRight, Download, Play } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { parseVideo } from "@/lib/video";
import { urlFor } from "@/sanity/lib/image";

export type PostCardData = {
  _id: string;
  format: string | null;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  coverImage: unknown;
  videoUrl?: string | null;
  categories?: { title: string | null; slug: string | null }[] | null;
};

function cover(image: unknown, w: number, h: number) {
  if (!image) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return urlFor(image as any).width(w).height(h).fit("crop").auto("format").url();
  } catch {
    return null;
  }
}

/**
 * One card, three presentations.
 *
 * Articles and news lead with the image; interviews add a play affordance so
 * the format is obvious before clicking; resources are file-forward, because
 * for a white paper the download is the point, not the picture.
 */
export async function PostCard({ post }: { post: PostCardData }) {
  const t = await getTranslations("formats");
  const ta = await getTranslations("article");

  const format = post.format ?? "article";
  const isInterview = format === "interview";
  const isResource = format === "resource";

  const known = ["article", "interview", "news", "resource"] as const;
  const label = (known as readonly string[]).includes(format)
    ? t(format as (typeof known)[number])
    : t("article");

  // Reports have covers too, so every format uses the image when one exists;
  // only a report with no cover falls back to the file-forward panel.
  const image =
    cover(post.coverImage, 800, 500) ??
    (isInterview ? (parseVideo(post.videoUrl)?.thumbnailUrl ?? null) : null);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-[#F7C15D]/40"
    >
      {isResource && !image ? (
        // Report with no cover uploaded — lead with the file instead.
        <div className="border-gold/25 bg-gold/10 flex items-center justify-center border-b py-10">
          <Download className="text-gold size-9" aria-hidden="true" />
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(160deg,#0A2325_0%,#05191A_45%,#353F2C_100%)]" />
          )}
          {/* Badge keeps the format legible at a glance over the cover. */}
          {(isInterview || isResource) && (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-12 place-items-center rounded-full border border-white/30 bg-black/40 backdrop-blur-md transition-colors group-hover:border-[#F7C15D] group-hover:bg-[#F7C15D]/25">
                {isInterview ? (
                  <Play className="size-4 fill-white text-white" aria-hidden="true" />
                ) : (
                  <Download className="size-4 text-white" aria-hidden="true" />
                )}
              </span>
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.7rem] font-medium tracking-[0.18em] text-[#F7C15D] uppercase">
            {label}
          </span>
          {post.categories?.[0]?.title && (
            <>
              <span className="text-grey-light/30" aria-hidden="true">·</span>
              <span className="text-grey-light/50 text-[0.7rem] tracking-wide uppercase">
                {post.categories[0].title}
              </span>
            </>
          )}
        </div>

        <h3 className="font-display mt-3 text-base leading-snug text-balance text-white transition-colors group-hover:text-[#F7C15D] md:text-lg">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-grey-light/65 mt-3 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <span className="text-gold mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium transition-colors group-hover:text-white">
          {isResource ? ta("download") : ta("readMore")}
          {isResource ? (
            <Download className="size-4" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
        </span>
      </div>
    </Link>
  );
}
