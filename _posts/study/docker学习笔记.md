# docker学习笔记

## 前言

由于毕设需要在docker环境上开发和运行，故在此记录一下自己学习docker的笔记。学习教程狂神学java的教程。

## Docker概述

### Docker为什么会出现？

所有的技术出现的本质都是为了解决现有的问题。

#### 传统开发运维

一款产品：开发-上线，两套环境，应用环境，应用配置。

开发运维：由于版本更新导致服务不可用。

环境配置十分麻烦，每个机器都要部署环境，（redis,es,hadoop）费时费力。

发布一个项目，jar+(redis mysql jdk es)项目能不能带上环境打包。

传统：开发jar，运维来做。

#### 有了docker后的运维开发

现在：开发打包部署上线，一套流程做完。

Java-apk-发布（应用商店）--使用apk-安装即可用

Java-jar(环境)--打包项目带上环境（镜像）--docker仓库：商店--下载我们发布的镜像--直接运行即可

docker给以上问题提供解决方案。

Docker的思想来自于集装箱.

Docker的核心思想，打包装箱，每个箱子相互隔离的。

通过隔离的机制，可以把服务器利用极致。

### Docker的历史

2010年，几个搞it的年轻人，在美国成立了一家公司dotcloud，做一些pass的云计算服务，lxc有关容器的技术。

他们将自己的技术（容器化技术）命名就是docker！

docker刚刚诞生的时候，没有引起行业的注意！dotcloud就活不下去！

开源。

2013年docker开源！越来越多的人发现了docker的优点！火了！

2014年4月9日，docker1.0发布。

docker为什么这么火？十分的轻巧。

在容器技术出来之前，用的都是虚拟机技术。

虚拟机：在window中装一个vmware，通过这个软件我们可以虚拟出来一个电脑或者多台电脑，笨重。

Vm：linux centos原生镜像（一个电脑）隔离，需要开启多个虚拟机。几个g 几分钟。

Docker：隔离，镜像（最核心的环境4m+jdk+mysql）十分的小巧，运行景象就可以了，小巧！几个m kb 秒级启动。

虚拟机也是属于虚拟化技术。docker容器技术，也是一种虚拟化技术。

docker是基于go语言开发的！开源项目！

官网：https://www.docker.com/

文档地址：https://docs.docker.com/文档超级详细。

仓库地址：https://hub.docker.com/

传统的虚拟机技术：

虚拟出一条硬件，运行一个完整的操作系统，然后在这个系统上安装和运行软件。

资源占用十分多。

冗余步骤多。

启动很慢。

容器化技术：

容器化技术不是模拟一个完整的系统。容器内的应用直接运行在宿主机的内容，容器是没有自己的内核的，也没有虚拟我们的硬件，所以轻便了。

每个容器相互隔离，每个容器内部都有一个属于自己的文件系统，互不影响。

### DevOps(开发运维)

**应用更快速的交付和部署**。

传统：一堆帮助文档，安装程序

docker：打包镜像发布测试，一件运行

**更便捷的升级和扩缩容**。

使用了docker之后，我们部署应用就和搭积木一样。

项目打包为一个镜像，扩展，服务器A 服务器b

**更简单的系统运维**

在容器化后，我们的开发，测试环境都是高度一致。

**更高效的计算资源利用**

docker是内核级别的虚拟化，可以再一个物理机上运行很多的容器实例，服务器的性能可以压榨到极致。

## Docker安装和使用

### Docker基本组成

客户端

服务器

仓库

![image-20210505223147899](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210505223148.png)

镜像（image）：

docker镜像就好比一个模板，可以通过这个模板来创建容器服务，tomcat镜像-->run-->tomcat01容器（提供服务器），通过这个镜像可以创建多个容器（最终服务运行或者项目运行就是在容器中的）

容器（container）:

docker利用容器技术，独立运行一个或者一个组应用，通过镜像来创建的。

启动，停止，删除，基本命令。

目前就可以把这个容器理解为一个简单的linux系统。

仓库（repository）:

仓库就是存放镜像的地方！

仓库分为公有仓库和私有仓库！

Dockerhub（默认国外的）

阿里云都有容器服务。（配置镜像加速。）

### 安装docker

环境准备

1.需要会liunx

2.CentOS7

3.通过服务器进行操作

环境查看

```
#内核版本
[root@341948a79776 ~]# uname -r
3.10.0-514.16.1.el7.x86_64
```

```
#系统版本
[root@341948a79776 ~]# cat /etc/os-release
NAME="CentOS Linux"
VERSION="7 (Core)"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="7"
PRETTY_NAME="CentOS Linux 7 (Core)"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:7"
HOME_URL="https://www.centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"

CENTOS_MANTISBT_PROJECT="CentOS-7"
CENTOS_MANTISBT_PROJECT_VERSION="7"
REDHAT_SUPPORT_PRODUCT="centos"
REDHAT_SUPPORT_PRODUCT_VERSION="7"
```

帮助文档

1. 卸载旧的版本

```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

2. 需要的安装包。

```
yum install -y yum-utils
```

3. 设置镜像的仓库

```
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
    #默认是国外的
 yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
#用阿里云的
```

4. 更新yum软件包索引

```
yum makecache fast
```

5. 安装docker相关内容，docker-ce社区版 ee企业版。

```
yum install docker-ce docker-ce-cli containerd.io
```

6. 启动docker 

```
systemctl start docker
```

7. Hello world

```
docker run hello-world
```

卸载docker

1. 卸载依赖

```
 sudo yum remove docker-ce docker-ce-cli containerd.io
```

2. 删除资源

```
 sudo rm -rf /var/lib/docker
 sudo rm -rf /var/lib/containerd
```

阿里云官方镜像加速



## Docker常用命令



