import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const env = import.meta.env as unknown as Record<string, string | undefined>;
const dataDir = join(process.cwd(), 'blog', 'data');

function readYamlFile<T>(relativePath: string): T | undefined {
  const filePath = join(dataDir, relativePath);

  if (!existsSync(filePath)) {
    return undefined;
  }

  return YAML.parse(readFileSync(filePath, 'utf8')) as T;
}

function readExampleYaml<T>(relativePath: string): T {
  return YAML.parse(readFileSync(join(dataDir, 'example', relativePath), 'utf8')) as T;
}

function readYaml<T>(relativePath: string): T {
  return readYamlFile<T>(relativePath) ?? readExampleYaml<T>(relativePath);
}

function readEnv(key: string) {
  for (const value of [process.env[key], env[key]]) {
    const trimmed = value?.trim();

    if (trimmed) {
      return trimmed.replace(/\\n/g, '\n');
    }
  }

  return undefined;
}

export type SiteData = {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  logo: string;
  darkLogo: string;
  showTitle: boolean;
  theme: {
    color: string;
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
  desc: string;
  icon?: string;
};

export type LinkGroup = {
  name: string;
  links: LinkItem[];
};

type RawSiteData = Omit<SiteData, 'subtitle' | 'url' | 'logo' | 'darkLogo' | 'showTitle' | 'theme' | 'author'> & {
  subtitle?: string;
  url?: string | null;
  logo?: string | null;
  darkLogo?: string | null;
  showTitle?: boolean | string | number | null;
  theme?: {
    color?: string | null;
    accent?: string | null;
  };
  author: {
    name: string;
    avatar?: string | null;
    description: string;
  };
};

type PartialRawSiteData = Partial<Omit<RawSiteData, 'theme' | 'author'>> & {
  theme?: RawSiteData['theme'];
  author?: Partial<RawSiteData['author']>;
};

function readSiteYaml() {
  const example = readExampleYaml<RawSiteData>('site.yaml');
  const user = readYamlFile<PartialRawSiteData>('site.yaml');

  if (!user) {
    return example;
  }

  return {
    ...example,
    ...user,
    theme: {
      ...example.theme,
      ...user.theme,
    },
    author: {
      ...example.author,
      ...user.author,
    },
  };
}

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
    '/logo.avif',
    '/logo.webp',
    '/logo.png',
    '/logo.jpg',
    '/logo.jpeg',
    '/default-logo.svg',
    '/default-logo.avif',
    '/default-logo.webp',
    '/default-logo.png',
    '/default-logo.jpg',
    '/default-logo.jpeg',
  ]) ?? '/default-logo.svg';
}

function resolveAuthorAvatar(configured: string | null | undefined, fallbackLogo: string) {
  return resolveConfiguredAsset(configured) ?? resolveFirstPublicAsset([
    '/user.svg',
    '/user.avif',
    '/user.webp',
    '/user.png',
    '/user.jpg',
    '/user.jpeg',
  ]) ?? fallbackLogo;
}

function resolveThemeColor(configured: string | null | undefined) {
  const trimmed = configured?.trim();

  if (trimmed && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
    return trimmed;
  }

  return '#6aa6c8';
}

function resolveSiteUrl(configured: string | null | undefined) {
  const trimmed = configured?.trim();
  return trimmed || 'https://www.xiaoge.org';
}

function resolveBoolean(configured: string | boolean | number | null | undefined, fallback: boolean) {
  if (typeof configured === 'boolean') {
    return configured;
  }

  if (typeof configured === 'number') {
    return configured !== 0;
  }

  const trimmed = configured?.trim().toLowerCase();

  if (!trimmed) {
    return fallback;
  }

  return !['false', '0', 'no', 'off'].includes(trimmed);
}

function resolveSiteData(data: RawSiteData): SiteData {
  const logo = resolveSiteLogo(readEnv('BLOG_LOGO') ?? data.logo);
  const darkLogo = resolveConfiguredAsset(readEnv('BLOG_DARK_LOGO') ?? data.darkLogo) ?? logo;

  return {
    title: readEnv('BLOG_TITLE') ?? data.title,
    subtitle: readEnv('BLOG_SUBTITLE') ?? data.subtitle ?? data.description,
    description: readEnv('BLOG_DESCRIPTION') ?? data.description,
    url: resolveSiteUrl(readEnv('BLOG_URL') ?? data.url),
    logo,
    darkLogo,
    showTitle: resolveBoolean(readEnv('BLOG_SHOW_TITLE') ?? data.showTitle, true),
    theme: {
      color: resolveThemeColor(readEnv('THEME_COLOR') ?? data.theme?.color ?? data.theme?.accent),
    },
    author: {
      name: readEnv('BLOG_AUTHOR') ?? readEnv('BLOG_AUTHOR_NAME') ?? data.author.name,
      avatar: resolveAuthorAvatar(readEnv('BLOG_AVATAR') ?? readEnv('BLOG_AUTHOR_AVATAR') ?? data.author.avatar, logo),
      description: readEnv('BLOG_BIO') ?? readEnv('BLOG_AUTHOR_DESCRIPTION') ?? data.author.description,
    },
  };
}

function resolveLinkGroups(data: Record<string, Record<string, Omit<LinkItem, 'name'>>>) {
  return Object.entries(data).map(([groupName, links]) => ({
    name: groupName,
    links: Object.entries(links ?? {}).map(([name, link]) => ({
      name,
      url: link.url,
      desc: link.desc,
      icon: link.icon,
    })),
  }));
}

export const siteData = resolveSiteData(readSiteYaml());
export const categoryData = readYaml<TaxonomyItem[]>('categories.yaml');
export const tagData = readYaml<TaxonomyItem[]>('tags.yaml');
export const menuData = readYaml<MenuItem[]>('menu.yaml');
export const linkData = resolveLinkGroups(readYaml<Record<string, Record<string, Omit<LinkItem, 'name'>>>>('links.yaml'));
