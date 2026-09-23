import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://jeff.ro";
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/meditatii`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/grupa`, changeFrequency: "weekly", priority: 0.7 },
  ];
}
