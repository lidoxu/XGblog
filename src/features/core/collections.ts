type CollectionSourceEntry = {
  id: string;
};

export function normalizeEntryId(id: string) {
  return id.replace(/\\/g, '/').replace(/\/index(?:\.md)?$/, '').replace(/\.md$/, '');
}

export function getEntryFolderName(id: string) {
  const normalized = normalizeEntryId(id);
  const segments = normalized.split('/').filter(Boolean);
  return segments.at(-1) ?? normalized;
}

export function isExampleEntry(entry: CollectionSourceEntry, collection: 'posts' | 'pages') {
  return normalizeEntryId(entry.id).startsWith(`example/${collection}/`);
}

export function selectActiveEntries<T extends CollectionSourceEntry>(entries: T[], collection: 'posts' | 'pages') {
  const userEntries = entries.filter((entry) => !isExampleEntry(entry, collection));
  return userEntries.length > 0 ? userEntries : entries.filter((entry) => isExampleEntry(entry, collection));
}

export function getEntryAssetDir(id: string) {
  return normalizeEntryId(id);
}
