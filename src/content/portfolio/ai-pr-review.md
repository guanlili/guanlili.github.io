---
title: ai-pr-review · 让 4 个 AI 替我审 PR
date: 2026-08-11
summary: 一个开源 GitHub Action：3 个模型并行评审 PR + 1 个 Judge 融合去重，PR 一提交自动出报告，全走火山方舟一个 Key。
type: Open Source
role: Creator / Maintainer
status: Live · Running
tags:
  - AI
  - GitHub Actions
  - Code Review
  - LLM
  - 火山方舟
  - AI Coding
  - Open Source
cover: https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/ai-code-review-pipeline-editorial-zh.png?imageSlim
impact: 解决 AI Coding 时代的新瓶颈——代码生成飞快、人工审查跟不上。3 个模型独立评审 + 1 个 Judge 融合去重，把单模型幻觉过滤掉约 30–40%，PR 一提交自动出评审报告。
featured: true
links:
  github: https://github.com/guanlili/ai-pr-review
  article: /2026/08/11/multi-llm-pr-review-github-action/
---

## 它解决什么问题

用 AI 写代码之后，一天开十几个 PR 成了常态，但我自己审不过来——复制链接给 AI 审、贴评论、再让 Coding Agent 改，光是搬运就累够呛。**代码生成的速度上去了，审查的速度没跟上，瓶颈变成了我自己。**

## 怎么工作的

不是让一个 AI 审三遍，而是请"四个同事"：

- **3 个 Reviewer**（豆包 / DeepSeek / GLM，三家不同厂商）各自独立看一遍，互相看不到对方结论——同源偏见被错开
- **1 个 Judge**（豆包 Seed-Evolving）把三份意见去重、排优先级、过滤幻觉，合成一份报告贴回 PR

多个模型同时提到同一个问题 = 高置信度；只有一家提到 = 大概率是那家的幻觉，降级或丢弃。四个模型全走火山方舟的 OpenAI-compat 接口，一个 `ARK_API_KEY` 搞定。

## 我负责什么

- 整体架构：reviewer 并发评审 → judge 融合的流水线
- 融合规则："多数原则 + 安全一票否决"——共识过滤噪音，关键词兜底安全
- 把仓库根目录的 `AGENTS.md` 自动注入每个 reviewer 的 system prompt，让评审从"通用检查"变成"懂这个项目"
- 打包成开箱即用的 GitHub Action，目标仓库一行 `uses:` + 一个 secret 即可接入

## 技术取舍

1. **三家厂商而非三次同款**：利用不同 vendor 错误分布的独立性，才能同时降误报和漏报。
2. **Judge 选 Seed-Evolving**：长上下文 + 长程推理稳，且 Model ID 恒定、自动指向最新基座——零迁移成本，一直吃版本红利。
3. **只审不改**：Action 负责审查和评论，不直接动代码；修改交给各自的 Coding Agent，职责干净。

## 现在的状态

已开源（MIT），正在我的多个项目仓库上稳定跑着。任意项目约 30 秒可装上。
