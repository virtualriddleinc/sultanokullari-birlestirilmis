import type { SiteNewsDetail } from "@/lib/guncel-data";
import { absoluteUrl, resolveMediaUrl } from "@/lib/seo/site-url";
import type { JsonLdObject } from "@/lib/schema/types";

export function buildNewsArticleSchema(news: SiteNewsDetail): JsonLdObject {
  const pageUrl = absoluteUrl(`/guncel/haberler/${news.slug}`);

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.excerpt,
    datePublished: news.date,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl("#organization"),
      name: "Sultan Okulları",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
    author: {
      "@type": "Organization",
      name: "Sultan Okulları",
    },
    inLanguage: "tr-TR",
  };

  const image = resolveMediaUrl(news.featuredImageUrl);
  if (image) {
    schema.image = image;
  }

  return schema;
}
