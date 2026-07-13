import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

/** §2.3 geçiş: eski /subeler/* → yeni /okullarimiz/[city]/[campus] */
const branchRedirects = [
  {
    source: "/subeler/sancaktepe",
    destination: "/okullarimiz/istanbul/sancaktepe",
    permanent: true,
  },
  {
    source: "/subeler/basiskele",
    destination: "/okullarimiz/kocaeli/basiskele",
    permanent: true,
  },
  {
    source: "/subeler/serdivan",
    destination: "/okullarimiz/sakarya/serdivan",
    permanent: true,
  },
  {
    source: "/subeler/sincan",
    destination: "/okullarimiz/ankara/sincan",
    permanent: true,
  },
  {
    source: "/destek-hizmetleri",
    destination: "/#yemekhane",
    permanent: true,
  },
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [...branchRedirects];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      ...(process.env.NODE_ENV === "production"
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
    ];
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    localPatterns: [
      { pathname: "/api/media/file/**" },
      { pathname: "/_next/static/media/**" },
      { pathname: "/images/**" },
      { pathname: "/site-media/**" },
      { pathname: "/videos/**" },
    ],
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
