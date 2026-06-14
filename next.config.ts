import type { NextConfig } from "next";

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
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [...branchRedirects];
  },
};

export default nextConfig;
