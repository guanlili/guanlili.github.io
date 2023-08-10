---
layout: post
title: "使用基于jvm-sandbox的对三层嵌套类型的改造"
subtitle: "遇到的一个bug"
author: "guanlili"
header-img: "img/about-bg.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - jvm-sandbox
  - mock
---

# 使用基于jvm-sandbox的对三层嵌套类型的改造

## 问题背景

先简单介绍下基于`jvm-sandbox`的imock工具，是Java方法级别的mock，操作就是监听指定方法，返回指定的mock内容。

`jvm-sandbox` 利用字节码操作和自定义类加载器的技术，将原始方法替换为模拟代码，从而在应用程序中实现方法级别的模拟。这种方法非常强大，但也需要对字节码操作、类加载机制和 JVM 内部原理有一定的理解。

公司要搭建一个方法级别的后端mock平台，因此我在imock的基础上进行二次开发进行使用。

## 问题描述

在mock某个三方接口的方法时遇到报错：ava.lang.ClassCastException: com.alibaba.fastjson.JSONObject cannot be cast to com.travelsky.angeldoe.output.PassengerFlightInfo

看样子是本来应该是JSONObject 无法转化成PassengerFlightInfo类型，通过日志排查问题，定位到报错代码。

```Java
PassengerFlightInfo passengerFlightInfo = JSON.parseObject(out
 .getPassengerFlightInfoList().get(0).toString(), PassengerFlightInfo.class);
```

线上服务没有报错，测试mock环境报错，那么显然是数据的问题，通过Arthas追踪方法返回的bean对比发现，差异就是线上的PassengerFlightInfo是一个bean，测试的PassengerFlightInfo是一个object。差异由此出现。

![image-20230810214520907](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20230810214520907.png)



![image-20230810231158842](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20230810231158842.png)

**那么问题的关键就在于，如何通过mock工具把object提前转成bean。**

## 解决方案

改造mock agent工具思路：通过我们的mock-module.jar实现。

1. 根据PsrInfoOutputBean初步解析returnObject，获取list中的object
2. 将object解析成PassengerFlightInfo，再通过反射技术将bean反射回PsrInfoOutputBean

## 代码实现

```Java
//针对cki特殊类型PsrInfoOutputBean
case 3:
    //获取advice返回类型的类加载器
    ClassLoader behaviorClassLoader = advice.getBehavior().getReturnType().getClassLoader();
    //加载最外层PsrInfoOutputBean
    Class<?> targetClass = behaviorClassLoader.loadClass(ro.getClassNames()[0]);
    LogUtil.info2("targetClass=", targetClass.toString());
    //根据目标类解析returnData
    Object res1 = JSON.parseObject(ro.getReturnData(), targetClass);
    //赋值保存做对比
    Object res0 = res1;
    LogUtil.info2("res1-before=", res1.toString());
    // 通过反射获取passengerFlightInfoList
    List<Object> passengerFlightInfoList = (List<Object>) targetClass.getMethod("getPassengerFlightInfoList").invoke(res1);
    LogUtil.info2("passengerFlightInfoList=", passengerFlightInfoList.toString());
    if (!passengerFlightInfoList.isEmpty()) {
        // 获取 passengerFlightInfoList 列表中的第一个元素
        Object firstPassengerFlightInfoList = passengerFlightInfoList.get(0);
        LogUtil.info2("firstPassengerFlightInfoList=", firstPassengerFlightInfoList.toString());
        // 将 firstFlightInfo 转换成 JSON 字符串
        String firstFlightInfoJson = JSON.toJSONString(firstPassengerFlightInfoList);
        // 获取第三层额外目标 Bean 类的类名，使用同一类加载器
        Class<?> targetBeanClass = behaviorClassLoader.loadClass(ro.getClassNames()[2]);
        LogUtil.info2("targetBeanClass=", targetBeanClass.toString());
        //根据类解析成bean
        Object targetBean = JSON.parseObject(firstFlightInfoJson, targetBeanClass);
        LogUtil.info2("targetBean=", targetBean.toString());
        // 创建一个新的passengerFlightInfoListNew 将 targetBean 添加到 passengerFlightInfoList 中
        List<Object> passengerFlightInfoListNew = new ArrayList<>();
        passengerFlightInfoListNew.add(targetBean);
        // 设置 passengerFlightInfoList 属性回 res1
        try {
            // 执行反射方法,把passengerFlightInfoListNew反射回res
            Method method = targetClass.getMethod("setPassengerFlightInfoList", List.class);
            method.invoke(res1, passengerFlightInfoListNew);
        } catch (Exception e) {
            // 捕获异常并打印日志
            LogUtil.info2("Error occurred while invoking method:=", e.getMessage()+"｜"+e);
        }
    }
    LogUtil.info2("前后的两个类equals吗？=", String.valueOf(res1.equals(res0)));
    LogUtil.info2("res1-after=", res1.toString());
    ProcessController.returnImmediately(res1);
    break;
```

## 遇到的坑

外部获取的类名不能直接通过Class.forName加载，如下代码所示：

```Java
 // 使用目标 Bean 类名解析 JSON 字符串成目标 Bean
        Class<?> targetBeanClass = Class.forName(targetBeanClassName);
```

实际会报错："message": "com.taobao.rigel.rap.model.PsrInfoOutputBean cannot be cast to com.taobao.rigel.rap.model.PsrInfoOutputBean", 原因是这两个bean虽然名字一样，但是类加载器不同，就导致bean的实际是不一样的。类是否相同可以用equals进行判断。

因此正确的做法是，先获取advice返回类型的类加载器，然后加载我们所需要的类，这样业务的代码就会认得我们的bean了。

```Java
   //获取advice返回类型的类加载器
    ClassLoader behaviorClassLoader = advice.getBehavior().getReturnType().getClassLoader();
    //加载最外层PsrInfoOutputBean
    Class<?> targetClass = behaviorClassLoader.loadClass(ro.getClassNames()[0]);
```

## 题外话：

##### 为啥出现了这个错误？

出现这个报错和开发的强转类型也有关系，本地做了个小测试，同样的数据。（但咱也没发改开发的代码，只能提提建议。 = =）

1、当前异常转化：按照开发业务代码中的list强转对象

>  `List<Object> list = JSON.*parseArray*(jsonString); PassengerFlightInfo passengerFlightInfo = (PassengerFlightInfo) list.get(0);`
>
> 这是使用强制类型转换的方式，直接将 `list` 中的第一个元素强制转换为 `PassengerFlightInfo` 对象。这种方式在编译时不会报错，但如果 `list` 中的第一个元素不是 `PassengerFlightInfo` 对象，则会在运行时抛出 `ClassCastException` 异常。

2、正常转化：优化过后用toJavaObject方法 

> `PassengerFlightInfo passengerFlightInfo = ((JSONObject) list.get(0)).toJavaObject(PassengerFlightInfo.class);`： 这是使用 FastJSON 提供的 `toJavaObject` 方法，将 `JSONObject` 类型转换为 `PassengerFlightInfo` 对象。这种方式在运行时会检查转换是否可行，如果 `JSONObject` 不包含 `PassengerFlightInfo` 的属性或结构不匹配，会抛出异常。这种方式更安全，因为它提供了更多的转换检查。

推荐使用第二种方式，因为它更加健壮和安全，能够更好地处理可能出现的异常情况，并提供更好的错误信息。