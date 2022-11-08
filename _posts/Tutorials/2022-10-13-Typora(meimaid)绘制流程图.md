---
layout: post
title: "Typora(meimaid)绘制流程图"
author: "guanlili"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:

  - 流程图
  - typora
  - meimaid
subtitle: "绘制流程图...."
---

# Typora(meimaid)绘制流程图

# 0、说在前面

在写文档时难免需要画画流程图，主流的画图工具如processon等工具需要登陆or付费不说，每当修改的时候还需要重新编辑再重新导出，就非常的麻烦。那么能不能通过Markdown文字的方式，随便写写就能画好一张图呢！这就是meimaid！

> *Typora编辑时输入flow即可，CSDN在编辑时关键字flow会被自动转换成mermaid语法flowchat，所以代码首行会显示flowchat。

# 1、如何使用

先在 Typora 中，输入 **```mermaid** 然后敲击回车，即可初始化一张空白图。

## 流程图

### 节点特效

```mermaid
graph LR
node1[文本框] --> node2(文本框)-->node3([文本框形状1])-->node4[(数据库)]
node5((circle))-->node6>flow]-->node7{box}-->node8{{flow1}}
-->node9[/parallelogram/]-->node10[\parallelogram\]
```

### 节点颜色

> 可通过颜色选择工具获取颜色代码https://photokit.com/colors/?lang=zh

```mermaid
graph LR; 
A:::class1 --> B:::class2
classDef class1 fill:#00FF7F;
classDef class2 fill:#00FF2F;
```

### 连接线

```mermaid
graph LR
A --- B --> C ---|new text|D-- text --> E-.->F-.添加文字.->G== 文字 ==> H

```

### 子图

```mermaid
flowchart TB;
two --> three
c1 --> a2
one -->two



subgraph three
c1 --> c2
end
subgraph one
a1 --> a2
end
subgraph two
b1 --> b2
end
```

### 流程图方向

| 代码 | 含义          |
| ---- | ------------- |
| TB   | Top to Down   |
| TD   | Top Down =TB  |
| BT   | Bottom to Top |
| RL   | Right to Left |
| LR   | Left to Right |

## 饼图

饼图使用 `pie` 表示，标题下面分别是区域名称及其百分比。

```mermaid
pie
title Key elements in Product X
    "Calcium" : 42.96
    "Potassium" : 50.05
    "Magnesium" : 10.01
    "Iron" :  5
```

# 2、导出图片

Mermaid 官方有一个在线的工具，可以导出 SVG 和 PNG。

[Mermaid 官方在线工具](https://mermaid-js.github.io/mermaid-live-editor)









drawio开源免费的在线流程图

https://www.diagrams.net/