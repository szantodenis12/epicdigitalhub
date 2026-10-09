import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
