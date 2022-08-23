# Spring boot学习笔记

为什么spring boot？

- 因为spring,springMVC需要使用大量的配置文件（XML文件），还需要配置各种对象，把对象放在容器中才能使用对象。需要了解其他框架规则。
- spring boot 开箱即用，不需要配置文件，常用的框架和第三方库都配置好了。开发效率高。
- spring的扩展，使开发，测试和部署更加方便。

特性：

- 创建独立的 Spring 应用程序
- 直接嵌入 Tomcat、Jetty 或 Undertow（无需部署 WAR 文件）
- 提供自以为是的“入门”依赖项以简化您的构建配置
- 尽可能自动配置 Spring 和 3rd 方库
- 提供生产就绪功能，例如指标、健康检查和外部化配置
- 完全无需代码生成，无需 XML 配置

微服务：一个项目可以由多个小项目组成

快速开发微服务，简化j2ee开发，整合spring技术栈

准备工作：jdk， maven

## 注解

javaConfig:使用java类作为xml配置文件的替代，是配置spring容器的纯java的方式，在这个java类可以创建java对象，把对象放入spring容器中（注入到容器）

使用两个注解：

@configuration:放在一个类的上面，表示这个类是作为配置文件使用的。

@bean:声明对象，把对象注入到容器中。相当于<bean标签>

```java
/**
 * @version 1.0
 * @auther guanhongli
 * @date 2022/8/22 4:21 PM
 *
 * Configuration:表示当前类是作为配置文件使用的，就是用来配置容器的。
 * 位置：在类的上面
 * SpingConfig这个类就相当于beans.xml
 */
@Configuration
@ImportResource(value = "classpath:applicationContext.xml")
public class SpingConfig {
    /**
    *创建方法，放大的返回值是对象，在方法的上面加入@Bean
    * 方法的返回值对象就注入到容器中。
    *
    * @bean:把对象注入到spring容器中，作用相当于<bean>
     *     位置：方法的上面。
     *     说明：@bean,不指定独享的名称，默认是方法名是id
    * **/
    @Bean
    public Student creatStudent(){
        Student s1 =new Student();
        s1.setName("张三");
        s1.setAge(19);
        s1.setSex("男");
        return s1;
    }
    //指定对象在容器中的名称(指定<bean>的id属性) @Bean的name属性，指定对象名称（id）
    @Bean(name = "lisiStudent")
    public Student makeStudent(){
        Student s1 =new Student();
        s1.setName("李四");
        s1.setAge(19);
        s1.setSex("男");
        return s1;
    }
}
```

**@ImportResource**

作用导入其他的xml配置文件

```
<import resources="其他配置文件"/>
```

例如

```
@ImportResource(value = "classpath:applicationContext.xml")
public class SpingConfig {
}
```

@PropertyResource

@PropertyResource:读取properties属性配置文件，使用属性配置文件可以实现外部化配置。在程序代码之外提供数据。

步骤：

- 在resources目录下，创建properties文件，使用k=v的格式提供数据
- 在PropertyResource指定properties文件的位置
- 使用@Value(value="${key}")



```
@Configuration
@ImportResource(value = "classpath:applicationContext.xml")
@PropertySource(value = "classpath:config.properties")
@ComponentScan(basePackages = "com.example.demo.vo")
public class SpingConfig {}
```

### @RequestMapping

@RequestMapping 是 Spring Web 应用程序中最常被用到的注解之一。这个注解会将 HTTP 请求映射到 [MVC](https://so.csdn.net/so/search?q=MVC&spm=1001.2101.3001.7020) 和 REST 控制器的处理方法上。 













