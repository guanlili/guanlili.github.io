---
layout: post
title: "数据分析之可视化展示"
subtitle: "matplotlib学习笔记"
author: "guanlili"
header-img: "img/blog-cover-database.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - python
  - 数据分析
  - matplotlib
---

### matplotlib

##### 1.什么是matplotlib

最流行的python底层绘图库，主要做数据可视化报表，模仿MATLAB

##### 2.matplotlib基本要点

坐标轴

导入pyplot

x = range(2,26,2)

y = []

plt.plot(x,y)传入xy通过plot绘出折线图

plt.show()展示

###### we can do more 

- 设置图片大小（高清无码大图）
- fig = plt.figure(figsie=(20,8),dpi=80) dpi参数让图像更清晰
- 保存到本地
- plt.savefig("./sig_size.png")也可以保存svg这种矢量图，放大后不会有锯齿
- 描述信息，图例，标题
- matplotlib默认不显示中文，默认的英文字体.
- 调整xy刻度的间距
- 线条的样式（颜色透明度）
- 标记出特殊的点（比如最低点最高点）
- 给图片添加水印

3.matplotlib的散点图，直方图，柱状图

- 折线图：以折线的上升或下降来表示统计数量的增减变化的统计图
- 特点**（变化）**：能够显示数据的变化趋势，反映事物的变化情况
- 直方图：由一系列高度不等的纵向条纹或线段表示数据的分布情况。一般横轴表示数据范围，纵轴表示分布情况
- 特点**（统计）**：绘制**连续性**的数据，展示一组或者多组数据的分布情况
- 条形图：排列在工作表的列或行中的数据可以绘制到条形图中(数量统计，频率统计)
- 特点**（统计）**：绘制**离散**的数据，能够一眼看出各个数据的大小，比较数据之间的差别。
- 散点图：用两组数据构成多个坐标点，考察坐标点的分布，判断两变量之间能否存在某种关联或总结坐标点的分布模式
- 特点**（分布规律）**：判断变量之间是否存在数量关联趋势，展示离群点

4.更多的画图工具

### 为什么学matplotlib

1。能将数据进行可视化，更直观的呈现

2。使数据更加客观，具有说服力


## pyechart笔记

echart是更高级的可视化图表。

### _ThemeType主题

```
  BUILTIN_THEMES = ["light", "dark", "white"]
    LIGHT = "light"#明亮风格
    DARK = "dark"#暗黑风
    WHITE = "white"#洁白风
    CHALK: str = "chalk" #粉笔风
    ESSOS: str = "essos" #厄索斯大陆
    INFOGRAPHIC: str = "infographic"#信息图
    MACARONS: str = "macarons"#马卡龙
    PURPLE_PASSION: str = "purple-passion"#紫色激情
    ROMA: str = "roma"#石榴
    ROMANTIC: str = "romantic" #浪漫风
    SHINE: str = "shine"#闪耀风
    VINTAGE: str = "vintage"#复古风
    WALDEN: str = "walden"#瓦尔登湖
    WESTEROS: str = "westeros" #维斯特洛大陆
    WONDERLAND: str = "wonderland"#仙境
    HALLOWEEN: str = "halloween"#万圣节
```

参考资料：https://blog.csdn.net/qq_41595507/article/details/102947622

### LegendOpts图例

