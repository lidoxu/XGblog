# 小鸽志静态博客开发说明

这是一个根目录即项目目录的 Astro 静态博客。目录按职责分成三类：用户自定义内容、页面模板、功能实现；同时保留 Astro 必须的 `src/pages` 和 `src/content.config.ts`。

## 目录结构

```text
./
├─ blog/                    # 用户自定义区
│  ├─ posts/                # 本地文章内容：index.md、cover.webp、正文图片
│  ├─ data/                 # YAML 数据配置
│  │  ├─ example/           # 可提交的 YAML 示例，复制到 data 根目录后使用
│  │  ├─ site.yaml          # 本地站点标题、描述、作者、logo fallback
│  │  ├─ menu.yaml          # 本地导航菜单
│  │  ├─ categories.yaml    # 本地分类 slug、名称、描述
│  │  ├─ tags.yaml          # 本地标签 slug、名称
│  │  └─ links.yaml         # 本地友链数据
│  ├─ site/                 # 站点公开资源：logo、默认封面、robots.txt
│  └─ low/
│     └─ upload/            # 旧站公开资源归档
├─ src/
│  ├─ pages/                # Astro 路由页面，保留框架约定
│  ├─ templates/            # 页面 HTML/UI 模板、布局、组件、样式
│  ├─ features/             # 功能实现：数据、SEO、文章排序、前端增强脚本
│  ├─ content.config.ts     # Astro Content Collection 配置
│  └─ env.d.ts
├─ scripts/                 # 本地开发辅助脚本
├─ .env.example             # 站点基础环境变量示例；实际 .env 不提交
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
```

## 用户自定义区

`blog/` 是主要改动入口。

| 路径 | 用途 | 是否默认提交内容 |
| --- | --- | --- |
| `blog/data/example/*.yaml` | 可分发的 YAML 示例配置。用户复制到 `blog/data/` 后按需修改。 | 是 |
| `blog/data/site.yaml` | 本地站点标题、描述、作者、logo fallback；缺失时读取 `example/site.yaml`。 | 否 |
| `blog/data/menu.yaml` | 本地导航菜单，导航不再从 `.env` 配置；缺失时读取 `example/menu.yaml`。 | 否 |
| `blog/data/categories.yaml` | 本地分类 slug、名称、描述；缺失时读取 `example/categories.yaml`。 | 否 |
| `blog/data/tags.yaml` | 本地标签 slug、名称；缺失时读取 `example/tags.yaml`。 | 否 |
| `blog/data/links.yaml` | 本地友链数据；缺失时读取 `example/links.yaml`。 | 否 |
| `blog/site/` | logo、默认封面、robots.txt 等公开资源。 | 是 |
| `blog/posts/` | 本地文章目录；每篇文章一个子目录，包含 `index.md`、根目录 `cover.webp/png/jpg`，正文图片放在 `img/` 下并按 `{slug}-1`、`{slug}-2` 命名。 | 只提交目录 |
| `blog/low/upload/` | 旧站公开资源归档。 | 只提交目录 |
| `.env` | 只覆盖站点基础信息。 | 否 |

`.env` 必须放在项目根目录，因为 Vite/Astro 默认从根目录读取环境变量。可参考 `.env.example`。

## 页面与模板

`src/pages/` 只负责路由入口；具体页面结构和 UI 复用放在 `src/templates/`。

```text
src/templates/
├─ layouts/                 # 页面整体布局
├─ components/              # 文章卡片、导航、侧栏、目录等组件
└─ styles/                  # 全局样式和 Markdown 样式
```

主要页面能力：

| 页面 | 路径 | 要求 |
| --- | --- | --- |
| 首页 | `/` | 最新文章、站点信息、分类入口、标签入口、主导航。 |
| 文章页 | `/archives/{slug}` | 标题、摘要、时间、分类、标签、封面、正文、目录、代码复制。 |
| 归档页 | `/archives` | 按时间分组展示文章。 |
| 分类页 | `/categories`、`/categories/{slug}` | 展示分类列表和分类文章。 |
| 标签页 | `/tags`、`/tags/{slug}` | 展示标签列表和标签文章。 |
| 关于/友链 | `/about`、`/links` | 静态信息页。 |

页面具体模块位置不固定，移动端必须保证无横向溢出。

## 功能实现

`src/features/` 放页面背后的功能代码。

```text
src/features/
├─ core/                    # 数据读取、文章排序、SEO、日期、分类标签统计
└─ scripts/                 # 浏览器端增强：代码复制、图片预览等
```

原则：

1. 页面模板不要直接读文件系统，统一通过 `features/core` 获取数据。
2. 浏览器增强脚本按页面按需引入，不做全站无关加载。
3. 除 Astro 约定目录外，不新增没有明确职责的目录。

## 文章结构

文章使用一篇一个目录，封面和正文图片都放在文章目录内：

```text
blog/posts/
└─ post-slug/
   ├─ index.md
   ├─ cover.webp        # 封面优先读取 cover.webp，兼容 cover.png、cover.jpg
   └─ img/
      ├─ post-slug-1.webp  # 根目录没有封面时，优先用 img/{slug}-1 作为封面
      └─ post-slug-2.webp
```

frontmatter 示例：

```md
---
title: "文章标题"
slug: "post-slug"
description: "文章摘要。"
date: "2026-05-28"
categories:
  - ai
tags:
  - astro
  - markdown
cover: "./cover.webp"
top: 0
comments: false
---

正文图片使用相对路径：

![图片说明](./img/post-slug-1.webp)
```

文章列表和文章页封面使用同一套规则：如果 frontmatter 写了 `cover`，按该路径读取；如果没写，依次读取文章目录根部的 `cover.webp`、`cover.png`、`cover.jpg`；如果根目录没有封面，再读取 `img/{slug}-1.webp`、`img/{slug}-1.png`、`img/{slug}-1.jpg`；都没有则使用 `/default-cover.svg`。

## 分类和标签

分类和标签 slug 会按 `trim().toLowerCase()` 统一处理。新内容建议在文章 frontmatter、`categories.yaml` 和 `tags.yaml` 中都使用小写 slug。

## 环境变量

环境变量只覆盖 `blog/data/site.yaml` 的站点基础信息。导航菜单统一编辑 `blog/data/menu.yaml`。

| 变量 | 用途 |
| --- | --- |
| `BLOG_TITLE` | 站点标题 |
| `BLOG_SUBTITLE` | 站点副标题 |
| `BLOG_DESCRIPTION` | SEO 描述 |
| `BLOG_URL` | 正式站点 URL |
| `BLOG_LOGO` | logo 路径；未设置时按 `logo.svg`、`logo.webp`、`logo.png`、`logo.jpg` 顺序读取 |
| `BLOG_AUTHOR_NAME` | 作者名称 |
| `BLOG_AUTHOR_AVATAR` | 作者头像；未设置时按 `user.svg`、`user.webp`、`user.png`、`user.jpg` 顺序读取，没有则使用站点 logo |
| `BLOG_AUTHOR_DESCRIPTION` | 作者简介 |

## 验收

1. `npm run build` 成功执行。
2. `/`、`/archives`、`/archives/{slug}`、`/categories`、`/categories/{slug}`、`/tags`、`/tags/{slug}` 可生成。
3. RSS 和 sitemap 可生成。
4. Markdown 表格、代码块、引用、图片在桌面和移动端不撑破页面。
5. 不设置 `.env` 时使用 YAML fallback 正常构建。
