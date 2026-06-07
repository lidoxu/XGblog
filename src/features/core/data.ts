import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const env = import.meta.env as unknown as Record<string, string | undefined>;

function readYaml<T>(relativePath: string): T {
  const dataDir = join(process.cwd(), 'blog', 'data');
  const filePath = join(dataDir, relativePath);
  const examplePath = join(dataDir, 'example', relativePath);

  if (!existsSync(filePath)) {
    return YAML.parse(readFileSync(examplePath, 'utf8')) as T;
  }

  return YAML.parse(readFileSync(filePath, 'utf8')) as T;
}

function readEnv(key: string) {
  const value = env[key] ?? process.env[key];

  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.replace(/\\n/g, '\n') : undefined;
}

export type SiteData = {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  logo: string;
  theme: {
    accent: string;
  };
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
  target?: 'self' | 'blank' | '_self' | '_blank' | '' | null;
  children?: MenuItem[];
};

export type LinkItem = {
  name: string;
  url: string;
  description: string;
};

type RawSiteData = Omit<SiteData, 'subtitle' | 'logo' | 'theme' | 'author'> & {
  subtitle?: string;
  logo?: string | null;
  theme?: {
    accent?: string | null;
  };
  author: {
    name: string;
    avatar?: string | null;
    description: string;
  };
};

function publicAssetExists(path: string) {
  if (!path.startsWith('/')) {
    return false;
  }

  return existsSync(join(process.cwd(), 'blog', 'site', path.slice(1)));
}

function resolveConfiguredAsset(path: string | null | undefined) {
  if (!path) {
    return undefined;
  }

  const trimmed = path.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return publicAssetExists(trimmed) ? trimmed : undefined;
  }

  return trimmed;
}

function resolveFirstPublicAsset(candidates: string[]) {
  return candidates.find(publicAssetExists);
}

function resolveSiteLogo(configured?: string | null) {
  return resolveConfiguredAsset(configured) ?? resolveFirstPublicAsset([
    '/logo.svg',
    '/logo.webp',
    '/logo.png',
    '/logo.jpg',
    '/logo.jpeg',
    '/default-logo.svg',
    '/default-logo.webp',
    '/default-logo.png',
    '/default-logo.jpg',
    '/default-logo.jpeg',
  ]) ?? '/default-logo.svg';
}

function resolveAuthorAvatar(configured: string | null | undefined, fallbackLogo: string) {
  return resolveConfiguredAsset(configured) ?? resolveFirstPublicAsset([
    '/user.svg',
    '/user.webp',
    '/user.png',
    '/user.jpg',
    '/user.jpeg',
  ]) ?? fallbackLogo;
}

function resolveThemeAccent(configured: string | null | undefined) {
  const trimmed = configured?.trim();

  if (trimmed && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
    return trimmed;
  }

  return '#6aa6c8';
}

function resolveSiteData(data: RawSiteData): SiteData {
  const logo = resolveSiteLogo(readEnv('BLOG_LOGO') ?? data.logo);

  return {
    title: readEnv('BLOG_TITLE') ?? data.title,
    subtitle: readEnv('BLOG_SUBTITLE') ?? data.subtitle ?? data.description,
    description: readEnv('BLOG_DESCRIPTION') ?? data.description,
    url: readEnv('BLOG_URL') ?? data.url,
    logo,
    theme: {
      accent: resolveThemeAccent(data.theme?.accent),
    },
    author: {
      name: readEnv('BLOG_AUTHOR_NAME') ?? data.author.name,
      avatar: resolveAuthorAvatar(readEnv('BLOG_AUTHOR_AVATAR') ?? data.author.avatar, logo),
      description: readEnv('BLOG_AUTHOR_DESCRIPTION') ?? data.author.description,
    },
  };
}

export const siteData = resolveSiteData(readYaml<RawSiteData>('site.yaml'));
export const categoryData = readYaml<TaxonomyItem[]>('categories.yaml');
export const tagData = readYaml<TaxonomyItem[]>('tags.yaml');
export const menuData = readYaml<MenuItem[]>('menu.yaml');
export const linkData = readYaml<LinkItem[]>('links.yaml');
