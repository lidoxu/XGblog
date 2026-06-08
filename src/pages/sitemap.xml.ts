import type { APIContext } from 'astro';
import { getSite } from '../features/core/seo';

export function GET({ site }: APIContext) {
  const base = site ?? new URL(getSite().url);
  const sitemapUrl = new URL('/sitemap-0.xml', base).href;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${sitemapUrl}</loc>\n  </sitemap>\n</sitemapindex>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
}
