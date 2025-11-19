import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "books.google.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "picsum.photos",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
