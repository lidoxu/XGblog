import { categoryData, tagData } from './data';

export const allCategories = categoryData;
export const allTags = tagData;

export function getCategory(slug: string) {
  return allCategories.find((category) => category.slug === slug) ?? {
    slug,
    name: slug,
    description: '',
  };
}

export function getTag(slug: string) {
  return allTags.find((tag) => tag.slug === slug) ?? {
    slug,
    name: slug,
    description: '',
  };
}

export function countCategories(posts: Array<{ data: { categories: string[] } }>) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const slug of post.data.categories) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return counts;
}

export function countTags(posts: Array<{ data: { tags: string[] } }>) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const slug of post.data.tags) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return counts;
}
