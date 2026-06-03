import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";

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

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
