import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostPath, sortPosts } from '../features/core/posts';
import { getSite } from '../features/core/seo';

export async function GET(context) {
  const site = getSite();
  const posts = sortPosts(await getCollection('posts'));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: getPostPath(post),
    })),
  });
}
