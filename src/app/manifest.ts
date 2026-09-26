import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

/** Web app manifest: name, colours and icons for "Add to home screen". */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "M&R",
    description:
      "Strategic communication and reputation management for the mining industry.",
    start_url: "/",
    display: "standalone",
    background_color: "#05191A",
    theme_color: "#05191A",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
