import { siteData } from './data';

export function getSite() {
  return siteData;
}

export function absoluteUrl(path = '/') {
  return new URL(path, siteData.url).toString();
}

export function pageTitle(title?: string) {
  return title ? `${title} - ${siteData.title}` : siteData.title;
}

export function resolveImage(path?: string) {
  if (!path) {
    return absoluteUrl(siteData.logo);
  }

  if (path.startsWith('http')) {
    return path;
  }

  if (path.startsWith('/')) {
    return absoluteUrl(path);
  }

  return absoluteUrl(path);
}
