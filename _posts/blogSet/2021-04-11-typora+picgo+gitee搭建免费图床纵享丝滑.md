# typora+picgo+gitee搭建免费图床纵享丝滑

## 0.写在前面

由于之前自己在github搭了自己的博客，伴随之而来的一系列问题。如github不显示图片，github图床加载太慢等一系列问题。

[Typora+PicGo+github搭建免费稳定图床写博客如行云流水（mac+window）](https://blog.csdn.net/outman_1921/article/details/106598469)

[使用jsDelivr的CDN加速github图床](https://blog.csdn.net/outman_1921/article/details/115569466)

由于前几天把自己的博客迁移到了gitee上，[github博客自动同步到gitee（保姆级教程）](https://blog.csdn.net/outman_1921/article/details/115454572)于是想要不要把图床也迁移到gitee上呢？是不是既稳定又高速，可以纵享丝滑了。说干就干搞一个试试。

## 1.gitee图床

注册码云后进入主页，点击右上角的+号，新建仓库作为图床。

设置图床名称。**注意：在是否开源处选择公开，才能通过网络访问到图片**。**初始化Readme将自动建立master主分支。然后创建**。

![image-20210411131456367](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210411131456.png)

**申请私人令牌，用于PicGo的令牌配置**。在右上角的个人头像处点击设置，然后在左边栏点击私人令牌，生成新令牌。（**记得保存！**）

![image-20210411131621993](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210411131622.png)

## 2. PicGo安装及配置

https://github.com/Molunerfinn/PicGo/releases选择最新版下载软件，安装，留意安装路径。

![image-20210411131734427](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210411131734.png)

打开picgo,点击插件设置，输入gitee并搜索，安装插件。

![image-20210411132120566](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210411132120.png)

安装完成后重启一下PicGo。点击图层设置，选择gitee。需要设置4个选项：repo为你的代码库名称，branch为代码分支，选择主分支master，token为前面申请的gitee私人令牌，path为图床在代码库中的目录，可以设为img，下面的两个选项空着，在提交时默认填入时间来标识图片名称。

![image-20210411132610795](https://blog-1258476669.cos.ap-beijing.myqcloud.com/PictureBed-master-github/img/didimac20210411132610.png)

**点击确认，设为默认图床。**这样关于gitee的图床设置完毕，可以到上传区上传一张图片试试，如果提交后在gitee中可以看到即成功配置。

## 3.设置typora

![image-20210411140020921](https://blog-1258476669.cos.ap-beijing.myqcloud.com/picturebed-master-gitee/img/didimac/20210411140021.png)

截个图测试一下自动上传了，纵享丝滑！

## 4.说在后面

自从把图床也迁移到gitee上，腰也不疼了，腿也不酸了，一口气能上传好多个图片了。很开心！

回首自己从博客到图床都迁移到gitee的过程中，仿佛一个从支持国外转而支持国产的过程，联系到前几天新疆棉的事件，也真心希望国内可以有越来越多好用软件工具。

吾辈当自强。你我皆共勉～