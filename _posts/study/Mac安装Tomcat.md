# Mac安装Tomcat

## 1.下载安装Tomcat

[Apache Tomcat官网下载](https://tomcat.apache.org/)

版本应该随意。

![image-20220813161305268](https://gitee.com/guanlili1921/picturebed/raw/master/img/image-20220813161305268.png)

## 2.解压缩

```
tar -zxvf apache-tomcat-9.0.65.tar.gz
mv apache-tomcat-9.0.65 ../Library //非必要，移动到Library方便管理
cd Library/apache-tomcat-9.0.65/bin
```

## 3.授权并启动Tomcat

```
sudo chmod 755 *.sh
sudo sh ./startup.sh

Using CATALINA_BASE:   /Users/guanhongli/Library/apache-tomcat-9.0.65
Using CATALINA_HOME:   /Users/guanhongli/Library/apache-tomcat-9.0.65
Using CATALINA_TMPDIR: /Users/guanhongli/Library/apache-tomcat-9.0.65/temp
Using JRE_HOME:        /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
Using CLASSPATH:       /Users/guanhongli/Library/apache-tomcat-9.0.65/bin/bootstrap.jar:/Users/guanhongli/Library/apache-tomcat-9.0.65/bin/tomcat-juli.jar
Using CATALINA_OPTS:
Tomcat started.  //出现这个就是启动成功
```

访问方式：地址栏输入: `http://localhost:8080`,若显示如下界面，则表示成功启动；

![image-20220813163858610](https://gitee.com/guanlili1921/picturebed/raw/master/img/image-20220813163858610.png)

## 4.关闭Tomcat

```
sh ./shutdown.sh
Using CATALINA_BASE:   /Users/guanhongli/Library/apache-tomcat-9.0.65
Using CATALINA_HOME:   /Users/guanhongli/Library/apache-tomcat-9.0.65
Using CATALINA_TMPDIR: /Users/guanhongli/Library/apache-tomcat-9.0.65/temp
Using JRE_HOME:        /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
Using CLASSPATH:       /Users/guanhongli/Library/apache-tomcat-9.0.65/bin/bootstrap.jar:/Users/guanhongli/Library/apache-tomcat-9.0.65/bin/tomcat-juli.jar
Using CATALINA_OPTS:
```

*说明：*

*sudo为系统超级管理员权限.*

*chmod 改变一个或多个文件的存取模式*

*755代表用户对该文件拥有读、写、执行的权限，同组的其他人员拥有执行和读的权限，没有写的权限，其它用户的权限和同组人员一样.*

*777代表，user,group ,others ,都有读写和可执行权限.*

*chmod -R 777 folername,获取文件夹权限.*



# IDEA配置Tomcat

1.打开IDEA–> preferences–> Application Servers–> + --> Tomcat Server

2.选择或复制Tomcat安装路径。/Users/guanhongli/Library/apache-tomcat-9.0.65 ---ok

3.apply即可！

![image-20220813164803937](https://gitee.com/guanlili1921/picturebed/raw/master/img/image-20220813164803937.png)