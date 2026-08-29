import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";
import { footprintSlug, getFootprints, latestVisit } from "../lib/footprints";

const TAG_ALIASES: Record<string, string[]> = {
  AI: ["人工智能", "大模型", "模型", "LLM", "AIGC"],
  LLM: ["大模型", "语言模型", "AI"],
  ComfyUI: ["文生图", "工作流", "生图"],
  FastAPI: ["Python", "API", "后端"],
  OCR: ["PDF", "识别", "文档解析"],
  知识库: ["RAG", "检索增强", "Dify"],
  代码生成: ["编程助手", "代码补全", "AI编程"],
  运维: ["部署", "服务器", "本地部署"],
};

const isoDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, ".");

export async function GET(_context: APIContext) {
  const posts = await getPosts();
  const body = posts.map((p) => {
    const tags = p.entry.data.tags.slice(0, 3);
    const aliases = tags.flatMap((tag) => TAG_ALIASES[tag] ?? []);
    return {
      title: p.entry.data.title,
      url: p.route.path,
      tags,
      aliases,
      date: p.entry.data.date.toISOString().slice(0, 10).replace(/-/g, "."),
      search: [
        p.entry.data.title,
        p.entry.data.subtitle,
        p.entry.data.description,
        ...tags,
        ...aliases,
      ]
        .filter(Boolean)
        .join(" "),
    };
  });

  // 足迹：城市记录 + 行程 + 地图入口（pagefind 不索引这些页面，靠目录兜底匹配）
  const footprints = await getFootprints();
  const statusLabel = { home: "常驻地", lived: "曾居地", visited: "城市足迹" } as const;
  body.push(...footprints.map((entry) => {
    const { data } = entry;
    const tags = data.tags.slice(0, 3);
    return {
      title: `${data.city} · ${statusLabel[data.status]}`,
      url: `/footprints/${footprintSlug(entry)}/`,
      tags,
      aliases: [data.province, data.prefecture, data.title.split("｜")[1] ?? ""].filter(Boolean),
      date: isoDate(latestVisit(entry)),
      search: [
        data.city,
        data.title,
        data.province,
        data.prefecture,
        data.summary,
        ...tags,
        ...data.journeys.map((journey) => journey.name),
      ].filter(Boolean).join(" "),
    };
  }));

  const journeys = new Map<string, { name: string; date: Date; cities: string[]; provinces: string[] }>();
  footprints.forEach((entry) => {
    entry.data.journeys.forEach((journey) => {
      const record = journeys.get(journey.id) ?? { name: journey.name, date: journey.date, cities: [], provinces: [] };
      if (!record.cities.includes(entry.data.city)) record.cities.push(entry.data.city);
      if (!record.provinces.includes(entry.data.province)) record.provinces.push(entry.data.province);
      journeys.set(journey.id, record);
    });
  });
  body.push(...[...journeys.entries()]
    .filter(([, journey]) => journey.cities.length > 1)
    .sort((a, b) => b[1].date.getTime() - a[1].date.getTime())
    .map(([id, journey]) => ({
      title: `${journey.name} · 行程`,
      url: `/footprints/?journey=${id}`,
      tags: ["行程", ...journey.provinces],
      aliases: journey.cities,
      date: isoDate(journey.date),
      search: [journey.name, ...journey.cities, ...journey.provinces, "行程", "旅行"].join(" "),
    })));

  body.push({
    title: "我的足迹 · 足迹地图",
    url: "/footprints/",
    tags: ["足迹", "地图"],
    aliases: ["旅行地图", "足迹地图"],
    date: "",
    search: ["我的足迹", "足迹地图", "旅行地图", "城市足迹", "行程", "旅行"].join(" "),
  });

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
