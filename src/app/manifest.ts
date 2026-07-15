import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sultan Okulları",
    short_name: "Sultan",
    description:
      "Millî ve Mânevî değerlerle bütünleşik eğitim. Anaokulu, ilkokul ve ortaokul programları.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a1c18",
    theme_color: "#4cff00",
    lang: "tr",
    categories: ["education"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/sultan-okullari-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    screenshots: [],
  };
}
