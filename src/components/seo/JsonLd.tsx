/**
 * Emits one JSON-LD block. `<` is escaped so content from the CMS can never
 * close the script tag early (the pattern the Next.js JSON-LD guide uses).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
