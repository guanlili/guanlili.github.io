// Site-wide constants (migrated from Jekyll _config.yml).

export const SITE = {
  title: "lili Blog",
  seoTitle: "李梨的博客 | lili Blog ｜技术学习",
  url: "https://guanlili.github.io",
  description:
    "关于程序与设计、测试与开发 | 李梨，Web & Mobile Lover，Software Engineer，UX Designer | 这里是 @outman李梨 的个人博客，与你一起发现更大的世界。",
  keywords:
    "李梨, outman李梨, outman, outmanpro, @outmanpro, 李梨的博客, outman Blog, 博客, 个人网站, 互联网, Web, JavaScript, 前端, 设计",
  author: "李梨",
  avatar: "/img/avatar-ghl-ny.jpg",
  aboutDescription:
    "李梨，热爱技术&测试，简单乐观爱创造。<br> When you look up at the stars, don't forget to look down at the dust.",
  beian: "京ICP备2022033467号-2",
  themeColor: "#000000",
  perPage: 10,
};

export const NAV: { label: string; href: string; key: string }[] = [
  { label: "首页 Home", href: "/", key: "home" },
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
