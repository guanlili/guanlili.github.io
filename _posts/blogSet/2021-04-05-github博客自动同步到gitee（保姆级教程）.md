---
layout: post
title: "「教程」github博客自动同步到gitee"
subtitle: "博客自动备份在gitee，国内也能丝滑访问blog"
author: "guanlili"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - github
  - gitee
  - 自建博客
---
# github博客自动同步到gitee（保姆级教程）

## 20220907更新

今天突然发现gitee官方新出了**仓库镜像管理**功能，终于可以轻松的自动同步仓库了！使用方法也很简单！

### 1、添加镜像

博客的仓库找到管理-仓库镜像管理-添加镜像

![image-20220907172500968](	https://blog-1258476669.cos.ap-beijing.myqcloud.com/picturebed-master-gitee/img/image-20220907172500968.png)

### 2、绑定github账号并获取令牌

因为我们是从github（源）到gitee，所以选择Pull，然后选择同步的镜像仓库，绑定私人令牌就可以啦！

绑定后当github仓库有更新时，gitee就会自动拉取仓库的镜像了。

![image-20220907172719361](	https://blog-1258476669.cos.ap-beijing.myqcloud.com/picturebed-master-gitee/img/image-20220907172719361.png)

参考文档：[仓库镜像管理 （ Gitee <-> Github 双向同步）](https://gitee.com/help/articles/4336#article-header0)

## 前言：

由于国内网访问github实在太慢！虽然在公司可以连接外网访问还算可以，但是回学校想看看博客或者分享给别人的时候经常会崩掉！于是我想可不可以把github博客迁移同步到gitee呢？我期望实现的需求是，依然用github写博客，然后push仓库后可以自动同步到gitee，结合devops流水线的工作原理，无需增加我的操作复杂度，这样国内也可以轻松的访问。完美！

说干就干，开始去网上查资料！

## 迁移github仓库

迁移很简单，直接gitee右上角的+，选择从Github/Gitlab导入仓库，可以直接从URL倒入，也可以登陆github账号直接导入。

**重要！这里建议导入和自己gitee用户名同名的文件**（不是github原名！）

> 如果不同名的话会出现博客无法访问css样式，也无法链接到其他地址。避免后续排坑，最好这里直接改了。
>
> 原因见https://gitee.com/help/articles/4136#article-header0常见问题1.

![image-20210402200311362](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210402200318.png)

同步完成后，查看仓库，点击右上角的服务下的第一个图标，GiteePages，点击进去默认配置部署就好。（无需勾选）

不出意外点击部署后的地址就可以访问博客了。

## github仓库实时同步到gitee

### 方法一

在 Gitee 仓库主页点击同步更新按钮即可！***这里的同步功能默认是强制同步（新代码直接覆盖）\***

> 定时同步目前官方是不支持。
>
> https://gitee.com/oschina/git-osc/issues/IKH12

![image-20210402202500472](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210402202500.png)

虽然很简单，但是明显不够丝滑，每一次push代码都需要点一下同步。显然不是我们的预期。

### 方法二

可以通过本地仓库的形式，同时推送到github和gitee，相当于执行两次commit的操作，push两次。但显然也不是我想要的。

![image-20210402203842701](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210402203842.png)

1、首先通过 git remote -v 查看您要同步的仓库的远程库列表，如果在列表中没有您 Gitee 的远程库地址，您需要新增一个地址

```
git remote add 远程库名 远程库地址
eg: git remote add gitee git@github.com:xxx/xxx.git
```

如果在 add 的时候出现error: Could not remove config section 'remote.xxx'.一类的错误，通过把仓库下.git/config 文件里面的 [remote "xxx"] 删掉或者是用别的远程库名即可。

2、从 GitHub 上拉取最新代码到本地

```
git pull 远程库名 分支名
eg：git pull origin master
```

3、推送本地最新代码到 Gitee 上

```
git push 远程库名 分支名
eg：git push gitee master
```

如果出现有差异的话需要自己手动解决差异

### 方法三

官方的Action方法[Github Action](https://github.com/features/actions)

运用CI/CD的思想，从github中自动化的执行流程，完美符合我们的预期。

#### 原理

Github Action提供了[2种方式](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/about-actions#types-of-actions)去实现Action：

- Docker container. 这种方式相当于在Github提供的计算资源起个container，在container里面把功能实现。具体的原理大致如下：
  ![image-20210402205215202](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210402205241.png)
- JavaScript. 这种方式相当于在Github提供的计算资源上，直接用JS脚本去实现功能。

作为以后端开发为主的我们，没太多纠结就选择了第一种类型。关于怎么构建一个Github的Action可以参考Github的官方文档[Building actions](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/building-actions)。官方文档真的写的非常详细了，并且也通了了hello-world级别的入门教程。

同步的核心代码实现

而最终的关键实现就是，我们需要定义这个容器运行的脚本，原理很简单：

![image-20210402205304730](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210402205304.png)

大致就是以上4步：

1. 通过Github API读取Repo列表。
2. 下载或者更新Github repo的代码
3. 设置远端分支
4. 将最新同步的commit、branch、tag推送到Gitee。

关心细节的同学，具体可以参考代码：https://github.com/Yikun/gitee-mirror-action/blob/master/entrypoint.sh

### 如何使用？

举了个简单的例子，我们想将Github/zhangsan同步到Gitee/zhangsan上面。

> 前提条件需要自己电脑的私钥和公钥。gitee的token。私钥和公钥生成可自行百度。
>
> Ps：我不太理解为什么github和gitee的通信需要用电脑的公私钥，可能是需要通过电脑做媒介？未来还需要多多了解。

1. 基于 SSH 配置公钥和私钥，参考或网上N多资料。

2. 将私钥传到 GitHub 仓库，通过设置中的 Secrets 创建一个 `GITEE_PRIVATE_KEY` 变量，将私钥内容拷贝到值区域。

![image-20210405112746555](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210405112746.png)

3. 将公钥（ `id_rsa.pub` ）添加到 `Gitee` 存储库。通过 `Gitee` **个人设置** 中的 `SSH公钥` 创建一个 `hub-mirror` 变量，然后将公钥内容复制到值区域。

![image-20210405113237067](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210405113237.png)

4. 在 Gitee 上创建一个私人令牌（token），这个记得保存，因为它只会出现一次

![image-20210405113429925](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210405113429.png)

5. 类似第 2 步，创建一个 `GITEE_TOKEN` 变量，将私人令牌作为值粘贴进去。

![image-20210405113716590](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210405113716.png)

6. 新建一个Github workflow，在这个workflow里面使用Gitee Mirror Action，复制gitee-repos-mirror.yml文件修改参数即可。

![image-20210403221537067](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210403221537.png)

gitee-repos-mirror.yml

```yaml
name: Gitee repos mirror periodic job
on:
# 如果需要PR触发把push前的#去掉
# push:
  schedule:
    # 每天北京时间9点跑
    - cron:  '0 1 * * *'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Mirror the Github organization repos to Gitee.
      uses: Yikun/gitee-mirror-action@v0.01
      #代表我们用的仓库，不用同步
      with:
        # 必选，需要同步的Github用户（源）
        src: github/Yikun
        # 必选，需要同步到的Gitee的用户（目的）
        dst: gitee/yikunkero
        # 必选，Gitee公钥对应的私钥，https://gitee.com/profile/sshkeys
        dst_key: ${{ secrets.GITEE_PRIVATE_KEY }}
        # 必选，Gitee对应的用于创建仓库的token，https://gitee.com/profile/personal_access_tokens
        dst_token:  ${{ secrets.GITEE_TOKEN }}
        # 如果是组织，指定组织即可，默认为用户user
        # account_type: org
        # 还有黑、白名单，静态名单机制，可以用于更新某些指定库
        # static_list: repo_name
        # black_list: 'repo_name,repo_name2'
        # white_list: 'repo_name,repo_name2'
```

将配置文件中的源和目标设置为你自己的账号即可。

```
src: github/<这里改成自己的GitHub名字>
dst: gitee/<这里改成自己的Gitee名字>
```

上图，大概是每个阶段的原理和最终的效果。现在，这个使用Gitee Mirror Action的workflow已经运行起来了。

## 说再后面

看似小小的一个功能优化也花费了很久的时间，看似仅仅增加了一个自动同步的功能，优化了用户（我）写博客的体验，但中间做的很多事情。致敬伟大的程序员前辈们！

如果把我的博客当成一个产品。那我的产品经历了一下几个阶段。

- [ ] 需求：期望有一个干净独立自己的博客网站（还不用花钱）
- [ ] 实现：[Typora+PicGo+github搭建免费稳定图床写博客如行云流水（mac+window）](https://blog.csdn.net/outman_1921/article/details/106598382?spm=1001.2014.3001.5501)
- [ ] 需求：github的图床加载访问太慢，图片多的文章本根看不到。
- [ ] 解决办法：[Github无法加载或不显示图片问题（window+mac）](https://blog.csdn.net/outman_1921/article/details/106595472?spm=1001.2014.3001.5502)+优化方法：*https://cdn.jsdelivr.net/gh/用户名/图床仓库名*
- [ ] 需求：期望国内网也可以流畅丝滑的访问blog
- [ ] 解决办法：也就是本篇文章所写。

通过发现问题也借此了解了很多知识，github竟然还有Action这么神奇的功能，感觉很有趣。回想起之前只会git clone就太狭隘了。有时间还是要多多了解这些东西，以及背后的原理。任何事物的出现和发展都是有其必然原因和规律。就像伟大的git诞生一样。（这样说突然想学习一下程序的历史，给自己发个坑有空了解一下，也可以用自己的语言写一篇历史故事，感觉会蛮有趣。 - - ）

一个产品的本质就是有需求才会推动实现，而为了实现需要尝试很多方法，学习很多知识。

我料想，人生也应如是。

