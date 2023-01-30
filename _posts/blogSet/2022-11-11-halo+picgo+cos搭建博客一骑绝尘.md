---
layout: post
title: "typora+picgo+gitee搭建免费图床纵享丝滑"
subtitle: "typora+picgo+gitee搭建免费图床纵享丝滑"
author: "guanlili"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - halo
  - 博客
  - picgo
---

# halo+picgo+cos搭建博客一骑绝尘

## 前言

离谱，我怎么又开始折腾博客了....

别急着打我，让我先讲两句。我现在非常自信这是我最后一次搞博客！

先讲讲我的博客历程。

三年前我搭了一个基于github的博客。

Typora+PicGo+github搭建免费稳定图床写博客如行云流水。

然后发现国外地址加载图片缓慢，于是

使用jsDelivr的CDN加速github图床

然毕竟是国外的地址，博客会间歇性无法访问，于是我就迁移到国内的gitee

typora+picgo+gitee搭建免费图床纵享丝滑

但是我总不能同时更新两个仓库吧！于是就有了通过镜像管理自动同步

github博客自动同步到gitee（保姆级教程）

但还是有问题啊！虽然gitee的图床没有问题，但是到了博客图片就显示不稳定！！



可恶！是时候感受一下金钱的力量了。买服务器！买图床！我就不信了！



再说说市面上那么多博客框架为啥选择halo。

- 前台后台页面清新简约。（颜值即正义！）
- 支持md文档直接导入到博客。（这个太重要了！我在写完markdown之后直接上传就行！肥肠滴丝滑！）
- 支持meimaid流程图。（hexo都无法渲染typora的流程图，这功能我真的爱！）
- 技术栈是Spring Boot。（万一以后自己二次开发呢）

## 0、准备工作

正好趁着双十一有活动，我一咬牙！一跺脚！

|                    | 配置                  | 时间 | 价格 |
| ------------------ | --------------------- | ---- | ---- |
| 腾讯云轻量级服务器 | 通用型-2核2G-40G-300G | 3年  | 810  |
| 腾讯云存储         | COS 标准存储容量包50g | 1年  | 1    |
| 域名               | guanlili.website      | 10年 | 178  |

把域名申请好SSL证书，添加站点需要用。

## 1、部署halo博客

服务器的系统镜像选择随意，但我选择的宝塔linux面板，可以通过宝塔来安装。

通过halo官方教程进行部署，官方文档很清晰，我这里不做赘述了。

### 1.1、在 Linux 环境部署halo

使用 Docker 部署https://docs.halo.run/getting-started/install/docker

## 2、初始化halo博客

安装完成点击我们配置好的域名就可以访问了。

先访问https://guanlili.website/admin进行博客后台的配置。

注册管理员信息和博客地址名称等

<img src="https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20221114115930896.png" alt="image-20221114115930896" style="zoom: 67%;" />

进入后台就是一个干净整洁的管理页面，可以开始愉快的写博客了！

<img src="https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20221114120212705.png" alt="image-20221114120212705" style="zoom: 67%;" />

让我惊喜的小工具，只需要导入本地的md文件，就可以自动生成一篇文章！开心！

<img src="https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20221114120347581.png" alt="image-20221114120347581" style="zoom:67%;" />



## 3、COS腾讯云存储

博客弄完了我们搞一下图床。

进入到对象存储的「存储桶列表」-创建存储桶-设置名称与访问权限。

<img src="https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20221114121332185.png" alt="image-20221114121332185" style="zoom:67%;" />



### 3.1、迁移github图床

> 如果没有可以跳过本步骤

把github图床打包下载，上传到文件列表中，对比图片的路径。

举个栗子。

将全部文档的前缀

https://gitee.com/guanlili/picturebed/img/2022010122.png

替换为

https://blog-122131239.cos.ap-beijing.myqcloud.com/PictureBed/img/2022010122.png

这样咱们所有的文章的图片都替换好了！再也不怕图片无法加载出来了。

## 说在后面

之前总觉得能白嫖绝不付费，但现在感觉适当的付费上云也是可以接受的。毕竟现在都校招入职正式工作啦，为了自己的爱好，花费一点也是值得的！

这次折腾完的博客我是相当满意，感觉最近几年也不会再折腾啦！无论什么样的博客都只是一个展现的形式，还是应该专注于内容的创作！

