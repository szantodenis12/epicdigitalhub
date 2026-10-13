import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The site answers on epicdigitalhub.ro, but every deployment also keeps a
     *.vercel.app alias serving the same pages. The canonical on each page
     already points at the real domain, which is the main protection, but an
     indexable copy is still a copy — so the alias says so itself. Host-scoped,
     so the real domain is untouched.

     The dots are double-escaped because this string becomes a regex: "\." in
     the source is a literal dot in the pattern, while a single backslash would
     be dropped by the string literal and leave "." matching any character. */
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\.vercel\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  /* The combined KGM & Chery case study became two pages when the V2 copy deck
     split it. The old URL was live, so it redirects to the KGM page rather than
     404ing — permanently, so the link equity moves with it. */
  async redirects() {
    return [
      {
        source: "/case-studies/kgm-chery-oradea",
        destination: "/case-studies/kgm-oradea",
        permanent: true,
      },
      {
        source: "/ro/case-studies/kgm-chery-oradea",
        destination: "/ro/case-studies/kgm-oradea",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
