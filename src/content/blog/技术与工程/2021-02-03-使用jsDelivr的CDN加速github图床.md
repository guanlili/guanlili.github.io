---
layout: post
date: 2021-02-03
title: "使用jsDelivr的CDN加速github图床"
subtitle: "历史存档：文章已停止维护，不再作为当前教程推荐"
author: "lili"
header-mask: 0.4
tags: [博客搭建, 运维]
description: "历史文章存档，仅保留原网址供追溯；内容已退出文章列表和推荐。"
unlisted: true
updated: 2026-11-10
---

> **历史存档 · 不再维护（2026-11-10）**
>
> 本文已退出文章列表和推荐，仅供历史查阅，不建议直接照本文操作。请前往[文章归档](/archive/)阅读其他文章。


# 使用jsDelivr的CDN加速github图床

## 说在前面

自从换了github图床之后，我发现图片加载速度实在是过于慢，甚至不挂梯加载不出图片。

搜了一下可以使用jsDelivr的CDN来给图床加速，看了看也挺简单的。如果你用的是[picgo](https://github.com/Molunerfinn/PicGo)这个图床上传软件基本可以一步到位完成加速。

## 什么是CDN

> CDN的全称是Content Delivery Network，即内容分发网络。CDN是构建在网络之上的内容分发网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN的关键技术主要有内容存储和分发技术。——百度百科

CDN有众多，我们选择[jsDelivr](https://www.jsdelivr.com/)。为什么？因为免费，好用。

## 如何加速github图床

### picgo端设置：

在自定义域名内填入`https://cdn.jsdelivr.net/gh/用户名/图床仓库名` 。

![image-20210410113943855](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210410113944.png)

完成此设置之后在使用picgo上传图像时会自动替换外链。

之后再次访问图片就会登峰造极了。