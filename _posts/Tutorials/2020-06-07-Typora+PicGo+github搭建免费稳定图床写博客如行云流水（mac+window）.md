---
layout: post
title: "Typora+PicGo+github搭建免费稳定图床写博客如行云流水"
subtitle: "（mac+window）"
author: "guanlili"
header-img: "img/post-bg-css.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - 图床
  - 博客
---
# Typora+PicGo+github搭建免费稳定图床写博客如行云流水（mac+window）
## 0.前言
一直都在用typora写博客和技术文档，它干净整洁的洁面让我流连忘返。不过一直有一个问题困扰着我，那就是在typora中插入的图片，没有办法直接粘贴到博客上，比如⬇️
![image-20210203195246948](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195247.png)
图片少还好，重新截图上传到博客里就是了，但是当图片多的时候，emm....有一句很开心(mmp)不知道当讲不当讲。于是为了解决这个问题，经过我的查阅资料与多天的实践，终于把这些机制研究的七七八八了。
首先为了解决上传博客图片失效的问题，需要准备一个图床。
图床：图床一般是指储存图片的服务器，有国内和国外之分。~~国外的图床由于有空间距离等因素决定访问速度很慢影响图片显示速度。国内也分为单线空间、多线空间和cdn加速三种。~~
百科上的都是废话，简单的说图床就是把你的图片放在服务器里，（区别于平时放在本地）把图片生成链接，以便与我们随时可以使用。
不过如果哪天服务器炸了，或者图床的公司倒闭了，图片可能就无法用了，这也解释了为什么很多远古时期的帖子图片无法显示了。
搜的寺内～

## 1.Typora
#### Typora安装
不多说，请更新到最新版本，老版本没这功能。我当前的版本是：

mac:0.9.0.33.2：

![image-20210203195352175](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195352.png)

windows0.9.89:

![image-20210203195332529](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195332.png)

Typora配置

mac：
Typora-偏好设置-图像

![image-20210203195413482](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195413.png)

window(注意选择PicGo的路径):

![image-20210203195438354](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195438.png)

2.github

账号应该不必说了，没有的去注册一个。
### 新建一个图床仓库
如下配置：

![image-20210203195459842](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195459.png)



去**setting-developer settings-personal access tokens-new token** 新建一个token （可以理解为你图床仓库的钥匙）

![image-20210203195531811](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195531.png)

创建完成后复制生成一串字符 token，这个 token 只出现一次，所以要保存一下。

## 3.PicGo
### PicGo安装
下载PicGo网址（请选择最新版本我这里是2.2.2）：https://github.com/Molunerfinn/PicGo/releases
mac电脑选择dmg
window电脑选择exe
下载安装。
### PicGo配置
#### github图床配置
打开详细配置-图床设置-github图床

![image-20210203195643653](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195643.png)

仓库名：github的名字/仓库名（注意不要有空格）

分支名：默认 master

Token：就是刚刚复制的那一串字符（打开你仓库门的钥匙）

存储路径：这个可以填也可以不填，填了的话图片就上传到 github 中img/这个文件夹

自定义域名：可填可不填，按照提示的规则填写即可

> 这里详细说一下**设定自定义域名**，由于GitHub访问上传速度很慢，所以需要进行优化。
>
> 用jsDelivr优化加速，在自定义域名内填入`https://cdn.jsdelivr.net/gh/用户名/图床仓库名` 。
>
> 这样就是及其的丝滑了。
>
> 2020-02-03补充。

#### picgo偏好设置
![image-20210203195558851](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195558.png)

大功告成啦！现在可以试下图床是否可以正常使用啦～

## 常见问题
由于自己安装的时候也经常遇到错误，故在此把自己遇到的坑和网上大佬们的结合起来整理一下。（侵删）
### 问题一：Failed to fetch
这个错误一般是由端口设置错误造成的，打开picgo的log文件。错误提示是端口繁忙。

![image-20210203195759835](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195759.png)

解决方法：打开picgo设置，点击设置Server选项，将端口改为36677端口，这是picgo推荐的默认端口号，然后保存，成功。

![image-20210203195902390](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195902.png)

不过有的时候，我们的老朋友Failed to fetch还是如约而至，打开端口设置一看，怎么变成了366771？？？？

问题在于端口冲突，如果你打开了多个picgo程序，就会端口冲突，picgo自动帮你把36677端口改为366771端口，导致错误。log文件里也写得很清楚。

![image-20210203200128192](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203200128.png)

解决方法：先把picgo中的端口设置改回36677，然后退出所有picgo程序，再使用typora上传功能（会自动启动picgo程序）

### 问题二：{“success”,false}
这个错误相信也有很多小伙伴遇到了，原因是文件名冲突了，如果你上传过一张image1.jpg的图片，再上传名称一样的图片就会失败，康康log文件(感谢日志！)里也写到了。

![image-20210203200243652](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203200243.png)

办法也很简单，打开picgo设置，将**【时间戳重命名】打开**。如图所示：

![image-20210203200420522](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203200420.png)

再次上传文件，上传成功~

授人以鱼不如授人以渔，上面的三种情况解决方法教给大家了，但是错误总是千奇百怪层出不穷的，如果下次出现上传错误的提示，请大家找到picgo的log文件，自己查看问题的原因嗷。

### 问题三：图片复制到csdn：外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传
这是csdn论坛的问题，同样里链接放在简书里就可以上传成功。

解决办法：

先要保证url地址在浏览器回车能显示 ，若不显示，则是图床的问题，这里也无能为力了。

把原链接

```
![image-20200607091827464](https://raw.githubusercontent.com/guanlili/PictureBed/master/img/20200607091827.png
```

替换为（html的写法，Markdown的最终都是转为html来显示，这里直接在其中插入html显示图片）

```
<img src="https://raw.githubusercontent.com/guanlili/PictureBed/master/img/20200607091827.png" width = "600" />
```
即可解决。

不过！如果图片多也很麻烦的喂，期待csdn早日解决。

### 问题四：github仓库无法显示图片
这个问题也困扰了我好久，开始也没在意，不过实在影响使用，也花费时间解决啦。配置hosts文件，详细的配置看这个链接。

[Github无法加载或不显示图片问题（window+mac）](https://blog.csdn.net/outman_1921/article/details/106595472)

[Github无法加载或不显示图片问题（window+mac）](https://www.jianshu.com/p/fba47c4c837d)

### 问题五：使用PicGo时往往会出现上传失败的情况
这个不知道是github的问题还是PicGo的问题，只能多试几次即可上传成功。（有明白的朋友还请多多指教）

![image-20210203195931362](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210203195931.png)

### 4.说在后面

为什么选择github？

免费！因为平时用github比较多，自己做的项目啦，写的md工作记录文档之类的都存在github，懒得因为图床还要单开一个网站，一站在手，天下我有，并且这里的人各个都是人才，代码又好看，超喜欢在里面...咳咳跑题了。

大家有什么好用稳定的图床也可以在留言区和我交流！

以上就是本篇文章的全部内容啦，总结我Typora+PicGo+github搭建图床以来的全部历程和遇到的问题，不是很全面，以后再遇到了再更新。也请大家多多指教哦～