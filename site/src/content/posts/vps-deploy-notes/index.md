---
title: "VPS 部署静态站的基础笔记"
slug: "vps-deploy-notes"
description: "一篇用于占位和验证样式的 VPS 部署笔记，覆盖 Nginx、缓存和静态文件发布流程。"
date: "2026-05-16"
categories:
  - vps-tutorial
  - linux
tags:
  - vps
  - linux
  - nginx
  - deploy
cover: "/assets/default-cover.svg"
top: 0
comments: false
---

## 部署目标

静态站部署到 VPS 时，核心目标是让文件可重复发布，并让 Nginx 只负责稳定地提供静态资源。

## 推荐目录

```text
/var/www/xiaoge.org/
├── current/
└── releases/
```

`current` 可以指向最近一次构建产物，回滚时只需要切换软链接。

## Nginx 片段

```nginx
server {
  listen 80;
  server_name www.xiaoge.org;
  root /var/www/xiaoge.org/current;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

## 发布流程

1. 本地或 CI 执行构建。
2. 上传 `dist` 目录。
3. 切换 `current` 指向新版本。
4. 抽样检查首页、文章页和旧图片路径。

## 注意事项

- 不要随意改变旧文章 URL。
- 旧图路径应先保留，再逐步整理。
- 构建失败时不要覆盖当前线上版本。
