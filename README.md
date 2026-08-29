# lili Blog

> 离开世界之前，一切都是过程。

[李梨的个人博客](https://guanlili.github.io) 是一个用 Astro 重建的中文个人博客。这里主要记录 AI 工程、系统架构、测试开发、工具折腾和一些生活随笔。

这个版本在 2026 年从 Jekyll 迁移到 Astro，保留旧站文章 URL 规则，同时重做了页面结构、站内搜索、RSS、站点地图、PWA 缓存和编辑式中文排版。

## 特性

- Astro 静态站点，部署到 GitHub Pages
- 兼容旧 Jekyll permalink：`/:year/:month/:day/:title/`
- Markdown 内容集合，文章集中放在 `src/content/blog/`
- Pagefind 站内搜索，构建后自动生成索引
- RSS 与 sitemap 自动生成
- 浅色 / 深色主题切换
- 文章目录、阅读进度、代码复制、图片灯箱、Mermaid 懒加载
- 图片尺寸探测与缓存，减少文章页布局偏移
- Service Worker 提供静态资源缓存和基础离线兜底

## 技术栈

- [Astro](https://astro.build)
- TypeScript
- Less
- Pagefind
- `@astrojs/rss`
- `@astrojs/sitemap`

## 本地开发

需要 Node 22.12+。

```sh
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:4321`。

常用命令：

```sh
npm run check    # Astro 类型与内容检查
npm run build    # 构建 dist/，并生成 Pagefind 索引
npm run check:content # 检查文章路径、日期、重复链接和不可发布的本地图片引用
npm run check:links # 检查 Markdown 中的本地链接；远程探测用 check:links:remote
npm run check:dist # 检查关键构建产物是否存在
npm run images:report # 汇总文章图片、尺寸缓存和失败探测
npm run profile:build # 分段统计内容检查、Astro 构建、Pagefind 等耗时
npm run preview  # 预览构建产物
npm run verify   # check:content + check + build + check:dist
```

## 目录结构

```text
src/
  pages/
    index.astro       # 首页
    [...slug].astro   # 文章详情页
    archive.astro     # 归档页
    tags.astro        # 标签页
    about.astro       # 关于页
    offline.astro     # 离线兜底页
    feed.xml.ts       # RSS
    404.astro
  content/
    blog/**/*.md      # 博客文章
    about.md          # 关于页正文
  components/         # 导航、页脚、文章列表、侧栏等组件
  layouts/
    BaseLayout.astro  # 全站基础布局、SEO、搜索壳层
  lib/
    posts.ts          # 文章加载、摘要、首图等工具
    permalink.ts      # 复刻 Jekyll URL 规则
    media.ts          # 图片 URL 处理
    image-cache.mjs   # 构建期图片尺寸缓存
  styles/
    site.less         # 全局样式入口
    editorial-pages.less # 全站共享 chrome + 首页/列表样式
    pages/            # 按路由懒加载的页面样式（tools/about/portfolio/archive/tags）
    less/             # 变量、基础样式、文章页、搜索等
  consts.ts           # 站点信息、导航、友链、平台配置

scripts/
  check-dist.mjs      # CI / 本地构建产物健康检查

public/
  img/                # 静态图片
  js/                 # 前端增强脚本
  pwa/                # Manifest 与 PWA 图标
  robots.txt
  sw.js               # Service Worker
```

## 写文章

在 `src/content/blog/` 下按分类目录新建 Markdown 文件，文件名必须以日期开头：

```text
src/content/blog/AI/2026-05-13-文章标题.md
```

推荐 frontmatter：

```yaml
---
title: "文章标题"
date: 2026-05-13
subtitle: "副标题，可选"
description: "用于 SEO、RSS 和文章摘要的描述，可选"
author: "lili"
tags: [AI, 架构]
cover: "/img/example.jpg"
draft: false # 写作中可设为 true；草稿和未来日期文章不会发布
---
```

URL 会按文件名自动生成，例如：

```text
/2026/05/13/文章标题/
```

注意事项：

- 文件名需要保持 `YYYY-MM-DD-标题.md` 或 `YYYY-M-D-标题.md` 格式。
- `title` 和 `date` 是必填字段。
- `tags` 可以写成数组，也可以写成单个字符串。
- `draft: true` 的文章不会出现在页面、RSS 或站内搜索；未来日期文章会在日期到达后自动发布。
- 如果 frontmatter 里文本包含英文双引号，外层建议使用单引号。
- 本地图片应放在 `public/img/` 下，并用 `/img/...` 引用。

## 搜索

站内搜索使用 Pagefind。执行 `npm run build` 后会在 `dist/pagefind/` 生成索引文件。

搜索入口由 `public/js/site.js` 懒加载 `public/js/site-search.js`，首次点击搜索按钮、按下 `Cmd/Ctrl + K` 或 `/` 时才加载搜索模块。

搜索结果会融合 Pagefind 正文索引和 `search-catalog.json` 的文章元数据，标题、标签、别名和正文命中会使用不同权重排序。

## 构建健康检查

`npm run verify` 会依次执行类型检查、站点构建、Pagefind 索引生成和 `dist/` 产物检查。`scripts/check-dist.mjs` 会确认首页、RSS、sitemap、离线页、Pagefind、PWA manifest 和 Service Worker 等关键文件存在且非空。

`npm run check:links` 默认检查本地资源路径，并统计远程 URL。需要真实探测外链状态时运行 `npm run check:links:remote`。

## 图片与内容维护

构建时会通过 `src/lib/astro-image-cache.mjs` 探测图片尺寸，并把结果写入 `.image-dimensions.json`。这个文件用于稳定文章图片布局。

`npm run images:report` 可以查看本地缺失图片、远程图片尺寸缓存、最近探测失败和未探测图片；需要生成临时 Markdown 报告时运行 `npm run images:report:write`。历史欠账图基本都已改挂远程图床，剩余失效外链以该报告为准。

## 部署

推送到 `master` 后，GitHub Actions 会运行：

```sh
npm ci
npm run verify
```

构建产物 `dist/` 会通过 `.github/workflows/deploy.yml` 发布到 GitHub Pages。部署前会执行 `npm run verify`，确保构建和关键产物检查都通过。

仓库需要在 GitHub 的 Settings -> Pages 中选择 GitHub Actions 作为部署来源。

## 许可证

代码使用 Apache License 2.0。文章内容、图片素材与站点设计版权归李梨所有。

本项目最初衍生自 [Hux Blog](https://github.com/Huxpro/huxpro.github.io)，现在已迁移并重写为 Astro 静态站点。
