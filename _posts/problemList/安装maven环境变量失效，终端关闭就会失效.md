# 安装maven环境变量失效，终端关闭就会失效

## 现象描述

安装完maven之后，也配置了环境变量。

```
export M2_HOME=/Users/guanhongli/Software/apache-maven-3.8.6
export PATH=$PATH:$M2_HOME/bin
```

但发现每次都需要`source ~/.bash_profile`才能生效。否则mvn -v 就提示报错。

```
zsh: command not found: mvn
```

## 问题原因

为什么新开终端窗口之后原来生效的环境变量就失效了呢？看来是每次开新窗口把环境变量更新了。

查找资料发现原因是由于安装zsh的缘故，每次iTerm终端开启的时候只会加载～/.zshrc的环境变量的配置，该文件第一行有如下说明：

```
open ~/.zshrc
#If you come from bash you might have to change your $PATH.
#如果您来自 bash，则可能必须更改 $PATH。
```

## 解决办法

1.打开zsh的配置文件。

```
open ~/.zshrc
```

2.文件开头添加两行

```
export PATH=$HOME/bin:/usr/local/bin:$PATH
source $HOME/.bash_profile
```

这样相当于每次新开终端加载~/.zshrc文件时，也自动生效了.bash_profile文件配置。然后就可以愉快的使用maven了。

```
mvn -v
Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: /Users/guanhongli/Software/apache-maven-3.8.6
Java version: 1.8.0_332, vendor: Azul Systems, Inc., runtime: /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.16", arch: "x86_64", family: "mac"
```

