import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

function readYaml<T>(relativePath: string): T {
  const filePath = join(process.cwd(), 'src', 'content', 'data', relativePath);
  return YAML.parse(readFileSync(filePath, 'utf8')) as T;
}

export type SiteData = {
  title: string;
  description: string;
  url: string;
  logo: string;
  author: {
    name: string;
    avatar: string;
    description: string;
  };
};

export type TaxonomyItem = {
  slug: string;
  name: string;
  description?: string;
};

export type MenuItem = {
  label: string;
  href: string;
};

export type LinkItem = {
  name: string;
  url: string;
  description: string;
};

export const siteData = readYaml<SiteData>('site.yml');
export const categoryData = readYaml<TaxonomyItem[]>('categories.yml');
export const tagData = readYaml<TaxonomyItem[]>('tags.yml');
export const menuData = readYaml<MenuItem[]>('menu.yml');
export const linkData = readYaml<LinkItem[]>('links.yml');
