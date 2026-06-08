import type { APIContext } from 'astro';
import { getSite } from '../features/core/seo';

export function GET({ site }: APIContext) {
  const base = site ?? new URL(getSite().url);
  const sitemapUrl = new URL('/sitemap.xml', base).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
