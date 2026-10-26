---
title: "Cursor 升级到 X Subscription 后，重度 Claude 用户的天塌了"
subtitle: "两个用量池并成一个共享池，Claude 从套餐里被请了出去"
date: 2026-10-26
author: "lili"
header-mask: 0.4
tags: [AI, Cursor, Claude, 产品观察]
description: "Cursor 并进 The X Subscription 之后，Grok 额度翻倍，Claude 的包含额度却没了。一个已经升级的重度 Claude 用户，把前后差异摊开来说清楚。"
---

朋友们，我干了一件蠢事。

2026 年 10 月，Cursor 正式并进 The X Subscription，和 Grok、X Premium 打包成一个订阅。官方的说法很好听：**一个订阅打通思考、创建、构建和分享。**

我点了升级。

升级前，设置里还能看到两坨额度：Cursor Models 一坨，Other Models 也就是 Claude 一坨。升级后再打开，只剩一个共享池。Claude 那一栏，直接没了。

![调整前是 Cursor Models、Other Models 两池加 Grok Bot，调整后只剩一个周刷新的共享池](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20261026123150665.png?imageSlim)

说实话，那一刻有点像打开冰箱，发现昨天还在的半盒酸奶被人喝光了，还贴了张纸条：以后想喝，请另行付费。

我就是那个还想继续喝酸奶的人。下面把升级前后的真实差异摊开，免得同样踩坑的朋友再交一遍学费。

------

## 一、套餐对上了，东西却不是原来那份

官方给了一张「对应」表。我对照了一下，层级能对上，内容对不上。

| 旧版套餐（Legacy） | 价格 | 对应新套餐 | 新价格 |
|---|---|---|---|
| Hobby | 免费 | Free | 免费 |
| Pro | $20/月 | Premium | $30/月 |
| Pro+ | $60/月 | Super | $100/月 |
| Ultra | $200/月 | Ultra | $200/月 |

新套餐还多了一个更便宜的 **Plus（$8/月）**。看着挺香，不过它只能用 Grok，Claude、GPT、Gemini 一律进不去。

官方说的「对应」，只是最接近的层级，不是原来那份套餐换了个马甲。新套餐在 Grok 编程用量上，至少是对应旧套餐的 **2 倍**；可与此同时，第三方模型的包含额度被拿掉了，再额外塞进 Grok 应用和 X Premium 的权益。

旧版付费 Cursor，说白了是三个东西：编辑器里的 Grok 额度、Claude 额度，再加上 Grok Bot。Grok 聊天、语音、生图那些 App，以及 X 的会员，本来都不在这份账单里。想用得另开 SuperGrok 或 X Premium。

合并之后，相当于多了两端会员——Grok 应用，和 X Premium。官方自己也写了：Premium 这一档，打包的是以前 SuperGrok + Cursor Pro + X Premium+，分开买大约 $90/月，现在 $30 一口价。

少的是什么？不是 Grok。Grok 在 Cursor 里还在，额度还加了；Grok Bot 也还在。被请出套餐的，是 Claude。

有点像点了一份升级套餐：主食加量了，还送了两道以前要单点的菜，你真正想吃的那道，从套餐里划出去了。

------

## 二、最核心的变化：两个池并成一个

升级前，旧版 Cursor 套餐是两本独立的月度粮票：

- **Cursor Models 池**：Grok 4.7 / 4.6 / 4.5 + Composer 2.5
- **Other Models 池**：Claude、GPT、Gemini 等第三方模型，有包含额度

每月跟着账单周期重置。两本粮票互不干涉，Claude 用多少，不影响 Grok 额度。

升级后，只剩一本，还改成了每周刷新：

- 只覆盖 Grok 系列 + Composer 2.5
- 这个池子在 Cursor、Grok 聊天、图像、语音、Grok Bot 之间共享
- Claude 等第三方模型，不再有任何包含额度

一句话总结：以前是「Grok 一个池 + Claude 一个池」，现在只剩「Grok 一个共享池」。Claude 被请出了包含范围。

池子变大了，但只认一家粮店。想吃别的，得自己带现金。

------

## 三、Claude 还能不能用？

能用。规则变了。

| 项目 | 升级前 | 升级后 |
|---|---|---|
| 是否有包含额度 | 有（Other Models 池） | **完全没有** |
| Plus 档 | — | 完全不能用第三方模型 |
| Premium 及以上 | 直接用 | 可以用，但从第一个请求起按 API 标价扣费 |
| 付费方式 | 先扣包含额度，超出再按需 | 必须单独充预付额度（Additional usage credits） |

