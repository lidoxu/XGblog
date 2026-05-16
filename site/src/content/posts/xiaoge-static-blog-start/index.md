---
title: "小鸽志静态博客改造记录：从动态站到 Astro"
slug: "xiaoge-static-blog-start"
description: "记录小鸽志迁移到 Astro 静态博客的首版结构、内容模型和部署思路。"
date: "2026-05-17"
categories:
  - website
tags:
  - astro
  - static-site
  - markdown
  - seo
cover: "/assets/default-cover.svg"
top: 10
comments: false
---

## 为什么改成静态博客

静态博客更适合长期维护的内容站：文章、图片和配置都能进入 Git 版本管理，部署结果也更容易复现。

> 首版目标不是做复杂后台，而是先把公开阅读体验、旧 URL 和 SEO 基础稳定下来。

## 内容组织方式

每篇文章独立成目录，正文使用 `index.md`，图片放在同级 `img/` 中。

```text
src/content/posts/example-slug/
├── index.md
└── img/
    └── cover.webp
```

这样迁移旧文章时，可以逐篇处理图片和 frontmatter，不需要一次性重构全部路径。

## 首版检查清单

- 保留 `/archives/{slug}` 文章地址。
- 分类和标签只在文章中保存 slug。
- 中文显示名来自 YAML 配置。
- 首页、归档页、分类页、标签页复用文章列表样式。

## 代码块验证

```bash
npm install
npm run build
npm run dev
```

## 后续方向

| 阶段 | 目标 |
| --- | --- |
| 第一阶段 | 跑通静态博客主体 |
| 第二阶段 | 导入真实文章和旧图片 |
| 第三阶段 | 检查 sitemap、RSS 和旧链接 |
