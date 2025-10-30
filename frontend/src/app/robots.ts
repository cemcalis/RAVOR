import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ravor.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/hesap/',
          '/sepet/',
          '/odeme/',
          '/siparislerim/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
