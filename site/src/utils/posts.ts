import { getCollection, type CollectionEntry } from 'astro:content';
import { formatMonth } from './date';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts() {
  const posts = await getCollection('posts');
  return sortPosts(posts);
}

export function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => {
    const topDiff = (b.data.top ?? 0) - (a.data.top ?? 0);

    if (topDiff !== 0) {
      return topDiff;
    }

    return b.data.date.getTime() - a.data.date.getTime();
  });
}

export function getPostPath(post: Post) {
  return `/archives/${post.data.slug}`;
}

export function groupPostsByMonth(posts: Post[]) {
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const key = formatMonth(post.data.date);
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }

  return Array.from(groups.entries()).map(([month, items]) => ({ month, posts: items }));
}

export function filterPostsByCategory(posts: Post[], categorySlug: string) {
  return posts.filter((post) => post.data.categories.includes(categorySlug));
}

export function filterPostsByTag(posts: Post[], tagSlug: string) {
  return posts.filter((post) => post.data.tags.includes(tagSlug));
}
