# maven学习笔记

## maven简介

apache基金会的项目构建工具

项目构建：项目编译，测试，打包，安装，部署这些过程。

功能：服务于java项目构建，依赖管理和项目信息管理。

## maven特性

### 依赖管理系统

groupId、artifactId、version组成的坐标唯一标识一个依赖。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
  	<version>3.1.0</version>
</dependency>
```

坐标属性

Maven坐标为各种组件引入了秩序，任何一个组件都必须明确定义自己的坐标。 

groupId定义当前maven项目隶属的实际项目-公司名称

artifactId定义maven模块-项目名

version项目所处的版本

### 多模块构建

### 一致的项目结构

解决不同ide带来的文件目录不一致的问题

### 一致的构建模型和插件机制

## maven目录结构

src

- main
  - java
  - resources
- Test
  - java
- pom.xml

pom文件内容

- 自己项目的坐标
- property属性
- 依赖dependencies，其他工具库，框架的gav坐标
- 构建build,控制maven构建项目时的操作，比如编译使用的jdk

## maven命令

Maven的命令格式如下:

```
mvn [plugin-name]:[goal-name]
```

命令代表的含义:执行 plugin-name 插件的 goal-name 目标

| 命令                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| maven -version         | 显示版本                                                     |
| mvn clean              | 清理项目生产的临时文件,一般是模块下的target目录              |
| mvn compile            | 编译源代码，一般编译模块下的src/main/java目录                |
| mvn package            | 项目打包工具,会在模块下的target目录生成jar或war等文件        |
| mvn install            | 将打包的jar/war文件复制到你的本地仓库中,供其他模块使用       |
| mvn deploy             | 将打包的文件发布到远程参考,提供其他人员进行下载依赖          |
| mvn site               | 生成项目相关信息的网站                                       |
| mvn archetype:generate | 创建Maven的普通java项目                                      |
| mvn tomcat7:run        | 在tomcat容器中运行web应用                                    |
| mvn jetty:run          | 调用 Jetty 插件的 Run 目标在 Jetty Servlet 容器中启动 web 应用 |

> 注意:运行maven命令的时候，首先需要定位到maven项目的目录，也就是项目的pom.xml文件所在的目录。否则， 必以通过参数来指定项目的目录。

命令参数

-D 传入属性参数 例如:

mvn package -Dmaven.test.skip=true
 以 -D 开头，将 maven.test.skip 的值设为 true ,就是告诉maven打包的时候跳过单元测试。同理， mvn deploy-Dmaven.test.skip=true 代表部署项目并跳过单元测试。

 -P 使用指定的Profile配置

比如项目开发需要有多个环境，一般为开发，测试，预发，正式4个环境，在pom.xml中的配置如下:

```

```

profiles 定义了各个环境的变量 id ， filters 中定义了变量配置文件的地址，其中地址中的环境 变量就是上面 profile 中定义的值， resources 中是定义哪些目录下的文件会被配置文件中定义的变 量替换。

通过maven可以实现按不同环境进行打包部署，例如: mvn package -Pdev -Dmaven.test.skip=true表示打包本地环境，并跳过单元测试

## maven仓库

仓库存放的内容：第三方jar,自己项目的jar,maven运行时所需要的jar

仓库分为：本地仓库和远程仓库

远程仓库分为三种：中央仓库，私服，其他公共库。

中央仓库是默认下载jar包地方。

> 公司内部应该搭建私服
>
> 稳定，加速，节省带宽

阿里云仓库

```xml
<mirror>
  <id>nexus-aliyun</id>
  <mirrorOf>central</mirrorOf>
  <name>Nexus aliyun</name>
  <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>
```

maven构建多模块项目

maven_parent 基模块，parent (pom)

maven_dao 数据库访问层  jdbc （jar）

maven_service项目的业务逻辑层（jar）

maven_controller用来接收请求，响应数据(war)

## Maven的打包操作

对于企业级项目，无论是进行本地测试，还是测试环境测试以及最终的项目上线，都会涉及项目的打 包操作，对于每个环境下项目打包时，对应的项目所有要的配置资源就会有所区别，对于maven 项目，我们可以用过pom.xml 配置的方式来实现打包时的环境选择，相比较其他形式打包工具，通过maven 只需要通过简单的配置，就可以轻松完成不同 环境先项目的整体打包。