想继续在 Cursor 里用 Claude，现在得同时满足三件事：

1. 套餐至少是 Premium（$30/月）或更高
2. 去 [grok.com/dashboard/billing](https://grok.com/dashboard/billing) 单独充预付额度
3. 用多少扣多少，按官方 API 标价实时结算

对重度 Claude 用户来说，这等于从「套餐里就能用」变成「每用一次都要额外掏钱」。以前是月卡，现在是打车：车还是那辆，计价器从上车就开始跳。

![选 Claude 时弹出提示：不在每周包含用量里，要买额度或换 Grok](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20261026104338559.png?imageSlim)

------

## 四、另外几件容易忽略的事

重置周期从每月一次变成每周一次。对偶尔爆肝的人是好事，一天用猛了不至于把整月额度吃光；对习惯一个月一个大池的人，就是账本节奏被改掉了。

超额方式从「按需后付」变成「预付额度 + 可选自动充值」。账单入口也搬了家，从 `cursor.com/dashboard` 迁到 `grok.com/dashboard`。

Grok Bot 本身没被砍。旧版付费 Cursor 就能用，新套餐 Premium 及以上也能用。变的是账本：以前它有自己那一格周额度，现在和 Cursor、Grok 应用喝同一口井。你在 Bot 里跑一上午，编辑器里的 Grok 额度也会跟着瘦。Plus 档（$8/月）没有 Grok Bot——只是普通付费用户对上的是 Premium，一般碰不到这层。

账户余额更窝火。升级前账上剩的钱，会自动抵扣下一期及后续的统一订阅费用，但不能拿去跑 Claude。钱在，门不对。

还有一件最要命的：**切换是单向且永久的。** 官方写得很清楚，切过去之后旧套餐取消并按比例退款，不能撤销。旧版套餐一旦结束，一般也买不回来了。我没去找客服求情——按这个写法，求了大概也没用。

官方也说了，没切的人可以继续留在 Legacy 套餐上，两个月度池照旧。我是那个已经伸手按下去的人。按钮旁边没写「此键按下，覆水难收」，我自己补上了。

------

## 五、谁适合升级，谁最好先按住

适合升级的人，其实挺清楚的：

- 主要用 Grok / Composer，很少碰 Claude
- 本来就有 Grok + Cursor 双订阅，想合并成一笔账
- 能接受 Claude 变成按量付费
- 喜欢每周刷新，而不是一个月一个大池

不适合升级的人，比如我：

- 重度依赖 Claude / GPT / Gemini
- 旧套餐的 Other Models 池用得比较多
- 不需要 Grok 的其他功能，只想专心写代码
- 更习惯每月一个稳定额度池

如果你还在旧套餐上，先打开设置看一眼自己这两个池各自用了多少。Grok 池经常见底、Claude 池几乎没动，升级是赚的；反过来，先按住。

------

## 六、升级之后，额度去哪儿看

三件事，三个入口，别找错了：

- **每周包含用量池**：打开 [grok.com/dashboard](https://grok.com/dashboard) → Usage
- **预付用量额度**（跑 Claude 用的）：[grok.com/dashboard/billing](https://grok.com/dashboard/billing) → Additional usage credits
- **账户余额**（只能抵订阅费用）：同样在 billing 页面，会自动应用到下一张发票

![Billing 页：周池、预付额度、账户余额分列，账户余额只能抵下一张订阅发票](https://blog-1258476669.cos.ap-beijing.myqcloud.com/macAir/image-20261026104709444.png?imageSlim)

------

这次统一订阅，对主要用 Grok 的用户是利好：用量更多，和 Grok 产品打通。对重度依赖 Claude 的用户来说，最核心的包含额度被直接拿掉了。

回头看，这哪里是一次「升级」。这是一次合并，也是一次明码标价。Grok 加量、X Premium 打包、Claude 从套餐里划出去——账早就算好了，只是以前写在另一页小字里。世上没有免费的午餐。我还是太年轻了。

天下大势，合久必分，分久必合。产品也是。合到一处之后，谁被合进去、谁被合出去，才是真正要看的那一行小字。

切换不可逆。还在旧套餐上的，先看清自己主要用什么模型再决定；已经升级的，就只能接受新规则，或者把 Claude 主力挪到别处——Claude Code、GitHub Copilot 都行——Cursor 留给 Grok。

规则变了，代码还得写。

希望这篇文章能帮同样踩坑的朋友，少交一次学费。

> 记于 2026.10.26
