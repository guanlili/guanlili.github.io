---
title: "航旅 Mock 质量体系"
date: 2023-09-01
summary: "围绕 JVM Sandbox 和业务接口治理，建设 Mock 能力与质量规范，提升复杂业务场景下的研发测试效率。"
type: "Engineering Tool"
role: "Test Development / Backend"
status: "Delivered"
tags: ["Java", "JVM Sandbox", "Mock", "Quality"]
cover: "/img/post-cover-history.jpg"
impact: "沉淀 Mock 开发指南和质量体系，支持复杂嵌套类型、接口调试和测试场景复用。"
featured: true
links:
  article: "/2023/09/01/航旅mock质量体系建设/"
---

## 项目背景

航旅业务链路复杂，联调依赖多，接口返回结构也经常包含多层嵌套。传统 Mock 方式在效率、可维护性和真实性之间很难平衡。

## 我负责什么

- 参与基于 JVM Sandbox 的 Mock 能力建设。
- 梳理复杂数据结构下的 Mock 改造方案。
- 输出研发设计规范和使用指南，降低团队接入成本。

## 核心难点

这个项目的关键在于把“能 Mock”推进到“可治理、可复用、可维护”。技术方案需要贴近业务调用链，也要让日常研发愿意使用。

## 结果与复盘

它不是一个单点工具，而是一套围绕研发效率的工程体系。对我来说，这个项目也强化了一个判断：质量工具真正有价值，是因为它进入了团队的默认工作流。
