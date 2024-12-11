---
layout: post
title: "航旅mock质量体系建设"
subtitle: "航旅mock质量体系建设"
author: "guanlili"
header-img: "img/about-bg.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - Mock
  - 测试开发
  - 质量保证
---

# 航旅Mock质量体系建设

## 1. 什么是mock测试

作为一个动词，mock是模拟、模仿的意思；作为一个名词，我们也可以将其理解成 “虚假数据”，或者 “真实数据的替身”。

在软件测试中，mock所模拟的对象是什么呢？

它一定不是我们所测试的对象，而是 SUT 的依赖（dependency）。换句话说，mock 的作用是模拟 SUT 依赖对象的行为。

> 测试的对象一般称之为`SUT(Software Under Test)`

文字不好理解，我们画个图，如下图所示，被测试对象是 A，A 依赖的是B，B 依赖的是 C。而我们要 mock 的是 B 的行为。图中 A 就是 SUT。

![img](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/198abaa05a6c7fb520047bda309a0887.png)

**为什么需要模拟 B 的行为呢？**

- （1）提高 A 的测试覆盖率。A 依赖 B，本质上依赖的是 B 的返回结果，也就是说 B 的返回结果会影响 A 的行为。通过 mock B 我们可以构造各种正常和异常的来自 B 的返回结果，从而更充分测试 A 的行为。
- （2）避免 B 的因素从而对 A 产生影响。依赖真实的 B 去测试 A 可能有很多问题：B 的开发没有完成时无法测试 A；B 有阻塞性bug 时无法测试 A；B 的依赖 C 有阻塞性 bug 时无法测试 A；
- （3）提高 A 的测试效率。B 的真实行为可能很慢，而 B 的模拟行为是非常快的，因此可以加快 A 的测试执行速度。



mock测试在需求生命周期中的定位

测试环境的重要性：随着业务的发展和持续交付成熟度的提升，测试环境是线下一切研发测试活动的基础！



![umeMock系统架构图-需求生命周期.drawio](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/umeMock%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E5%9B%BE-%E9%9C%80%E6%B1%82%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.drawio.png)

mock测试是贯穿开发和测试流程中的重大利器。

为什么使用Mock

综上，Mock是为了解决不同的单元之间由于耦合而难于开发、测试的问题。所以，Mock既能出现在单元测试中，也会出现在集成测试、系统测试过程中。Mock 最大的功能是帮你把单元测试的耦合分解开，如果你的代码对另一个类或者接口有依赖，它能够帮你模拟这些依赖，并帮你验证所调用的依赖的行为。

1.解除依赖，团队并行工作

接口尚未开发完成，在系统交互双方定义好接口之后，我们可以提前进行开发和测试，并不依赖上游系统的开发实现。

2.开启TDD模式，即测试驱动开发

单元测试是TDD的基石，当接口定义好后，测试人员就可以创建一个Mock，把接口添加到自动化测试环境中，提前创建测试。

3.隔离系统

通过编写Mock，隔离请求操作（Get、Post）对于数据库中数据的污染。

4.提升测试覆盖度

通过Mock接口返回的不同状态，来查看系统是否能够正常影响，提升测试的覆盖度。

5.方便演示

通过使用Mock模拟数据接口，我们即可在只开发了UI的情况下，无须服务端的开发就可以进行产品的演示。

除此之外，Mock可以加深我们对测试的理解，深入明白测试“输入”和“输出”的不同表达形式，同时还能提高自身技术，脱离功能测试对于开发的依赖。

## mock体系顶层设计原则

隔离安全

- 测试环境与线上隔离
- 测试行为不影响线上服务及数据
- 不同研发阶段的测试环境相互隔离。

方便易用

- 测试环境需要支持本地直接链接
- 支持远程debug
- 可快速构造测试数据

支持需求并发

- 环境按需求隔离
- 存在长期稳定测试环境

服务完备

- 同一业务线内服务是完备的。
- 跨业务联调服务是完备的

环境仿真度高

- 避免因为数据、配置问题导致测试失真。



## 2. 什么是umeMock

