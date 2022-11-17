---
layout: post
title: "记mysql+springboot中emoji表情的存储之路"
subtitle: "遇到的一个bug"
author: "guanlili"
header-img: "img/about-bg.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - mysql
  - springboot
---

## 记mysql+springboot中emoji表情的存储之路

> 通过这个问题，以后mysql建表和设置字段字符集时，一律采用utf8mb4，保证没毛病！

## 问题背景

在公司接手了一个新的项目，同事反馈了一个"bug"，手误输入的emoji表情，无法更新到数据库中，导致后续一连串的问题....

## 问题原因

查阅资料后发现，mysql中的“UTF-8”只支持最大3字节的字符，正经的UTF-8是可以支持4字节的字符的！也就是说，MySQL数据库的 “**utf8**”是赝品啊！真正的编码是**utf8mb4**！！

在数据库中验证一下

```sql
SHOW VARIABLES LIKE 'character%';
```

果然server和database都是utf8

既然明确了问题的原因，那么就容易解决了。解决方案就是将mysql编码从utf8转换成utf8mb4

## 解决办法

1.设置数据库的编码

```sql
set @@character_set_server='utf8mb4';
set @@character_set_database='utf8mb4';
```

不过“SET NAMES utf8mb4”作用只是临时的，MySQL重启后就恢复默认了

2.设置表的编码

```sql
ALTER TABLE tb_action CONVERT TO CHARACTER SET utf8mb4;
```

3.springboot代码中连接池增加两行代码设置

```java
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName(driverClass);
        //支持表情
        StringTokenizer tokenizer=new StringTokenizer ("SET NAMES utf8mb4",";");
        dataSource.setConnectionInitSqls(Collections.list(tokenizer));
```

大功告成！可以愉快的插入emoji表情了。

![image-20221117222305230](https://blog-1258476669.cos.ap-beijing.myqcloud.com/cos-pictureBed/image-20221117222305230.png)

> 不过插入完数据库显示？？ 但实际上是已经插入成功了！也可以读取得到。

## 参考资料

[Mysql中“utf-8”和"utf8mb4"的区别与使用场景](https://blog.csdn.net/qq_29180565/article/details/97892680)

[Mysql 不能存储特殊字符](https://www.jianshu.com/p/3a339d080b4e)

