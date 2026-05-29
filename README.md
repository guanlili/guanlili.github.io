# lili Blog

> 离开世界之前，一切都是过程。

[李梨 (outman) 的个人博客](https://guanlili.github.io) —— 一个写 AI、聊架构、记录踩坑日常的小角落。
「中文编辑刊物 × 开发者博客」的编辑式设计：纸张感配色、朱砂红点缀、思源宋体标题 + JetBrains Mono 元数据，支持浅色 / 深色。

Built with **[Astro](https://astro.build)**. （2026 年从 Jekyll 迁移而来。）

## 本地开发

需要 Node 18.20+ / 20.3+ / 22+。

```sh
npm install      # 安装依赖
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

## 目录结构

```
src/
  pages/              # 路由
    index.astro         # 首页（刊头 + 头条 + 文章列表 + 侧栏）
    [...slug].astro     # 文章详情，URL = /:year/:month/:day/:title/
    archive.astro       # 归档（按年 + 干支）
    tags.astro          # 标签
    about.astro         # 关于 + Follow
    404.astro
    feed.xml.ts         # RSS
    search.json.ts      # 站内搜索索引
  content/
    blog/**/*.md        # 文章（从 Jekyll _posts 迁移，原文未改）
    about.md            # 关于页正文
  components/           # Nav / Footer / Icons / PostList / Feature / Sidebar
  layouts/BaseLayout.astro
  lib/                  # permalink（复刻 Jekyll slugify）/ posts
  styles/
    site.less           # 全局样式入口
    editorial-pages.less # 列表页编辑式样式
    less/               # 设计系统（tokens、排版、文章页样式等）
  consts.ts             # 站点信息、导航、友链、平台等
public/                 # 原样输出的静态资源（img / js / pwa / robots.txt）
```

## 写文章

在 `src/content/blog/` 下新建 `YYYY-MM-DD-标题.md`（日期前缀必须，沿用 Jekyll 习惯）：

```yaml
---
title: "文章标题"
date: 2026-05-13
subtitle: "副标题（可选）"
tags: [AI, 架构]
---
正文（GFM Markdown）…
```

URL 会自动生成为 `/2026/05/13/标题/`，与旧 Jekyll 站一致。

## 部署

推送到 `master` 后，GitHub Actions（`.github/workflows/deploy.yml`）用 Astro 构建并发布到 GitHub Pages。
需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## License

Code: Apache License 2.0. 设计与文章内容版权归 李梨 所有。
本主题最初衍生自 [Hux Blog](https://github.com/Huxpro/huxpro.github.io)（Apache 2.0），现已重写为 Astro。