umeMock 服务是基于阿里测试中间件[jvm-sandbox](https://github.com/alibaba/jvm-sandbox)开发的一款mock服务，umeMock 与其他mock 方式不一样， 是**Java方法级别的mock**，操作就是监听指定方法，返回指定的mock内容。通过数据模拟工具，以提供更快速的开发和测试体验。



![img](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/8d26c144c7cc0a3a13fc5b909aed4f37.png)

从下往上依次解释一下：

- （1）`方法级别 mock`：mock 的对象是一个函数调用，例如获取系统环境变量。
- （2）`类级别 mock`：mock 的对象是一个类，例如一个 HTTP server。
- （3）`接口级别 mock`：mock 的对象是一个 API 接口。
- （4）`服务级别 mock`：mock 的对象是整个服务。比如前端工程师自测试时，可以讲后端整个服务都 mock 掉，这其实等同于将后端的所有接口都 mock

## 3. 为什么要做umeMock

### 痛点

- 缺乏第三方测试环境：有些业务强依赖第三方没有测试环境（如航信），只能通过购买真票才能测试。
- 开发测试成本高： 开发测试人员往往需要构造复杂的长链路来测试一个小功能，无法快速定位和修复问题。
- 覆盖率达到瓶颈： 很多业务场景缺乏测试环境，导致测试覆盖率难以提高，难以保证业务的质量。
- 开发测试迭代效率慢：开发人员往往因为等待外部服务而导致的开发迟滞，无法快速开发和验证新功能，开发效率不够高。

### 解决方案

- 解决第三方服务缺乏测试环境的问题：umeMock致力于方法级别的mock测试，监听被调用的方法，通过构建合适的mock环境，能够在没有实际服务的情况下进行系统测试和验证。
- 降低开发测试成本： 后端mock可以极大地降低开发测试的成本。开发人员不再需要构造复杂的长链路来测试一个小功能，而是可以通过mock数据直接进行单元测试和集成测试，从而快速定位和修复问题。
- 提升测试覆盖率： 通过umeMock我们可以模拟各种场景，从而增加测试覆盖范围，确保各种情况下的代码逻辑都得到验证。
- 提高开发人员效率： umeMock能够加速开发迭代过程。开发人员可以在不依赖实际服务的情况下，快速开发和验证新功能，减少因为等待外部服务而导致的开发迟滞。

## 4. 怎么用umeMock

如何使用 UmeMock 平台。

### 4.1.注入agent到目标应用

#### 4.1.1.修改心跳上报配置

`vi /opt/applog/MskyLog/mock/cfg/mock.properties`

```Plaintext
# 心跳上报配置  当环境变量没有配置的时候使用 该配置
# mock 服务的地址和端口
mock.host=http://172.24.146.219:8003
# # 标识目标应用的名称 命名规范【环境-应用名称】
app.name=test-umeapp-checkin
# 标识目标应用的环境
app.env=test-umeapp-checkin
```

#### 4.1.2.拷贝mock-module.jar

```Plaintext
cd /opt/applog/MskyLog/mock
cp /opt/applog/MskyLog/mock/mock-module.jar  /opt/app/sandbox/sandbox-module
cp -r /opt/applog/MskyLog/mock/cfg  /opt/app/sandbox/sandbox-module
cp /opt/applog/MskyLog/mock/mock-module.jar /opt/app/.sandbox-module
mkdir -p /home/jboss5/logs/sandbox/mock/
```

#### 4.1.3.attch挂载目标应用

```Plaintext
cd /opt/app/sandbox/bin/
./sandbox.sh -p 22
```

![image-20230817133522162](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20230817133522162.png)

服务挂载成功，状态变成运行中。

### 4.2.配置mock数据

1. 选择需要mock的应用及环境
2. 配置需要mock的类名及方法名 （Interface类不支持）
3. 配置这个方法需要的返回值

![image-20230817133500316](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20230817133500316.png)

## 5. 使用案例（值机）

### 5.1.值机业务特点

- 测试环境缺失，只能花钱用真票测
- 业务复杂度高
- 调用链路长
- 与航信服务交互多，
- 对mock的需求较为强烈，甚至通过修改业务代码的方式来进行mock测试。

### 5.2.值机整体链路

![值机业务整体架构-值机整体机构.drawio](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/%E5%80%BC%E6%9C%BA%E4%B8%9A%E5%8A%A1%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84-%E5%80%BC%E6%9C%BA%E6%95%B4%E4%BD%93%E6%9C%BA%E6%9E%84.drawio.png)

![image-20230817142630051](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20230817142630051.png)

### 5.3.整体实现思路

通过对直接系列业务的梳理，可以发现需要真票mock的场景集中于几个方面

- 调用航信的服务：detr和pr,pa,pw等离港指令，
- 自营第三方服务：如动态、行程等
- 数据库相关：db、redis等。

只需要对这些方法进行监听，返回替代的mock数据。

 对每个改动点，为了能够尽可能多的验证真实逻辑，mock的范围要尽量的小，选择最底层方法进行mock。

### 5.4.值机选座协议1400015

选取一个zipkin链路最复杂的协议来讲讲。

#### 5.4.1.工程调用链路

![值机业务整体架构-1400015.drawio](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/%E5%80%BC%E6%9C%BA%E4%B8%9A%E5%8A%A1%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84-1400015.drawio.png)

#### 5.4.2.zipkin调用链路

![image-20230817142540484](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20230817142540484.png)

#### 5.4.3.方法调用流程

![值机mock相关流程图-100015.drawio](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/%E5%80%BC%E6%9C%BAmock%E7%9B%B8%E5%85%B3%E6%B5%81%E7%A8%8B%E5%9B%BE-100015.drawio.png)



## 6. 总结与展望

### 总结下umeMock的特点

1. **隔离测试环境：** 使用 jvm-sandbox，你可以在隔离的环境中进行 Mock，而不会影响到主要的应用程序或系统。这样可以确保你的 Mock 不会对真实环境产生任何影响。
2. **不依赖外部资源：** 在 Mock 过程中，你可以模拟外部服务、数据库、API 等，而无需实际访问这些资源。这可以防止在测试过程中对真实资源造成影响，同时提高了测试的稳定性。
3. **模拟复杂场景：** jvm-sandbox 允许你模拟复杂的场景和条件，包括异常情况、并发操作、不同的环境设置等。这有助于测试应用程序在各种情况下的行为和性能。
4. **轻量级和灵活性：** jvm-sandbox 提供了轻量级的虚拟化环境，允许你快速创建和销毁 Mock 环境。你可以动态配置沙箱环境，适应不同的测试需求。
5. **避免破坏性操作：** 在开发和测试过程中，你可能需要执行某些操作，如删除、修改数据等。使用 jvm-sandbox 进行 Mock 可以避免对真实数据造成破坏，同时保持系统的完整性。
6. **快速业务迭代：** jvm-sandbox 可以帮助你快速迭代和测试不同的功能、场景和数据，加快开发周期。
7. **代码隔离：** 使用 jvm-sandbox 进行 Mock 可以将不同的测试代码隔离，避免对主要应用程序的修改和影响。
8. **可重现性：** 由于 Mock 是在控制的虚拟环境中进行的，你可以轻松地重现相同的测试情景，以便于问题排查和分析。

总的来说，使用 jvm-sandbox 进行 Mock 可以帮助你在安全、隔离的环境中进行测试和开发，模拟各种场景和条件，提高测试效率，同时避免对真实环境产生影响。这为你提供了更大的灵活性和控制权，有助于构建稳健的应用程序。

### 未来展望

能用变得好用。

- 打通devops流水线体系，融入航旅效能体系。
- 完善链路mock，将mock从单点扩展到场景。
- 打通流量录制回放，将线上的数据进行巡检。
- 对特殊数据类型做定制开发的功能，实现更好的兼容。如航信给的数据是list类型，但是list里缺是bean的形式。导致强转报错。
- 定制开发功能：根据下游服务返回数据，自动组装值机数据。



## 参考文献：

干货！用大白话告诉你什么是Mock测试https://www.qinglite.cn/doc/70676475272fe82a9

接口Mock测试https://www.qinglite.cn/doc/12816476fa9fea7d9