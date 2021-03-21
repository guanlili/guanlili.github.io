# 开发MeterSphere

## 配置开发环境

MeterSphere 后端使用了 Java 语言的 Spring Boot 框架，并使用 Maven 作为项目管理工具。开发者需要先在开发环境中安装 JDK 1.8 及 Maven。

### 安装Maven

官网：http://maven.apache.org/download.cgi

解压

```
tar zxvf apache-maven-3.6.1-bin.tar.gz -C /opt/ 
```

环境变量

```
vim /etc/profile
```

在打开的文件最后面添加以下信息

```
export M2_HOME=/opt/apache-maven-3.6.1
export PATH=$PATH:$M2_HOME/bin
```

让配置生效

```
source /etc/profile
```

验证是否安装完成

```
mvn -version
```

至此，安装成功！

### 安装mysql

#### 初始化配置

数据库初始化

MeterSphere 使用 MySQL 数据库，推荐使用 MySQL 5.7 版本。同时 MeterSphere 对数据库部分配置项有要求，请参考下附的数据库配置，修改开发环境中的数据库配置文件

1.下载

mysql-5.7.26-linux-glibc2.12-x86_64.tar.gz

 在你要放置安装包的目录下执行  

```javascript
wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.26-linux-glibc2.12-x86_64.tar.gz
```

2.解压并移动

```javascript
tar -xvf mysql-5.7.26-linux-glibc2.12-x86_64.tar 
```

3.移动并重命名

```javascript
mv mysql-5.7.26-linux-glibc2.12-x86_64 /usr/local/mysql
```

4.创建用户组和用户，并给数据目录赋予权限

```javascript
groupadd mysql
useradd -r -g mysql mysql
```

创建mysq数据目录

回到根目录

```javascript
cd /
mkdir -p  /data/mysql 
```

创建数据目录并赋予权限

```javascript
mkdir -p  /data/mysql              #创建目录
chown mysql:mysql -R /data/mysql   #赋予权限
```

配置my.cnf

```
vim /etc/my.cnf
```

内容如下：（文件里只保留这些，把别的都要注释掉！否则启动会报错。）

```
[mysqld]
bind-address=0.0.0.0
port=3306
user=mysql
basedir=/usr/local/mysql
datadir=/data/mysql
socket=/tmp/mysql.sock
log-error=/data/mysql/mysql.err
pid-file=/data/mysql/mysql.pid
#character config
character_set_server=utf8mb4
symbolic-links=0
explicit_defaults_for_timestamp=true
```

#### 初始化数据库

进入mysql的bin目录

```
cd /usr/local/mysql/bin/
```

初始化

```
 ./mysqld --defaults-file=/etc/my.cnf --basedir=/usr/local/mysql-5.7.26/ --datadir=/data/mysql/ --user=mysql --initialize
```

查看初始密码，复制出来

```javascript
vim /data/mysql/mysql.err
```

启动mysql，并更改root 密码

先将mysql.server放置到/etc/init.d/mysql中

```bash
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
```

启动！！

```
service mysql start

ps -ef|grep mysql
```

能查到这里说明mysql已经安装成功了！！

首先登录mysql，前面的那个是随机生成的。

```bash
./mysql -u root -p   #bin目录下
```

再执行下面三步操作，然后重新登录。

```bash
SET PASSWORD = PASSWORD('123456');
ALTER USER 'root'@'localhost' PASSWORD EXPIRE NEVER;
FLUSH PRIVILEGES;
```

 这时候你如果使用远程连接……你会发现你无法连接。

这里主要执行下面三个命令(先登录数据库)

```
use mysql                                            #访问mysql库
update user set host = '%' where user = 'root';      #使root能再任何host访问
FLUSH PRIVILEGES;    #刷新
```

ok！！！！MySQL5.7就装好了