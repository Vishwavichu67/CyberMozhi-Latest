
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cybermozhi.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/profile/",
        "/login/",
        "/signup/",
        "/forgot-password/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}