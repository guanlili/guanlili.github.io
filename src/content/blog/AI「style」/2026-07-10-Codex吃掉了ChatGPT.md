---
layout: post
title: "Codex吃掉了ChatGPT"
subtitle: "从Chatbot到Copilot到Cowork，Agent时代正式来临"
date: 2026-07-10
author: "lili"
header-mask: 0.4
tags: [AI, Agent, OpenAI, Anthropic]
description: "GPT-5.6发布，Codex正式合并进ChatGPT应用，Chat时代落幕，Agent时代来临。借这次改版聊聊AI从chatbot到copilot再到cowork的演进，以及OpenAI和Anthropic这几年的贴身缠斗。"
---

这周干了件狠事——把团队几个前后端分离的老项目，一股脑重构成了AI native架构，顺手也把攒了好几年的技术债清了清。代价就是Codex和Claude的额度跟着一起遭殃，昨晚已经在担心额度要见底了，只能眼巴巴等周一重置。结果GPT-5.6一发布，两家的额度直接给我充满了——大厂内卷，倒是先便宜了我们这些打工人。

今早起来第一件事是点开Codex，更新完弹出一行字：「Codex现已成为ChatGPT应用」。

我盯着这句话看了两秒才反应过来，这不是一次普通的版本更新——这是从2022年11月30日开始的Chat时代，正式落幕了。

Agent时代，来了。

![image-20260710092818649](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20260710092818649.png?imageSlim)

## 一、从Chatbot到Copilot，再到Cowork

回头看这几年的AI，其实是一条很清晰的路径：先是Chatbot——你问我答，一问一答，像个博学但没有手的顾问；然后是Copilot——它开始帮你干活，写代码、改文档，但主导权还在你手里；现在轮到Cowork——它不再等你发号施令，而是直接坐到你旁边，跟你一起把事情做完。

这次更新最有意思的，是新增了一个面向非开发者的Work模式。

其实该有的能力早就有了，Codex这套Agent架构原本就不挑活。真正被拆出来的不是功能，是**心智**。过去一提Codex，默认前提就是"你得会写代码"，小白用户光是打开的勇气都要攒半天。现在单独拎出一个Work模式，说穿了就是想告诉所有不写代码的人：这次真的是给你用的。

![image-20260710093226419](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20260710093226419.png?imageSlim)

这份亲切感，这次还做成了实体——新增了一个"桌面宠物"功能。打开开关，一个小人就常驻在你的桌面上，干活的时候会眨眼睛，不用切回App也能瞄一眼Codex是不是在偷懒；点一下它，直接跳回Codex工作台。

**赛博养猫，不是梦。**

更绝的是，它还会实时同步进度，主动告诉你正在干什么——这意味着你可以放心去聊天、刷剧，干什么都行，完全不用惦记它是不是在摸鱼。

**这汇报积极性，秒杀我带过的90%员工。**

![image-20260710110147745](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20260710110147745.png?imageSlim)

## 二、站点：从"本地能跑"到"一键分享"

不少人在vibe coding圈子里都经历过同一个循环：跟AI聊一晚上，代码在本地跑起来了——然后呢？没有然后了。部署上线这道坎，从买服务器到配域名，一直横在"聊出来的应用"和"能发给别人看的产品"之间。行业里不是没有解法，Lovable一键发布、自己接GitHub Pages或Cloudflare，但这些都要求你跳出对话框，另外学一套东西。

这次Codex加进来的"站点"功能，直接把这道坎接管了：项目自动部署上线，扔给你一个能打开的域名，随手甩给朋友同事就能看，不用你再手把手教他们怎么在本地跑起你的代码。

**从"我做了个东西"到"你可以打开看"，中间那道最难迈的坎，被顺手填平了。**

能跑起来只是Demo，能被别人打开才是产品。

![image-20260710102524877](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20260710102524877.png?imageSlim)

整个过程简单到有点不真实：构建完成，点一下"发布"，域名当场就生成好了。

![image-20260710114217518](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20260710114217518.png?imageSlim)

## 三、被吃掉的ChatGPT

顺带一提，这次改版OpenAI也"学坏"了，照着Anthropic起代号的路子，给模型捣鼓出Sol、Terra、Luna这几个新名字——拉丁语里分别是太阳、大地、月亮。具体对应什么能力，官方说得含糊，倒更像是先把"这是一整套体系"的心智立住，这招Anthropic早就玩过：Opus、Sonnet、Haiku，一听就知道是同一个家族的不同尺寸。

![image-20260710092900349](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20260710092900349.png?imageSlim)

名字是小事，真正的大事是壳子本身没了。与其说是"Codex和ChatGPT合并"，不如说是ChatGPT被吃掉了。打开应用，原来的对话框缩成了右下角一个小小的Tab，安静地待在那儿，像是在证明"我曾经也是主角"。

![image-20260710094451236](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20260710094451236.png?imageSlim)

看着这个小角标，突然有点唏嘘——三年半前，就是这个对话框把全世界拽进了AI时代，现在它却成了自己产品里最不起眼的一角。

但敢把自己的招牌产品降级成一个小Tab，说明OpenAI手里已经有了更硬的底牌。这份底气，来自这两年被逼到墙角后的一场绝地反击。

## 四、鸣人与佩恩：这几年的贴身缠斗

今年五月，Anthropic放出Claude Fable 5，coding能力一骑绝尘，据当时的融资消息，ARR冲到470亿美元反超OpenAI，估值逼近万亿；而OpenAI这边，全年净亏损预计奔着两百多亿美元去，被开发者吐槽"Sora画饼、模型挤牙膏"——像极了那位曾经技压群雄、如今被天才新秀短暂反超的顶流选手。

可他没认输。砍掉浮华的Sora叙事，闭关重练内功，憋出GPT-5.6 Sol，跑分反超Fable 5，价格砍到四分之一，顺手把Codex合进ChatGPT，正式开启Agent时代。

就像鸣人深山修成仙人模式，从天而降，一人挡下佩恩六道。

他说："我还没完呢。"

**"士别三日，当刮目相待"——技术竞赛最好看的地方，从来不是谁一直领先，而是被压过一头之后怎么爬起来。**

轮到你了，Anthropic。
