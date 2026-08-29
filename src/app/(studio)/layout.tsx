/**
 * Root layout for the Sanity Studio route group.
 *
 * The Studio lives outside the [locale] segment, so it needs its own
 * <html>/<body>. Note this means navigating between the site and /studio
 * triggers a full page load, which is fine for an authoring tool.
 */
export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
