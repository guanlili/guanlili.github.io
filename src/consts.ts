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
  epigraph:
    "When you look up at the stars, don't forget to look down at the dust.",
  beian: "京ICP备2022033467号-2",
  themeColor: "#000000",
  perPage: 10,
};

// Sidebar /About 卡片下方 4 个快捷链接(社交三连 + 联系订阅锚点)
export const SIDEBAR_LINKS: { badge: string; title: string; href: string }[] = [
  { badge: "GH", title: "GitHub", href: "https://github.com/guanlili" },
  { badge: "知", title: "知乎", href: "https://www.zhihu.com/people/xiao-li-ge-ge-38" },
  { badge: "CS", title: "CSDN", href: "https://blog.csdn.net/outman_1921" },
  { badge: "@", title: "联系 / 订阅", href: "/about/#follow" },
];

export const NAV: { label: string; href: string; key: string }[] = [
  { label: "首页 Home", href: "/", key: "home" },
  { label: "作品 Portfolio", href: "/portfolio/", key: "portfolio" },
  { label: "足迹 Map", href: "/footprints/", key: "footprints" },
  { label: "工具 Tools", href: "/tools/", key: "tools" },
  { label: "技能 Skills", href: "/skills/", key: "skills" },
  { label: "归档 Archive", href: "/archive/", key: "archive" },
  { label: "标签 Tags", href: "/tags/", key: "tags" },
  { label: "关于 About", href: "/about/", key: "about" },
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
export const NOW: { ico: string; text: string }[] = [
  { ico: "读", text: "《人月神话》重读" },
  { ico: "写", text: "AI 工作室运营笔记" },
  { ico: "折腾", text: "本地大模型 + 知识库" },
  { ico: "城市", text: "北京" },
];

export const GISCUS = {
  enabled: false, // editorial post page omits comments; flip to re-enable
  repo: "guanlili/guanlili.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkzMzUxNjQ2OTk=",
  category: "Announcements",
  categoryId: "DIC_kwDOE_o1G84CQByl",
};

// Analytics (empty = disabled), mirroring the old config.
export const GA_TRACK_ID = "";
export const BAIDU_TRACK_ID = "";
