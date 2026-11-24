---
title: Hydrogen、Carbon、Neon 都是些啥玩意？Gemini 4 元素周期表选型与省钱指南
date: 2026-11-23T00:00:00+08:00
author: lili
description: 借着 Gemini 4 Neon 刚发布，一次讲清 Google 这套「元素周期表」模型到底怎么区分、网传的 Oxygen 和 Krypton 是怎么回事，以及普通人和开发者怎么选模型、怎么省钱。
tags:
- Gemini
- AI模型
cover: https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/gemini-4-guide-cover-da9dc098f6.jpg?imageSlim
draft: false
---

这堆化学元素要按活儿的轻重排座次。选对了，省钱又省心。

打开最新的 Gemini 模型下拉框，你大概率会怀疑自己进错了高三化学考场。

**Neon、Carbon、Hydrogen**，API 文档里还躺着一个 **Argon**，甚至连小红书和 X 上都在传什么 **Oxygen、Krypton**。

一整排化学元素，没一个说人话。

谢谢 Google DeepMind，让我毕业这么多年又把元素周期表前二十号复习了一遍。而且这波发布节奏快得离谱。从 2026 年 10 月 13 日 **Argon** 公开上线，到 11 月 10 日上线 **Carbon**、11 月 12 日放出 **Hydrogen**，再到 11 月 18 日掏出 **Neon**，五周多连上四款元素模型。名字一个比一个硬核，普通用户却越看越懵。这几个元素到底谁大谁小，我点哪个？ [Google API 模型发布时间](https://aistudio.google.com/docs/deprecations#gemini-4-models)

**先说结论，选模型就是派活儿。** 把它想象成你手底下一支分工明确的工程队，有人跑腿快、有人是全能主力、有人专啃硬骨头。

# 01、先破除两个误会

**第一个坑是按原子序数排大小。** 学过初中化学的同学很容易脑补，氢（1 号）< 碳（6 号）< 氖（10 号）< 氩（18 号），所以 Argon 肯定最强！偏偏 6 号元素 Carbon 才是 Google 留给重型任务的那位。

**第二个坑是按发布时间排强弱。** 看着 Argon → Carbon → Hydrogen → Neon 的顺序，很容易以为新型号会把旧的都替掉。看实际分工，Neon 最晚上线，主打复杂任务里的速度和效率。Carbon 还是更适合那些需要长时间反复推演的活儿。让重型专家去回你「帮我改个错别字」，又慢又费额度。让轻量跑腿去重构十万行代码，它又容易顾头不顾尾。

**杀鸡别用牛刀，砍树也别拿水果刀。** 活儿多重，就派对应性格的元素上场。

# 02、元素背后的「性格说明书」

把四个元素的化学气质和模型定位放在一起，记起来就容易多了。顺便一提，这四款模型的 API 都有约 **100 万 token 的上下文窗口**。

## Hydrogen（氢 · 1 号元素），轻快敏捷的日常跑腿

2026 年 11 月 12 日公开上线，API ID 是 `gemini-4-hydrogen`。

氢是宇宙中最轻、分布最广的元素，拿来记这位跑得快的选手正好。把 Hydrogen 当成以前 Flash 那一档就好理解了。它主打高速响应和日常执行。写日常代码、总结长文、翻译、资料检索，或者在多智能体工作流里当并行干活的「小兵」，都可以先派它上。

它也是这四款里唯一提供 **API 免费层**的模型。Gemini App 免费版聊天用的是 Auto，系统会按任务在 Hydrogen 和更轻量的模型之间选。想手动指定 Hydrogen，Plus、Pro 和 Ultra 都可以。

## Neon（氖 · 10 号元素），刚登场的六边形战士

2026 年 11 月 18 日公开上线，API ID 是 `gemini-4-neon`。

氖通电会亮起橙红色的霓虹光。这个名字也好记，Neon 就站在轻量的 Hydrogen 和重型的 Carbon 中间。复杂软件工程、数据分析、企业工作流都能交给它。在 Google Antigravity 里，它还能当总指挥，调度一群 Hydrogen 子智能体并行干活。 [Google 的 Neon 发布说明](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)

有意思的是，Neon 开启最高思考档（`xhigh`）时，在 Artificial Analysis 综合指数拿到了 **61 分**，比 Carbon（`high`）的 **60 分**高一点。两者都开 `high` 时是 60 分，Neon 完成这组测试任务更快。 [Artificial Analysis 首发评测](https://artificialanalysis.ai/articles/gemini-4-neon-intelligence-gain)

## Carbon（碳 · 6 号元素），专啃硬骨头的重型选手

2026 年 11 月 10 日公开上线，API ID 是 `gemini-4-carbon`。

碳是有机化学的骨架，既能构成金刚石，也能搭建复杂的生命分子结构。Carbon 是 Gemini 4 系列里的重型深度推理旗舰，专啃需要反复推演、长周期规划的硬骨头，比如大型系统架构设计、前沿科学研究、复杂跨文件重构和安全审计。在 Gemini App 里，要订阅 **Google AI Ultra** 才能在下拉框里选它。

## Argon（氩 · 18 号元素），打过头阵的兼容老将

2026 年 10 月 13 日公开上线，API ID 是 `gemini-4-argon`。

氩是焊接时常用的惰性保护气，默默兜底。Argon 当初是最早公开上线的 Gemini 4 模型，打过头阵。现在 Google 的 Gemini App 模型名单已略去 Argon，付费 API 仍能调用。手里还有 10 月份写死 `gemini-4-argon` 的工作流，可以先照常跑。

![谁最适合帮你干活？Hydrogen 跑腿、Neon 做主力、Carbon 攻坚、Argon 兼容旧接口](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/gemini-4-guide-model-role-cards-ee223a2c23.jpg?imageSlim)

# 03、网传的 Oxygen、Krypton 和 Helix 是啥？

如果你最近刷技术论坛或社交平台，可能还见过另外三个名字在满天飞。先看一眼 Google 的公开模型目录，免得去下拉框里瞎找。截至 2026 年 11 月 23 日，这三个代号都还没出现在里面。 [Gemini API 模型目录](https://aistudio.google.com/docs/models)

- **Oxygen（氧 · 8 号元素）**。有社区帖子把 Arena 上的匿名测试和这个名字联系起来，猜它是下一代更快的 Flash。测试对应哪个模型、Oxygen 是不是它的代号，都还没得到确认。
- **Krypton（氪 · 36 号元素）**。传闻中的「超级旗舰」。Neon 和 Argon 都是稀有气体，顺着往下猜到 Krypton，听起来挺顺，证据还是社区传闻。
- **Helix（螺旋）**。元素周期表里查不到这个词。至于它是不是模型代号，目前同样没有 Google 的公开确认。

# 04、小白到底怎么选？照着这张表派活

理论讲完，直接上抄作业表格。无论你是网页端订阅党，还是接 API 的开发者，都可以对号入座。

| 你要干的活 | 派谁上 | Gemini App 怎么选 | 为什么选它 |
| --- | --- | --- | --- |
| 日常聊天、翻译、总结、写普通脚本、批量跑简单任务 | **Hydrogen** | 免费版聊天用 Auto；Plus / Pro / Ultra 可手动选 Hydrogen | 快，而且是这四款中 API 标准单价最低的，有免费层 |
| 复杂编程、跨文件改 Bug、财报或文档分析、做 Agent 总控 | **Neon** | Pro / Ultra | 复杂任务做得快，跑分接近或略超过 Carbon，取决于思考档位 |
| 长线项目、复杂系统架构、安全审计、难度高的数学或科研推演 | **Carbon** | Ultra | 适合需要反复推演、持续验证的长链路任务 |
| 维护已经接入 Argon 的旧工作流 | **Argon** | 走付费 API | 现有工作流可以继续用原模型 ID |

套餐和手动选模型的权限见 [Gemini App 模型说明](https://support.google.com/gemini/answer/18648722)。

![Hydrogen 和 Neon 的选型示例，以及换对话、用缓存的省钱示意](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/gemini-4-guide-selection-and-savings-bcefa26eb0.jpg?imageSlim)

*图里的「0.5 折」对应缓存命中的输入 token。批处理价格见第 05 节。*

# 05、怎么省钱？先算清这次「价格倒挂」

11 月底到 12 月初有个容易算错的地方。Carbon 和 Argon 的尝鲜价到 **2026 年 11 月 30 日（含）**结束。输入和输出单价看下面这张表。 [Gemini API 官方价目表](https://aistudio.google.com/docs/pricing)

| 模型 | 截至 2026 年 11 月 30 日（含） | 2026 年 12 月 1 日起 | 免费 API 层 |
| --- | --- | --- | --- |
| **Hydrogen** | **$1.50 / $7.50** | **$1.50 / $7.50** | 有 |
| **Neon** | **$3.00 / $15.00** | **$3.00 / $15.00** | 无 |
| **Carbon** | **$2.00 / $10.00**（尝鲜价） | **$4.00 / $20.00** | 无 |
| **Argon** | **$2.00 / $10.00**（尝鲜价） | **$4.00 / $20.00** | 无 |

*表里是标准 API 的美元单价，按每百万 token、输入 / 输出列出。输出价格包含思考 token。*

发现了没有？这里藏着一个有点魔幻的「限时价格倒挂」。

- **优惠期内**，因为 Carbon 还在享受 `$2 / $10` 的首发优惠价，所以它每百万 token 的单价反而比刚出的 Neon（`$3 / $15`）更便宜。
- **从 12 月 1 日起**，Carbon 和 Argon 的优惠期结束，单价翻倍，涨到 `$4 / $20`。届时 Neon 的输入、输出单价都比 Carbon 便宜 25%。算到一次任务上，还得看模型实际用了多少 token。

## 三条省钱办法

1. **看管好你的「思考深度（Thinking Level）」开关。** API 里，模型在脑子里「默念」的思考过程，也按输出 token 算钱。有时表面只回复了几句话，后台已经想了挺久。简单任务记得把思考档位调低，别让它过度脑补。 [Gemini API 思考档位说明](https://aistudio.google.com/docs/thinking#understanding-thinking-levels)
2. **订阅党别在一个窗口里聊到天荒地老。** 在同一个窗口里聊几十轮很方便，但对话长度、任务复杂度和使用的模型都会影响 Gemini App 的用量。换话题了，果断开新窗口。 [Gemini App 用量说明](https://support.google.com/gemini/answer/16275805)
3. **API 开发者善用「高低搭配 + 缓存」。**
   - 让 **Neon** 负责拆解任务和做关键决策，把简单的活儿交给 **Hydrogen** 并行执行。
   - 长系统提示词和固定资料尽量放在请求开头。隐式上下文缓存（Implicit Caching）命中时，**命中的输入 token 便宜 95%**。 [上下文缓存说明](https://aistudio.google.com/docs/caching)
   - 不急着秒回的离线任务可以走异步 **Batch**，需要同步拿结果但能接受多等一会儿，可以用 **Flex**。两种模式的输入和输出单价都是标准价的 **5 折**。

![Gemini 4 选型与省钱总结，包含四款模型的角色、选型决策树、开新窗口和缓存](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/gemini-4-guide-guide-summary-96cd16246f.jpg?imageSlim)

# 写在最后

绕了一大圈，这套元素周期表其实可以压成一句话。**日常跑腿 Hydrogen，主力攻坚 Neon，超长硬骨头请 Carbon，Argon 留着做兼容。**

科技巨头的起名脑洞永远没有尽头。今天是氢氦锂铍硼，明天指不定又端出个有机物官能团或者星座，逼着我们把中学课本翻个底朝天。名字随它怎么起，下回看到模型下拉框，先想想手上这活儿有多重。

![AI 元素炼金工坊里，Hydrogen 跑腿、Neon 操作工具、Carbon 埋头思考、Argon 守着旧系统](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/gemini-4-guide-alchemist-workshop-c08f0ab5ec.jpg?imageSlim)
