# 使用jsDelivr的CDN加速github图床

## 说在前面

自从换了github图床之后，我发现图片加载速度实在是过于慢，甚至不挂梯加载不出图片。

搜了一下可以使用jsDelivr的CDN来给图床加速，看了看也挺简单的。如果你用的是[picgo](https://github.com/Molunerfinn/PicGo)这个图床上传软件基本可以一步到位完成加速。

## 什么是CDN

> CDN的全称是Content Delivery Network，即内容分发网络。CDN是构建在网络之上的内容分发网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN的关键技术主要有内容存储和分发技术。——百度百科

CDN有众多，我们选择[jsDelivr](https://www.jsdelivr.com/)。为什么？因为免费，好用。

## 如何加速github图床

### picgo端设置：

在自定义域名内填入`https://cdn.jsdelivr.net/gh/用户名/图床仓库名` 。

![image-20210410113943855](https://cdn.jsdelivr.net/gh/guanlili/PictureBed/img/didimac20210410113944.png)

完成此设置之后在使用picgo上传图像时会自动替换外链。

之后再次访问图片就会登峰造极了。