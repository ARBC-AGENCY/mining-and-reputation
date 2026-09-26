import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* The single <main> for the site — pages must not render their own. */}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
