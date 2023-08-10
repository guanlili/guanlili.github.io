---
layout: post
title: "imock开发指南"
subtitle: "从0到1搭建一个mock平台"
author: "guanlili"
header-img: "img/about-bg.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - jvm-sandbox
  - imock

---

# imock开发指南

团队今年的指标是为公司提供一个方法级的mock平台， 这个重要的任务落在了我的身上。

## 0、明确团队的需求

- 支持java后端服务方法级别的mock，对没有测试环境的第三方服务进行mock，增加团队覆盖率。
- 启用，返回用户自定义的mock响应结果
- 停用，返回服务本身的结果

通过一系列调研，最终工具选型了基于 jvm-sandbox的mock服务，是Java方法级别的mock，操作就是监听指定方法，返回指定的mock内容。

## 1、项目介绍

imock 包含mock-module、mock-web ,mock-module就是jvm-sandbox的模块，需要安装到目标应用服务器，mock-web 为mock服务后台，imock是前后端分离，还有一个前端react 项目 imcok-web

ume_mock_backend :http://git1.local.umetrip.com/guanhongli/ume_mock_backend

ume_mock_frontend :http://git1.local.umetrip.com/guanhongli/ume_mock_frontend

## 2、imock使用

首先将前后端项目都跑起来，安装依赖啥的先把环境调通。

### 2.1、启动imock-web

本地环境：直接idea启动即可

容器环境：java -jar启动

```
nohup java -jar /opt/applog/MskyLog/mock/mock-web.jar > myout.txt 2>&1 &
```

### 2.2、准备mock-module

#### 2.2.0.本地安装

到项目下的bin目录执行  install-local.sh，通过脚本编译mock-module，如需修改代码要重新执行此脚本。

#### 2.2.1.修改cfg 

```
# 心跳上报配置  当环境变量没有配置的时候使用 该配置
# mock 服务的地址和端口
mock.host=http://172.24.146.219:8003
# 标识目标应用的名称
app.name=test-umeapp-checkin
# 标识目标应用的环境
app.env=test-umeapp-checkin
```

#### 2.2.2.拷贝到sandbox-module目录

将cfg和mock-module拷贝到sandbox/sandbox-module目录下。

```
cd /opt/applog/MskyLog/mock
cp /opt/applog/MskyLog/mock/mock-module.jar  /opt/app/sandbox/sandbox-module
cp -r /opt/applog/MskyLog/mock/cfg  /opt/app/sandbox/sandbox-module
```

#### 2.2.3.拷贝到.sandbox-module目录

```
cp /opt/applog/MskyLog/mock/mock-module.jar /opt/app/.sandbox-module
```

#### 2.2.4.创建mock日志目录

```
mkdir -p /home/jboss5/logs/sandbox/mock/
```

### 2.3、attch挂载目标应用

jps命令查看pid

```
cd /opt/app/sandbox/bin/
./sandbox.sh -p 22
```

### 2.4、查看log

2.4.1、查看sandbox.log

```
tailf /opt/applog/MskyLog/sandbox/sandbox.log
```

2.4.2、查看mock.log

```
tailf /home/jboss5/logs/sandbox/mock/mock.log
```

2.4.3、查看服务log

> 结合log和error日志来看

```
tailf /opt/applog/MskyLog/UmeCki/UmeCki_info.log
tailf /opt/applog/MskyLog/UmeCki/UmeCki_trace.log
tailf /opt/applog/MskyLog/UmeCki/UmeCki_err.log
```

## 3、遇到的问题

### 3.1、mock切面问题，增加before返回

看代码mock逻辑是在afterReturning中实现的，这样的话是不是原代码逻辑还是会执行，只是修改了返回给调用方的Object或者Exception。比如我想mock调用银行支付逻辑，但是还是会实际支付，所以切面放在before(Advice advice)并且结合returnImmediately会不会效果更好。

作者的代码afterReturning方法是通过advice.getReturnObj().getClass()来获取类，然后把ro.getReturnData()序列化到对象中。

- 如果before方法，则advice.getReturnObj()为空，空指针无法获取类对象。
- 如果mock方法的值返回为空，则依然无法获取对象类型。

因此需要换一个方法获取类对象

使用advice.getTarget()方法来获取对象类型，使用advice.getBehavior()获取方法名称。

```java
Method method = advice.getTarget().getClass().getMethod(advice.getBehavior().getName());
returnType = method.getGenericReturnType();
LogUtil.info2("returnType=", String.valueOf(returnType));
Object res1 = JSON.parseObject(ro.getReturnData(), returnType);
LogUtil.info2("res1=", res1.toString());
```

但经过测试只有springboot可以用，dubbo接口advice.getTarget()为空。

> 在 Dubbo 中，`advice.getTarget()` 返回 `null` 可能是由于 Dubbo 的代理机制导致的。Dubbo 使用代理对象来实现远程服务的调用，代理对象是在运行时动态生成的，而真正的目标对象是通过 Dubbo 的远程调用机制获取的。因此，在 Dubbo 的 Advice 中，`advice.getTarget()` 返回的是代理对象，而不是真正的目标对象。由于代理对象并不是目标对象本身，因此可能返回 `null`。
>
> 在 Spring Boot 中，`advice.getTarget()` 返回的是目标对象，因为 Spring Boot 使用的代理机制与 Dubbo 不同。Spring Boot 中的 AOP 代理通常是通过 JDK 动态代理或 CGLIB 生成的，这些代理对象会保留对目标对象的引用，因此在 Advice 中调用 `advice.getTarget()` 可以获取到目标对象的引用，不会返回 `null`。

接着找其他的办法。。。

通过advice.getBehavior().getReturnType()

```
Method method = advice.getBehavior().getReturnType().getMethod(advice.getBehavior().getName());
```

完美解决！

```
// 获取方法的返回对象类型
Object res1 = JSON.parseObject(ro.getReturnData(), advice.getBehavior().getReturnType());
LogUtil.info2("res1=", res1.toString());
```

### 3.2、报错time字段不为空

解决办法：修改数据库让字段可以为空。

### 3.3、imock-web

java.lang.TypeNotPresentException: Type org.springframework.boot.maven.RepackageMojo not present

## 4、说在后面

至此，通过本地调试，二次开发imock已经能够符合我们公司的需求，后续再针对个性化的需求进行开发。

