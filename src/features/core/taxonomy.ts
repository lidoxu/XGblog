import { categoryData, tagData, type TaxonomyItem } from './data';

export const normalizeSlug = (value: string) => value.trim().toLowerCase();

function normalizeTaxonomyItem(item: TaxonomyItem): TaxonomyItem {
  return {
    ...item,
    slug: normalizeSlug(item.slug),
  };
}

function matchesTaxonomySlug(item: TaxonomyItem, slug: string) {
  const normalized = normalizeSlug(slug);
  return item.slug === normalized;
}

export const allCategories = categoryData.map(normalizeTaxonomyItem);
export const allTags = tagData.map(normalizeTaxonomyItem);

export function getCategory(slug: string) {
  const normalized = normalizeSlug(slug);
  return allCategories.find((category) => matchesTaxonomySlug(category, normalized)) ?? {
    slug: normalized,
    name: normalized,
    description: '',
  };
}

export function getTag(slug: string) {
  const normalized = normalizeSlug(slug);
  return allTags.find((tag) => matchesTaxonomySlug(tag, normalized)) ?? {
    slug: normalized,
    name: normalized,
    description: '',
  };
}

export function getCategoryPath(slug: string) {
  return `/categories/${getCategory(slug).slug}`;
}

export function getTagPath(slug: string) {
  return `/tags/${getTag(slug).slug}`;
}

export function countCategories(posts: Array<{ data: { categories: string[] } }>) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const slug of post.data.categories) {
      const category = getCategory(slug);
      counts.set(category.slug, (counts.get(category.slug) ?? 0) + 1);
    }
  }

  return counts;
}

export function countTags(posts: Array<{ data: { tags: string[] } }>) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const slug of post.data.tags) {
      const tag = getTag(slug);
      counts.set(tag.slug, (counts.get(tag.slug) ?? 0) + 1);
    }
  }

  return counts;
}
