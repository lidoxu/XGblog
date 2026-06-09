import rss from '@astrojs/rss';
import { getAllPosts, getPostPath } from '../features/core/posts';
import { getSite } from '../features/core/seo';

export async function GET(context) {
  const site = getSite();
  const baseUrl = context.site ?? new URL(site.url);
  const posts = await getAllPosts();

  return rss({
    title: site.title,
    description: site.description,
    site: baseUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: getPostPath(post),
    })),
  });
}
