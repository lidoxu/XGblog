import { getCollection, type CollectionEntry } from 'astro:content';
import { getEntryFolderName, selectActiveEntries } from './collections';

export type CustomPage = CollectionEntry<'pages'>;

export async function getAllPages() {
  const pages = await getCollection('pages');
  return selectActiveEntries(pages, 'pages');
}

export function getPageSlug(page: CustomPage) {
  return getEntryFolderName(page.id);
}
