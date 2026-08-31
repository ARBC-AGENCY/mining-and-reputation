import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

/** Sanity encodes dimensions in the asset ref: image-<hash>-<W>x<H>-<ext>. */
function refDimensions(ref: string | undefined) {
  const m = ref?.match(/-(\d+)x(\d+)-[a-z]+$/i);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

const components: PortableTextComponents = {
  types: {
    // Without this, PortableText silently drops image blocks — the editor sees
    // the image in the Studio and nothing on the page.
    image: ({ value }) => {
      const ref = value?.asset?._ref as string | undefined;
      const dims = refDimensions(ref);
      let src: string | null = null;
      try {
        src = urlFor(value).width(1400).auto("format").url();
      } catch {
        src = null;
      }
      if (!src) return null;

      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={value?.alt ?? ""}
            width={dims?.width ?? 1400}
            height={dims?.height ?? 900}
            sizes="(min-width: 768px) 768px, 100vw"
            className="h-auto w-full rounded-[14px]"
          />
          {value?.caption && (
            <figcaption className="text-grey-light/50 mt-3 text-sm">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    h2: ({ children }) => (
      <h2 className="font-display mt-12 mb-4 text-2xl text-white md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display mt-10 mb-3 text-xl text-white md:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-gold/50 text-grey-light/90 my-8 border-l-2 pl-5 text-lg italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-grey-light/85 leading-relaxed">{children}</p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="text-grey-light/85 my-5 list-disc space-y-2 pl-5">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-grey-light/85 my-5 list-decimal space-y-2 pl-5">
        {children}
      </ol>
    ),
  },

  marks: {
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="text-gold underline underline-offset-4 transition-colors hover:text-white"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PortableBody({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
