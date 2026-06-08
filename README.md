# 小鸽志静态博客开发说明

这是一个根目录即项目目录的 Astro 静态博客。目录按职责分成三类：用户自定义内容、页面模板、功能实现；同时保留 Astro 必须的 `src/pages` 和 `src/content.config.ts`。

## 目录结构

```text
./
├─ blog/                    # 用户自定义区
│  ├─ posts/                # 本地文章内容：index.md、img/cover.*、正文图片
│  ├─ data/                 # YAML 数据配置
│  │  ├─ example/           # 可提交的 YAML 示例，复制到 data 根目录后使用
│  │  ├─ site.yaml          # 本地站点标题、描述、作者、logo fallback
│  │  ├─ menu.yaml          # 本地导航菜单
│  │  ├─ categories.yaml    # 本地分类 slug、名称、描述
│  │  ├─ tags.yaml          # 本地标签 slug、名称
│  │  └─ links.yaml         # 本地友链数据
│  └─ site/                 # 公开资源：logo、默认封面、头像、可选 upload/
├─ src/
│  ├─ pages/                # Astro 路由页面，保留框架约定
│  ├─ templates/            # 页面 HTML/UI 模板、布局、组件、样式
│  ├─ features/             # 功能实现：数据、SEO、文章排序、前端增强脚本
│  ├─ content.config.ts     # Astro Content Collection 配置
│  └─ env.d.ts
├─ scripts/                 # 本地开发辅助脚本
├─ 文章内容结构要求.md        # 文章迁移和图片命名要求
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
| `blog/data/site.yaml` | 本地站点标题、描述、作者、logo fallback；缺失字段从 `example/site.yaml` 补齐。 | 否 |
| `blog/data/menu.yaml` | 本地导航菜单；文件存在时整体替换示例菜单。 | 否 |
| `blog/data/categories.yaml` | 本地分类 slug、名称、描述；文件存在时整体替换示例分类。 | 否 |
| `blog/data/tags.yaml` | 本地标签 slug、名称；文件存在时整体替换示例标签。 | 否 |
| `blog/data/links.yaml` | 本地友链数据；文件存在时整体替换示例友链。 | 否 |
| `blog/site/` | logo、默认封面、头像等公开资源，会复制到构建产物根路径。 | 是 |
| `blog/site/upload/` | 可选旧站公开资源目录，用于维持 `/upload/...` 旧链接；内容默认不进 Git。 | 否 |
| `blog/posts/` | 本地文章目录；每篇文章一个子目录，包含 `index.md` 和 `img/` 图片。 | 只提交目录 |
| `.env` | 覆盖站点基础信息、作者信息和主题主色调。 | 否 |

## 配置优先级

配置读取顺序如下：

```mermaid
flowchart LR
  A["系统/部署环境变量 process.env"] --> B["根目录 .env"]
  B --> C["blog/data/*.yaml"]
  C --> D["blog/data/example/*.yaml"]
  D --> E["代码默认值"]
```

说明：

1. `.env` 必须放在项目根目录，因为 Vite/Astro 默认从根目录读取。
2. `.env` 只覆盖站点基础信息、作者信息和主题主色调，不配置导航、分类、标签、友链。
3. `site.yaml` 是对象级 fallback：用户文件缺少的字段从示例模板补齐。
4. `menu.yaml`、`categories.yaml`、`tags.yaml`、`links.yaml` 不合并数组；用户文件存在就整体替换示例文件。
5. `BLOG_URL` 会影响 Astro `site`、RSS、sitemap 和动态生成的 `/robots.txt`。

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

文章使用一篇一个目录，封面和正文图片都放在文章目录的 `img/` 内：

```text
blog/posts/
└─ post-slug/
   ├─ index.md
   └─ img/
      ├─ cover.*             # 可选专用封面，优先级：svg > avif > webp > png > jpg > jpeg
      ├─ post-slug-1.*       # 没有专用封面时，第一张正文图可作为封面 fallback
      └─ post-slug-2.*
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
cover: "./img/cover.webp"
top: 0
comments: false
---

正文图片使用相对路径：

![图片说明](./img/post-slug-1.webp)
```

封面读取顺序：

1. frontmatter 中的 `cover`。
2. `img/cover.*`（优先级：`svg > avif > webp > png > jpg > jpeg`）。
3. 兼容旧结构的根目录 `cover.*`（优先级：`svg > avif > webp > png > jpg > jpeg`）。
4. `img/{slug}-1.*`（优先级：`svg > avif > webp > png > jpg > jpeg`）。
5. `/default-cover.svg`。

如果一篇文章没有专用封面，可以不写 `cover`，让程序自动使用第一张正文图。

## 分类和标签

分类和标签 slug 会按 `trim().toLowerCase()` 统一处理。新内容建议在文章 frontmatter、`categories.yaml` 和 `tags.yaml` 中都使用小写 slug。

## 环境变量

| 变量 | YAML 字段 | 用途 |
| --- | --- | --- |
| `BLOG_TITLE` | `title` | 站点标题 |
| `BLOG_SUBTITLE` | `subtitle` | 站点副标题 |
| `BLOG_DESCRIPTION` | `description` | SEO 描述 |
| `BLOG_URL` | `url` | 正式站点 URL；影响 sitemap、RSS、robots |
| `BLOG_LOGO` | `logo` | logo 路径；未设置时自动读取 `/logo.*`（优先级：`svg > avif > webp > png > jpg > jpeg`），都没有则使用 `/default-logo.svg` |
| `THEME_COLOR` | `theme.color` | 主题主色调，必须是 3 位或 6 位十六进制颜色 |
| `BLOG_AUTHOR` | `author.name` | 作者名称 |
| `BLOG_AVATAR` | `author.avatar` | 作者头像；未设置时自动读取 `/user.*`（优先级：`svg > avif > webp > png > jpg > jpeg`），支持 `svg`、`avif`、`webp`、`png`、`jpg`、`jpeg` 等格式，如果也没有则回退到站点 logo |
| `BLOG_BIO` | `author.description` | 作者简介 |

## 发布说明

1. `blog/posts/**`、`blog/data/*.yaml`、`.env` 是本地内容，默认不提交。
2. `blog/site/upload/` 可按需放旧站资源，构建后通过 `/upload/...` 访问；内容默认不提交。
3. `output/`、`.playwright-cli/`、`dist/`、`.astro/` 是运行或构建产物，不提交。
4. `blog/site/robots.txt` 不再维护；`/robots.txt` 由 `src/pages/robots.txt.ts` 在构建时生成。

## 验收

1. `npm.cmd run build` 成功执行。
2. `/`、`/archives`、`/archives/{slug}`、`/categories`、`/categories/{slug}`、`/tags`、`/tags/{slug}` 可生成。
3. RSS、sitemap、robots 可生成，并使用正确站点 URL。
4. Markdown 表格、代码块、引用、图片在桌面和移动端不撑破页面。
5. 不设置 `.env` 时使用 YAML fallback 正常构建。
