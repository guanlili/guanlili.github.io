// Site-wide constants (migrated from Jekyll _config.yml).

export const SITE = {
  title: "lili Blog",
  seoTitle: "李梨的博客 | lili Blog ｜技术学习",
  url: "https://guanlili.github.io",
  description:
    "关于程序与设计、测试与开发 | 李梨，Web & Mobile Lover，Software Engineer，UX Designer | 这里是 @outman李梨 的个人博客，与你一起发现更大的世界。",
  keywords:
    "李梨, 李梨的博客, 李梨Blog, 博客, 个人网站, 互联网, Web, JavaScript, 前端, 设计",
  author: "李梨",
  handle: "outman",
  brand: "梨园",
  latinBrand: "lili.blog",
  wechatName: "李梨同学",
  redbookId: "2920300268",
  email: "lovelose1921@vip.qq.com",
  since: 2019,
  locale: "zh-CN",
  avatar: "/img/avatar-ghl-ny.jpg",
  role: "SOFTWARE ENG · UX",
  bio: "热爱技术与生活，简单乐观，爱创造。Web & Mobile Lover，业余写代码、做菜、看星星。",
  bioEn:
    "In love with tech and life — simple, optimistic, always building. Web & Mobile lover; codes, cooks and stargazes in spare time.",
  epigraph:
    "When you look up at the stars, don't forget to look down at the dust.",
  epigraphZh: "仰望星空，俯首尘埃。",
  beian: "京ICP备2022033467号-2",
  // Must stay in sync with the runtime values site.js sets (light bg / dark bg)
  // and manifest theme_color — browsers see the static value pre-JS.
  themeColor: "#f1ede3",
};

// Sidebar /About 卡片下方 4 个快捷链接(社交三连 + 联系订阅锚点)
export const SIDEBAR_LINKS: { badge: string; title: string; titleEn?: string; href: string }[] = [
  { badge: "GH", title: "GitHub", href: "https://github.com/guanlili" },
  { badge: "知", title: "知乎", titleEn: "Zhihu", href: "https://www.zhihu.com/people/xiao-li-ge-ge-38" },
  { badge: "CS", title: "CSDN", href: "https://blog.csdn.net/outman_1921" },
  { badge: "@", title: "联系 / 订阅", titleEn: "Contact / Subscribe", href: "/about/#follow" },
];

export const NAV: { label: { zh: string; en: string }; href: string; key: string }[] = [
  { label: { zh: "首页", en: "Home" }, href: "/", key: "home" },
  { label: { zh: "作品", en: "Portfolio" }, href: "/portfolio/", key: "portfolio" },
  { label: { zh: "足迹", en: "Map" }, href: "/footprints/", key: "footprints" },
  { label: { zh: "工具", en: "Tools" }, href: "/tools/", key: "tools" },
  { label: { zh: "技能", en: "Skills" }, href: "/skills/", key: "skills" },
  { label: { zh: "归档", en: "Archive" }, href: "/archive/", key: "archive" },
  { label: { zh: "标签", en: "Tags" }, href: "/tags/", key: "tags" },
  { label: { zh: "关于", en: "About" }, href: "/about/", key: "about" },
];

export const FRIENDS: { title: string; href: string }[] = [
  { title: "cnblog", href: "https://www.cnblogs.com/guanlili/" },
  { title: "lili Blog", href: "https://guanlili1921.gitee.io/" },
  { title: "CSDN", href: "https://blog.csdn.net/outman_1921" },
  { title: "jianshu", href: "https://www.jianshu.com/u/22690f0de297" },
  { title: "OSchina", href: "https://my.oschina.net/u/3551659" },
];

// "同步分发 · Also Posted To" — secondary platforms (real links only).
export const SECONDARY_PLATFORMS: {
  badge: string;
  name: string;
  en: string;
  handle: string;
  href: string;
}[] = [
  { badge: "知", name: "知乎", en: "Zhihu", handle: "@ 小李哥哥", href: "https://www.zhihu.com/people/xiao-li-ge-ge-38" },
  { badge: "CS", name: "CSDN", en: "csdn.net", handle: "@ outman_1921", href: "https://blog.csdn.net/outman_1921" },
  { badge: "G", name: "GitHub", en: "github.com", handle: "@ guanlili", href: "https://github.com/guanlili" },
  { badge: "园", name: "博客园", en: "cnblogs.com", handle: "@ guanlili", href: "https://www.cnblogs.com/guanlili/" },
  { badge: "简", name: "简书 / Gitee", en: "镜像备份", handle: "@ guanlili1921", href: "https://guanlili1921.gitee.io/" },
  { badge: "OS", name: "OSChina", en: "oschina.net", handle: "@ outman", href: "https://my.oschina.net/u/3551659" },
];

// Sidebar "/Now" card — PLACEHOLDER content, edit freely.
export const NOW: { ico: string; icoEn: string; text: string; textEn: string }[] = [
  { ico: "读", icoEn: "Read", text: "《人月神话》重读", textEn: "Re-reading The Mythical Man-Month" },
  { ico: "写", icoEn: "Write", text: "AI 工作室运营笔记", textEn: "AI studio operations notes" },
  { ico: "折腾", icoEn: "Build", text: "本地大模型 + 知识库", textEn: "Local LLMs + knowledge base" },
  { ico: "城市", icoEn: "City", text: "北京", textEn: "Beijing" },
];

// Analytics (empty = disabled), mirroring the old config.
export const GA_TRACK_ID = "";
export const BAIDU_TRACK_ID = "";

// giscus 评论（基于 GitHub Discussions）。四项填齐后文章页自动开启评论区：
// 1. 仓库 Settings → 开启 Discussions；2. 安装 giscus GitHub App；
// 3. 建一个 announcement 类型的分类；4. 到 https://giscus.app 生成配置取 repoId/categoryId。
export const GISCUS = {
  repo: "", // 如 "guanlili/guanlili.github.io"
  repoId: "",
  category: "Announcements",
  categoryId: "",
};