```
from pyecharts import options as opts
from pyecharts.charts import Bar
from pyecharts.faker import Faker
from pyecharts.globals import ThemeType
from pyecharts.charts import Bar
bar = (
    Bar({"theme": ThemeType.MACARONS})
    .add_xaxis(["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"])
    .add_yaxis("商家A", [5, 20, 36, 10, 75, 90])
    .add_yaxis("商家B", [15, 6, 45, 20, 35, 66])
    .set_global_opts(
        #LegendOpts：图例配置项
        legend_opts=opts.LegendOpts(
            # 是否显示图例组件
            is_show = True,
        # 图例的类型。可选值：
        # 'plain'：普通图例。缺省就是普通图例。
        # 'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
        type_ = 'plain',

        # 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭
        # 除此之外也可以设成 'single' 或者 'multiple' 使用单选或者多选模式。
        # selected_mode = False,
        selected_mode = True,
        # selected_mode = 'multiple',

        # 图例组件离容器左侧的距离。
        # left 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比，
        # 也可以是 'left', 'center', 'right'。
        # 如果 left 的值为'left', 'center', 'right'，组件会根据相应的位置自动对齐。
        # pos_left = 50,
        pos_left = '50%',
        # pos_left = 'left',

        # 图例组件离容器右侧的距离（同上）。
        # right 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比。
        pos_right = None,

        # 图例组件离容器上侧的距离（同上）。
        # top 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比，
        # 也可以是 'top', 'middle', 'bottom'。
        # 如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
        pos_top = None,

        # 图例组件离容器下侧的距离（同上）。
        # bottom 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比。
        pos_bottom = None,

        # 图例列表的布局朝向。可选：'horizontal', 'vertical'
        orient = 'vertical',

        # 图例标记和文本的对齐。默认自动（auto）
        # 根据组件的位置和 orient 决定
        # 当组件的 left 值为 'right' 以及纵向布局（orient 为 'vertical'）的时候为右对齐，即为 'right'。
        # 可选参数: `auto`, `left`, `right`
        align = None,

        # 图例内边距，单位px，默认各方向内边距为5
        padding = 5,

        # 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
        # 默认间隔为 10
        item_gap = 20,

        # 图例标记的图形宽度。默认宽度为 25
        item_width = 50,

        # 图例标记的图形高度。默认高度为 14
        item_height = 14,
    
        # 图例关闭时的颜色。默认是 #ccc
        inactive_color = '#E6E61A',

        # 图例组件字体样式，参考 `series_options.TextStyleOpts`
        textstyle_opts = None,

        # 图例项的 icon。
        # ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
        # 可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。
        # 可以通过 'path://' 将图标设置为任意的矢量路径。
        legend_icon ='pin',
                
        )
    
    )
)
bar.render("C:/a.html")
```

### TitleOpts标题

```
from pyecharts import options as opts
from pyecharts.charts import Bar
from pyecharts.faker import Faker
from pyecharts.globals import ThemeType
c = (
    Bar(init_opts=opts.InitOpts(theme=ThemeType.MACARONS,bg_color='white'))
    .add_xaxis(Faker.choose())
    .add_yaxis("商家", Faker.values())
    .set_global_opts(
        title_opts=opts.TitleOpts(
            # 主标题文本，支持使用 \n 换行。
            title="Bar基本示例",
            
            # 主标题跳转 URL 链接
            title_link = 'https://www.baidu.com/',
            
            # 主标题跳转链接方式
            # 默认值是: blank
            # 可选参数: 'self', 'blank'
            # 'self' 当前窗口打开; 'blank' 新窗口打开
            title_target = 'self',
            
            # 副标题文本，支持使用 \n 换行
            subtitle="我是副标题",
            
            # 副标题跳转 URL 链接
            # subtitle_link = 'https://www.baidu.com/',
                
            # 副标题跳转链接方式
            # subtitle_target = 'self',
            
            # title 组件离容器左侧的距离。
            # left 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比
            # 也可以是 'left', 'center', 'right','top', 'middle', 'bottom'
            # 如果 left 的值为'left', 'center', 'right'，组件会根据相应的位置自动对齐。
            pos_left = '80%', 
            # 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
            # // 设置内边距为 5
            # padding: 5
            # // 设置上下的内边距为 5，左右的内边距为 10
            # padding: [5, 10]
            # // 分别设置四个方向的内边距
            # padding: [
            #     5,  // 上
            #     10, // 右
            #     5,  // 下
            #     10, // 左
            # ]


            # 主副标题之间的间距，默认为10
            item_gap = 30,

            ),        
        )
    .render("C:/bar_base_.html")
)


```