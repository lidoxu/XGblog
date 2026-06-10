import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getEntryAssetDir, getEntryFolderName, selectActiveEntries } from './collections';
import { formatMonth } from './date';
import { getCategory, getTag, normalizeSlug } from './taxonomy';

export type Post = CollectionEntry<'posts'>;
export type PostCover = string | ImageMetadata;

const postAssets = import.meta.glob([
  '../../../blog/posts/**/*.{avif,gif,jpeg,jpg,png,svg,webp}',
  '../../../example/posts/**/*.{avif,gif,jpeg,jpg,png,svg,webp}',
], {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;

export async function getAllPosts() {
  const posts = await getCollection('posts');
  return sortPosts(selectActiveEntries(posts, 'posts'));
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

export function getPostSlug(post: Post) {
  return post.data.slug || getEntryFolderName(post.id);
}

export function getPostPath(post: Post) {
  return `/archives/${getPostSlug(post)}`;
}

function normalizePostAssetPath(path: string) {
  return path.replace(/\\/g, '/').replace(/^\.?\//, '');
}

function getPostAsset(post: Post, path: string) {
  const key = `../../../${getEntryAssetDir(post.id)}/${normalizePostAssetPath(path)}`;
  return postAssets[key];
}

function getCoverFromFrontmatter(post: Post, slug: string, cover: string): PostCover {
  if (/^(https?:)?\/\//.test(cover) || cover.startsWith('data:')) {
    return cover;
  }

  const oldPublicPrefix = `/posts/${slug}/`;

  if (cover.startsWith(oldPublicPrefix)) {
    return getPostAsset(post, cover.slice(oldPublicPrefix.length)) ?? cover;
  }

  if (cover.startsWith('/')) {
    return cover;
  }

  return getPostAsset(post, cover) ?? cover;
}

export function getPostCover(post: Post): PostCover {
  const slug = getPostSlug(post);

  if (post.data.cover) {
    return getCoverFromFrontmatter(post, slug, post.data.cover);
  }

  const candidates = [
    'img/cover.svg',
    'img/cover.avif',
    'img/cover.webp',
    'img/cover.png',
    'img/cover.jpg',
    'img/cover.jpeg',
    'cover.svg',
    'cover.avif',
    'cover.webp',
    'cover.png',
    'cover.jpg',
    'cover.jpeg',
    `img/${slug}-1.svg`,
    `img/${slug}-1.avif`,
    `img/${slug}-1.webp`,
    `img/${slug}-1.png`,
    `img/${slug}-1.jpg`,
    `img/${slug}-1.jpeg`,
  ];

  return candidates.map((path) => getPostAsset(post, path)).find(Boolean) ?? '/default/default-cover.webp';
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
  const normalized = getCategory(categorySlug).slug;
  return posts.filter((post) => post.data.categories.some((slug) => normalizeSlug(slug) === normalized));
}

export function filterPostsByTag(posts: Post[], tagSlug: string) {
  const normalized = getTag(tagSlug).slug;
  return posts.filter((post) => post.data.tags.some((slug) => normalizeSlug(slug) === normalized));
}
