---
title: "毒奶观察室 · AI 电竞赛事搭子"
date: 2026-05-31
summary: "2026 清华黑客松项目：一个赛博风格的电竞 AI 陪看应用，覆盖赛前期待、赛中共振、赛后图文表达。"
type: "Hackathon"
role: "Product / Full-stack / AI Engineer"
status: "Hackathon Demo"
tags: ["React", "TanStack Start", "LLM", "ASR", "AIGC", "Hackathon"]
cover: "/img/portfolio/watch-buddy-logo.png"
impact: "在 10 小时黑客松窗口内跑通从用户画像、赛中情绪陪伴到赛后文案海报生成的完整观赛闭环，获得评委一致好评。"
featured: true
links:
  github: "https://github.com/guanlili/watch_buddy"
  demo: "https://www.bilibili.com/video/BV1btVZ6jEow/"
  article: "/2026/06/03/10小时黑客松-我做了个2am也在线的电竞搭子/"
---

## 项目背景

电竞观赛不缺信息，缺的是一个能在具体时刻接住你情绪的人。弹幕和社区是公共广场，但它们不认识你、不站在你的阵营，也不会把你赛中的破防、狂喜和 flag 变成赛后可分享的内容。

毒奶观察室把观赛链路拆成三段：赛前点燃期待，赛中实时共振，赛后生成图文。它不是通用聊天机器人，而是一个垂直电竞场景的 AI 搭子。

## 我负责什么

- 梳理黑客松产品定位和完整用户链路。
- 搭建 React + TanStack Start 的多阶段 demo。
- 设计用户画像、比赛时间线、情绪日志、flag 和赛后回顾的数据流。
- 接入 LLM 对话、StepFun ASR 和 AIGC 海报生成能力。
- 将 prompt 集中管理，并提供隐藏管理端支持现场调试。

## 核心难点

10 小时窗口里，最难的不是把技术栈堆满，而是做取舍。真实赛事 API、数据库、WebSocket 都可以做，但不一定服务于现场 demo 的主线。

最终方案把大部分体验逻辑放在客户端，用 mock timeline 保证比赛稳定演出，用 localStorage 承担 MVP 数据持久化，用服务端函数隔离 API Key 和模型调用，优先让“赛前 - 赛中 - 赛后”的情绪闭环跑起来。

## 结果与复盘

项目完成了欢迎页、兴趣收集、赛前阵地、赛中陪伴、赛后图文、prompt 管理端等核心模块。它验证了一个判断：AI 陪伴产品的关键不是“回答正确”，而是“情绪位置正确”。

下一步如果继续做，重点会放在实时语音陪伴、长期情绪记忆、多人共看房间和更稳定的赛事数据接入。
