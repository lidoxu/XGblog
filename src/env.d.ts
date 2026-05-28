/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BLOG_TITLE?: string;
  readonly BLOG_SUBTITLE?: string;
  readonly BLOG_DESCRIPTION?: string;
  readonly BLOG_URL?: string;
  readonly BLOG_LOGO?: string;
  readonly BLOG_AUTHOR_NAME?: string;
  readonly BLOG_AUTHOR_AVATAR?: string;
  readonly BLOG_AUTHOR_DESCRIPTION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.yaml' {
  const value: unknown;
  export default value;
}
