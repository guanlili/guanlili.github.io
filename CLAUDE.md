# CLAUDE.md — guanlili.github.io

个人博客 + 作品集站点。Astro v6（静态生成），内容是 Markdown，`master` 分支即生产；`master` 一更新，GitHub Actions 的 build + deploy 自动跑。**合并 = 上线。**

## 常用命令

- `npm run dev` — 本地预览（http://localhost:4321/ ，页面 URL 结尾带斜杠）
- `npm run build` — 构建 + pagefind 搜索索引
- `npm run verify` — 内容检查 + astro check + build + dist 检查（提 PR 前跑一遍最稳）

## Git 工作流（重要）

**每个改动一个分支，从 `master` 拉，PR 回 `master`，合完删分支。** 不要再开长期工作分支。

```
git checkout master && git pull
git checkout -b <type>/<描述>
# 改东西，npm run verify 过一遍
git push -u origin <branch>
gh pr create --base master --title "..." --body "..."
# build check 过了再合
gh pr merge <N> --merge          # 用 merge commit，和仓库历史一致
git checkout master && git pull && git branch -d <branch>
```

分支命名：

| 改动 | 命名 |
|---|---|
| 新文章 | `post/<slug>` |
| 新/改作品 | `portfolio/<slug>` |
| 修 bug | `fix/<东西>` |
| 文案/小调整 | `tweak/<东西>` |
| 功能/重构 | `feat\|refactor/<东西>` |

要点：
- 一个 PR = 一个可发布的改动。别把多个无关改动塞进同一个 PR——合并即上线，会顺便把没准备好的东西也发出去。
- 一两个字的笔误可以破例直接在 `master` 改；除此之外都走分支 + PR。
- commit message 用中文 conventional 风格：`feat(blog): …` / `fix(review): …` / `chore: …`。
- 合并用 `--merge`（标准 merge commit），保持和 #2–#9 一致的历史风格。

## 内容规范

**博客** — `src/content/blog/<分类>/YYYY-MM-DD-<slug>.md`
- 文件名日期前缀决定 URL：`/:year/:month/:day/:slug/`（月日零填充，结尾斜杠）
- frontmatter：`title` / `date` / `subtitle` / `description` / `cover` / `header-mask` / `tags` / `draft`
- 草稿设 `draft: true`，不会进路由、订阅、搜索、相关文章
- schema 见 `src/content.config.ts`（旧字段如 `layout` 会被忽略）

**作品集** — `src/content/portfolio/<slug>.md`
- frontmatter：`title` / `date` / `summary` / `type` / `role` / `status` / `tags` / `cover` / `impact` / `featured` / `links{github,demo,article}`
- `featured: true` 进首页精选位，控制在 2–3 个，别开太多
- `links.article` 指向站内博客时要带结尾斜杠，如 `/2026/08/11/<slug>/`

图片统一走腾讯云 COS（`blog-1258476669.cos.ap-beijing.myqcloud.com`），URL 末尾加 `?imageSlim` 做瘦身。图片 markdown 记得写有意义的 alt 文本（RSS / 无障碍 / 图裂时都需要）。

## 不要做

- 不要在 `master` 上直接做大改动（走分支 + PR）。
- 不要追踪 `.obsidian/`（已从仓库移除；Obsidian 的 workspace 等状态文件不进 git，否则会反复挡住 pull）。
- 不要开新的长期工作分支——迁移已完成，`master` 就是唯一的长期分支。
