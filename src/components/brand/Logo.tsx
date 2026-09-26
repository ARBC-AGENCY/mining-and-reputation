import type { SVGProps } from "react";

/**
 * The V1 principal logo, as paths.
 *
 * The supplied SVG set its wordmark with an embedded SVG font, which no
 * current browser renders (it falls back to a serif). The glyphs were
 * converted to outlines — kerning from the brand PDF included — so it renders
 * identically everywhere and needs no font request.
 *
 * Colours come from CSS variables so a section can re-tint it:
 *   --logo-light (default #E6E6E6) and --logo-accent (default #F7C15D).
 */
const MARK_LIGHT =
  "M35.11 5.38 55.53 0 55.53 11.13 31.91 13.82ZM3.01 37.37 29.59 34.34 34.98 49.06 0.04 49.13 0 45.46Z";
const MARK_GOLD =
  "M17.4 20.65 52.39 16.46 51.98 48.53 40.5 48.69 32.86 28.89 13.51 31.15Z";
const TEXT_LIGHT =
  "M86.21 25.62l6.69-16.07l0 16.07l5.95 0l0-24.32l-8.55 0l-7.29 17.36l-7.09-17.36l-8.68 0l0 24.32l5.95 0l0-16.13l6.62 16.13l6.39 0zM103.34 1.3l0 24.32l6.52 0l0-24.32l-6.52 0zM122.1 1.3l-7.72 0l0 24.32l6.05 0l0-16.63l11.84 16.63l7.92 0l0-24.32l-6.02 0l0 17.23l-12.08-17.23zM144.72 1.3l0 24.32l6.52 0l0-24.32l-6.52 0zM163.49 1.3l-7.72 0l0 24.32l6.05 0l0-16.63l11.84 16.63l7.92 0l0-24.32l-6.02 0l0 17.23l-12.08-17.23zM208.36 12.98l-5.72 0l0 7.29l-6.72 0c-3.26 0-4.39-1.3-4.39-6.79c0-5.49 1.13-6.82 4.39-6.82l12.38 0l0-5.36l-12.41 0c-7.19 0-10.78 2.1-10.78 12.18c0 10.08 3.59 12.14 10.78 12.14l12.47 0l0-12.64zM249.48 25.62l-6.85-6.35l6.55-9.31l-6.05 0l-4.26 5.79l-3.53-3.29l2.59-1.5c2.3-1.3 3.16-2.33 3.16-4.69c0-3.33-1.73-4.96-5.46-4.96l-5.42 0c-3.76 0-5.49 1.66-5.49 4.99c0 1.5 0.37 2.89 1.86 4.29l1.36 1.3l-2.53 1.36c-2.63 1.43-3.46 2.73-3.46 5.66c0 4.76 2.16 6.72 6.95 6.72l4.29 0c3.29 0 5.12-0.86 6.62-2.56l2.73 2.56l6.92 0zm-16.63-4.22l-2.23 0c-2.16 0-2.76-0.7-2.76-2.79c0-1.63 0.37-2.13 2.13-3.09l1.13-0.63l4.96 4.66c-1.1 1.46-1.63 1.86-3.23 1.86zm-2.79-14.7c0-1 0.43-1.5 1.63-1.5l2.66 0c1.2 0 1.5 0.5 1.5 1.4c0 0.8-0.23 1.1-1.1 1.56l-2.53 1.4l-1.36-1.3c-0.7-0.63-0.8-1-0.8-1.56z";
const TEXT_GOLD =
  "M78.59 43.3c1.52 0 1.83 0.36 1.83 1.49l0 4.34l4.72 0l0-4.87c0-1.59-0.67-2.53-1.76-3.08c1.04-0.84 1.64-2.17 1.64-4.17c0-4.65-3.2-5.49-6.74-5.49l-11.03 0l0 17.61l4.72 0l0-5.83l6.62 0zm1.9-5.73c0 1.78-0.92 2.19-2.05 2.19l-6.48 0l0-4.36l6.48 0c1.13 0 2.05 0.39 2.05 2.17zM104.36 38.63l-11.49 0l0-3.3l11.54 0l0-3.81l-16.26 0l0 17.61l16.31 0l0-3.81l-11.59 0l0-3.3l11.49 0l0-3.4zM118.19 43.68c3.49 0 6.86-0.87 6.86-6c0-5.11-3.3-6.17-6.86-6.17l-10.79 0l0 17.61l4.72 0l0-5.44l6.07 0zm2.22-6c0 1.83-0.94 2.26-2.07 2.26l-6.21 0l0-4.55l6.21 0c1.13 0 2.07 0.43 2.07 2.29zM136.73 49.13c5.61 0 8.04-2.07 8.04-6.96l0-10.65l-4.6 0l0 10.65c0 2.26-0.84 3.16-3.37 3.16l-1.59 0c-2.6 0-3.4-0.89-3.4-3.16l0-10.65l-4.7 0l0 10.65c0 4.89 2.41 6.96 8.02 6.96l1.59 0zM152.75 49.13l4.72 0l0-13.8l6.24 0l0-3.81l-17.2 0l0 3.81l6.24 0l0 13.8zM160.99 49.13l4.91 0l1.61-3.42l9.44 0l1.61 3.42l4.77 0l-8.62-17.61l-5.11 0l-8.62 17.61zm11.22-13.42l3.03 6.41l-6.05 0l3.01-6.41zM187.02 49.13l4.72 0l0-13.8l6.24 0l0-3.81l-17.2 0l0 3.81l6.24 0l0 13.8zM199.98 31.52l0 17.61l4.72 0l0-17.61l-4.72 0zM216.63 35.09c4.07 0 4.72 1.32 4.72 5.25c0 3.93-0.65 5.25-4.72 5.25c-4.07 0-4.72-1.32-4.72-5.25c0-3.93 0.65-5.25 4.72-5.25zm0 14.4c7.78 0 9.37-2.5 9.37-9.15c0-6.65-1.59-9.15-9.37-9.15c-7.78 0-9.37 2.5-9.37 9.15c0 6.65 1.59 9.15 9.37 9.15zM234.11 31.52l-5.59 0l0 17.61l4.38 0l0-12.04l8.57 12.04l5.73 0l0-17.61l-4.36 0l0 12.48l-8.74-12.48z";

type LogoProps = SVGProps<SVGSVGElement> & {
  /** Accessible name. Omit when the parent (e.g. a link) already names it. */
  title?: string;
};

export function Logo({ title, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 249.56 49.49"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      <path fill="var(--logo-light, #E6E6E6)" d={MARK_LIGHT + TEXT_LIGHT} />
      <path fill="var(--logo-accent, #F7C15D)" d={MARK_GOLD + TEXT_GOLD} />
    </svg>
  );
}

/** The three-shard mark on its own — bullets, favicons, loaders. */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 55.6 49.2"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path fill="var(--logo-light, #E6E6E6)" d={MARK_LIGHT} />
      <path fill="var(--logo-accent, #F7C15D)" d={MARK_GOLD} />
    </svg>
  );
}
