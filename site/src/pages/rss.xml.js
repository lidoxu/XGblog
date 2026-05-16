import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostPath, sortPosts } from '../utils/posts';
import { getSite } from '../utils/seo';

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
