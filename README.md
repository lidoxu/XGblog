# XG-BLOG 静态博客

这是一个根目录即项目目录的 Astro 静态博客。`blog/` 是用户内容区，`src/` 是页面模板和功能实现。

## 目录结构

```text
./
├─ blog/
│  ├─ posts/                # 文章：每篇一个目录，包含 index.md 和 img/
│  ├─ pages/                # 自定义一级页面：每页一个目录，包含 index.md
│  ├─ example/              # TOML 示例模板；没有用户配置时作为默认回退
│  ├─ images/               # 公开图片资源：默认封面、默认 logo、默认头像，也可放站点图片
│  ├─ menu.toml             # 从 blog/example/menu.toml 复制后修改
│  ├─ categories.toml       # 从 blog/example/categories.toml 复制后修改
│  ├─ tags.toml             # 从 blog/example/tags.toml 复制后修改
│  └─ links.toml            # 从 blog/example/links.toml 复制后修改
├─ src/
│  ├─ pages/                # Astro 路由入口
│  ├─ templates/            # 布局、组件、样式
│  ├─ features/             # 数据、SEO、文章、分类标签等功能
│  └─ content.config.ts     # Astro Content Collection 配置
├─ .env.example             # 复制为 .env 后修改站点环境变量
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
```

## 配置规则

站点基础信息从环境变量读取：

1. 优先使用系统或部署平台提供的环境变量。
2. 本地开发时，复制 `.env.example` 为 `.env`，再修改 `.env`。
3. 如果没有配置对应变量，使用代码里的默认值。

`.env.example` 只是示例模板，程序不会直接读取它；需要复制并重命名为 `.env` 才会作为本地环境变量生效。

内容配置使用 TOML。想修改导航、分类、标签或友链时，先从 `blog/example/` 复制对应文件到 `blog/` 根目录，再修改复制出来的文件。

| 文件 | 用途 | 使用方式 |
| --- | --- | --- |
| `blog/menu.toml` | 导航菜单 | 从 `blog/example/menu.toml` 复制后修改；不存在时使用示例文件 |
| `blog/links.toml` | 友链数据 | 从 `blog/example/links.toml` 复制后修改；不存在时使用示例文件 |
| `blog/categories.toml` | 分类名称和描述 | 从 `blog/example/categories.toml` 复制后修改；只影响文章中用到的分类 |
| `blog/tags.toml` | 标签名称 | 从 `blog/example/tags.toml` 复制后修改；只影响文章中用到的标签 |

分类和标签会先从文章属性区自动收集。TOML 主要用于改显示名称和描述；文章里没有使用的分类或标签不会生成页面。

## TOML 示例

```toml
[[categories]]
slug = "website"
name = "建站"
description = "静态站、博客、域名、CDN 与 SEO 实践。"

[[tags]]
slug = "hello-world"
name = "hello-world"
```

```toml
[[menu]]
label = "首页"
href = "/"

[[menu]]
label = "示例页面"
href = "/demo-page"
```

```toml
[[links]]
group = "Blog"
name = "Example"
url = "https://example.com"
desc = "示例站点"
icon = "https://example.com/icon.png"
```

## 文章结构简版

完整规则见 `文章内容结构要求.md`。

文章使用一篇一个目录：

```text
blog/posts/
└─ hello-world/
   ├─ index.md
   └─ img/
      ├─ cover.svg
      └─ hello-world-1.svg
```

Markdown 文件开头两条 `---` 之间是属性区，用来写标题、日期、分类、封面等信息。属性区后面就是文章正文。

```md
---
title: "Hello World"
slug: "hello-world" # 当值为空或没有这个属性，默认使用文章文件夹名称
description: "文章摘要。"
date: "2026-06-09"
categories:
  - website
tags:
  - hello-world
cover: "./img/cover.svg"
top: 0
comments: false
---

这是一篇文章正文，可以写段落、列表、表格、代码块和引用。

![Hello World 示例图](./img/hello-world-1.svg)
```

封面读取顺序：

1. 属性区中的 `cover`。
2. `img/cover.*`。
3. 根目录 `cover.*`。
4. `img/{slug}-1.*`。
5. `/default-cover.svg`。

默认封面文件位于 `blog/images/default-cover.svg`，构建后使用根路径 `/default-cover.svg` 访问。

## 页面结构简版

完整规则见 `页面结构需求.md`。

自定义页面放在 `blog/pages/{slug}/index.md`，只支持一级路径。文件夹名就是 URL：

```text
blog/pages/
└─ demo-page/
   └─ index.md              # 生成 /demo-page
```

页面属性区只需要：

```md
---
title: "关于"
description: "关于这个站点和内容方向。"
comments: false
---

这里写页面正文。页面正文同样支持 Markdown。

![页面示例图](./img/demo-page-1.svg)
```

页面正文可以使用 Markdown 和相对图片，例如 `./img/example.svg`。页面不要写 `slug`、`date`、`categories`、`tags`、`cover`、`top`；这些字段只属于文章。`comments` 字段先保留，不开发评论 UI。

## 站点图片

`blog/images/` 是公开图片目录，构建后可直接使用根路径访问。

常用命名：

| 文件位置 | 使用路径 | 用途 |
| --- | --- | --- |
| `blog/images/logo.webp` | `/logo.webp` | 站点 logo |
| `blog/images/logo-dark.webp` | `/logo-dark.webp` | 深色模式 logo |
| `blog/images/user.webp` | `/user.webp` | 作者头像 |
| `blog/images/banner.webp` | `/banner.webp` | 可复用的公开图片 |

如果不放自定义图片，站点会使用 `default-logo.svg`、`default-user.svg`、`default-cover.svg` 这几个默认资源。也可以在 `.env` 中把 `BLOG_LOGO`、`BLOG_LOGO_DARK`、`BLOG_AVATAR` 设置为 `/logo.webp`、`/logo-dark.webp`、`/user.webp` 这类路径。

## 环境变量

| 变量 | 用途 |
| --- | --- |
| `BLOG_TITLE` | 站点标题 |
| `BLOG_SUBTITLE` | 站点副标题 |
| `BLOG_DESCRIPTION` | SEO 描述 |
| `BLOG_URL` | 正式站点 URL；影响 sitemap、RSS、robots |
| `BLOG_LOGO` | logo 路径；未设置时自动读取 `/logo.*`，否则使用 `/default-logo.svg` |
| `BLOG_LOGO_DARK` | 深色模式 logo 路径；未设置时自动读取 `/logo-dark.*`，否则使用 `BLOG_LOGO` |
| `BLOG_SHOW_TITLE` | 是否显示站点标题 |
| `THEME_COLOR` | 主题主色调，必须是 3 位或 6 位十六进制颜色 |
| `BLOG_AUTHOR` | 作者名称 |
| `BLOG_AVATAR` | 作者头像；未设置或文件不存在时使用 `/default-user.svg` |
| `BLOG_AVATAR_CIRCLE` | 是否将作者头像裁成圆形；未设置或空值时开启 |
| `BLOG_BIO` | 作者简介 |

## 构建和检查

1. `npm.cmd run build` 成功执行。
2. `/archives/hello-world`、`/categories/website`、`/tags/hello-world`、`/demo-page` 可生成。
3. RSS、sitemap、robots 使用正确站点 URL。
4. `/robots.txt` 由 `src/pages/robots.txt.ts` 在构建时生成。
