# UmeAPI

【✊基础篇NO9】如何使用UmeAPIhttps://i2wp4yetps.feishu.cn/docs/doccnfodLGR3xCFnirTjnPX05xg?bk_entity_id=enterprise_34549180#HLiWLd

UmeAPI Plus平台梳理https://i2wp4yetps.feishu.cn/docs/doccnAbvV3WQ3viQV8tONOOHWOe

## 1、UME API 是什么?

UME API 通过GUI工具帮助WEB工程师更高效的管理接口文档，同时通过分析接口结构自动生成Mock数据、校验真实接口的正确性，使接口文档成为开发流程中的强依赖。有了结构化的API数据，可以避免更多重复劳动。

## 2、为啥要做接口管理平台

根本原因在于前后端分离，那么自然就绕不开接口测试。

先聊一聊前端和后端分离的优点。前后端分离优点如下：

- 真正的实现前后端解耦，前端服务器使用 nginx；
- 易于发现bug，可以快速定位是谁的问题，不会出现互相踢皮球的现象；
- 减少后端服务器的并发/负载压力；
- nginx 支持热部署，不用重启服务器，前端无缝升级；
- 增加代码的维护性&易读性（前后端耦合在一起的代码读起来相当费劲）；

但在这个过程之中，不可避免的就是需要定制好接口文档，由于前后端分离开发往往出现接口更改的情况，对于接口文档管理很不方便，因此需要一个类似“中间件”的角色，对接口文档进行统一的管理，前后端都以接口管理平台的定义为准，这就是UME API!

> 后端工程师要写好单元测试，推荐使用 chrome 的插件 postman 或 soapui或 jmeter，service 层的测试用例拿 junit 写。 

## 3、市场竟品分析

### Swagger

Swagger 是一套基于 OpenAPI 规范（OpenAPI Specification，OAS）构建的**开源工具**，可以帮助我们设计、构建、记录以及使用 Rest API。

Swagger是一个大型的API开发者的工具框架，该框架提出了一个编写OpenAPI的规范（命名为OAS），并且Swagger可以跨整个API生命周期进行开发，从设计和文档到测试和部署。 Swagger框架三核心：

- 提供了一个编写API文档的规范 ，称为OAS ，在规范中明确API的格式和一些编写要素；
- 提供相关的工具，对API文档的编写提供辅助。主要是这么几个项目 Swagger Editor、SwaggerUI、Swagger Codegen、Swagger Inspector；
- 提供对各种流行语言和框架的集成，例如集成SpringMVC 的 springfox 框架；

### YApi

https://www.jianshu.com/p/2e2a4f5a6864

http://yapi.smart-xwork.cn/

https://github.com/YMFE/yapi

### eoLinker

Eolinker是国内企业级IT研发管理解决方案服务品牌，在线API接口管理服务供应商，致力于满足各行业客户在不同应用环境中对研发管理全生命周期的个性化需求，提供API开发管理（AMS）、开发团队协作、自动化测试、网关（AGW）以及监控（AMT）等服务。 特性：

https://www.eolink.com/

### Eoapi（开源）

Eoapi 是一个可扩展的 API 开发工具。Eoapi 集合基础的 API 管理和测试功能，并且可以通过插件简化你的 API 开发工作，让你可以更快更好地创建 API。

官网：[一个可拓展的开源 API 工具 | Eoapi](https://link.zhihu.com/?target=https%3A//www.eoapi.io/%3Futm_source%3DZH-0501)

手册：https://docs.eoapi.io/index.html

github：https://github.com/eolinker/eoapi

### RAP2接口管理工具

阿里妈妈前端团队出品的开源接口管理工具RAP第二代，RAP通过GUI工具帮助WEB工程师更高效的管理接口文档，同时通过分析接口结构自动生成Mock数据、校验真实接口的正确性，使接口文档成为开发流程中的强依赖。有了结构化的API数据，RAP可以做的更多，而我们可以避免更多重复劳动。基于RAML的接口定义、文档生成、Mock Server完成了定义和使用的分离，通过一套规范完成的接口定义，可以用不同的工具得到适应不同API管理系统的输出，有更多的可能性，同时保持了核心定义不变。RAP较之于RAML，前者更加集中，所有的定义、文档、mock都在同一个服务中完成，并且实时生效，方便快捷，如果只考虑方便易用，RAP是更好的选择，而RAML显得更加繁琐，更适合于公开的接口定义，方便在各个系统之间流转。

http://rap2.taobao.org/

https://github.com/thx/rap2-delos

### DOClever

http://www.doclever.cn/controller/download/download.html

https://github.com/sx1989827/DOClever

### itest敏捷测试管理软件

https://gitee.com/itestwork/itest

https://www.oschina.net/p/itest-cn

### apipost7

功能强大，收费。

API设计、API调试、自动化测试、API文档

### Apifox

https://www.apifox.cn/

## 4、UME API技术栈

前端：抄Yapi

后端：抄RAP1

## 5、UME API的现有功能

1. 提供API管理，层级结构分为四层：团队、产品、小组、模块。可在模块里面API说明文档，包含请求参数，返回参数，测试数据。

2. 支持API沙箱测试，调用远程接口测试。

3. 远程测试支持get、post。其中post传递参数支持字节流和表单。



## UmeAPIPlusServer目录结构

src 后端源代码

- com.taobao.rigel.rap 该命名空间下为各个模块
  - annotation 注解
  - aspect 
  - cmdb 回调cmdb
  - config 配置相关
  - controller 控制层
  - httprequest 开发者调试api
  - mapper dao数据访问层接口
  - model 实体对象
  - redisdao redis数据层（已废弃）
  - security 权限加密
  - service 业务层
  - timer 定时器
  - UmeApiPlusApplication 启动类
  - UmeManagerment （废弃）
  - utils 工具类
  - validator 校验工具

- resources资源文件
  - application.properties 数据库配置信息
  - application.yml redis配置信息
  - env.properties 环境配置信息，没啥用
  - logback-spring.xml 记录日志
  - mapper11
  - templates





问题：为什么要同时存在properties 和yml配置文件？是否会有冲突。