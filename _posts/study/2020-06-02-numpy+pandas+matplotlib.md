---
layout: post
title: "数据分析三件套"
subtitle: "numpy+pandas+matplotlib"
author: "guanlili"
header-img: "img/blog-cover-database.jpg"
header-img-credit: "@WebdesignerDepot"
header-img-credit-href: "medium.com/@WebdesignerDepot/poll-should-css-become-more-like-a-programming-language-c74eb26a4270"
header-mask: 0.4
tags:
  - python
  - 数据分析
  - numpy
  - pandas
  - matplotlib
---

> numpy(数据计算)+pandas(数据提取)+matplotlib(可视化图表)
> 自学数据分析期间的学习笔记。

# numpy+pandas+matplotlib

## numpy

### 列表转矩阵

```
import numpy  as np
array = np.array([[1,2,3],[2,3,4]])
print(array)
print('number of dim',array.ndim)#维数,秩
print('shape',array.shape)#nxn
print('size',array.size)#元素个数
import numpy  as np
a = np.numpy([2,23,4],type=np.int64)# 
print(a.dtype)
a = np.zeros((3,4))#3行4列为0的矩阵，ones-1
print(a)
a = np.arange(10,20,2)#10-20 步长为2
print(a)
a = np.arange(12).reshape((3,4))#0-11调整数组大小3行4列
print(a)
a = np.linspace(1,10,6)reshape((2,3))#分段  
print(a)

```

### 数组

```
a = np.array([10,20,30,40])
b = np.arange(4)#生成0-3
print(a,b)
c = a-b #加减乘除  平方 **
d = 10*np.sin(a)#三角函数 cos tan 
print(c)
print(b<3)#输出true和false
```

### 矩阵

```
a = np.array([1,1],[0,1]])
b = np.arange(4).reshape((2,2))
 print(a)
 print(b)
c=a*b
c_dot = np.dot(a,b)
c_dot_2 = a.dot(b)
 print(c)
print(c_dot)
a = np.random.random((2,4))#2行4列的随机数0-1
print(a)
print(np.sum(a))#求和
print(np.sum(a,axis=1))#每一列 中
print(np.min(a))#最小值
print(np.sum(a,axis=0))#每一行中
print(np.max(a))#最大值
A = np.arange(2,14).reshape((3,4))
print(np.argmin(A))#最小值的索引   0
print(np.argmax(A))#最大值的索引  11
print(A)
print(np.mean(A))#平均值
print(A.mean())#同上
print(A.average())#同上
print(np.median(A))#中位数
print(np.cumsum(A))#累加 
print(np.diff(A))#差值
print(np.nonzero(A))#非0
print(np.sort(A))#逐行排序

```

### 矩阵相乘

```
print(np.transpose(A))#行变列 列变行 3乘4 变 4乘3
print(A.T)#和上面一样
print((A.T).dot(A))#乘法运算
print(np.clip(A,5,9))#大于9都变成9。小于5变成5，保留5 9中间的数字
print(np.mean(A,axis=0))# 0 对于列计算。1对于行计算
A = np.arange(3,15)
print(A)
print(A[3])#索引（一维）
A = np.arange(3,15).reshap(3,4)
print(A)
print(A[2])#索引出第3行
print(A[2] [1])#索引出第3行的第1列
print(A[2,1])#同上
print(A[：,1])#索引出第1列所有的
print(A[1,1:3])#索引出第2行第2-3个数
for row in A:
print(row)#迭代每一行
for column in A.T:
print(column)#迭代每一列。用.T转置
```

### 合并

```
A = np.array([1,1,1])
B = np.array([2,2,2])
C = np.vstack((A,B)) #vertical stack 上下合并，输出2*3的数组
D = np.hstack((A,B))#horizontal stack左右合并，
print(A.shape,D.shape)
print(A[np.newaxls].shape)#前面加一个维度

```

### 分割

```
A = np.arange(12).reshape(3,4))
print(A)
print(np.split(A,2,axis=1))#把A分成2块，纵向分割，等份
print(np.array_split(A,3,axis=1))#不等分割
print(np.vsplit(A,3))#纵向分割
print(np.hsplit(A,2))#横向分割

```

### 赋值

```
a = np.arange(4)
b=a
c=a
d=b
a[0]=11#所有变量都会改
d[1:3] = [22,33]
b = a.copy() #deep copy   b不随a关联，
```

## pandas基础

如果你想学习Pandas，建议先看两个网站。

（1）官网：[Python Data Analysis Library](https://link.zhihu.com/?target=http%3A//pandas.pydata.org/)

（2）十分钟入门Pandas：[10 Minutes to pandas](https://link.zhihu.com/?target=http%3A//pandas.pydata.org/pandas-docs/stable/10min.html)

在第一次学习Pandas的过程中，你会发现你需要记忆很多的函数和方法。所以在这里我们汇总一下[Pandas官方文档](https://link.zhihu.com/?target=http%3A//pandas.pydata.org/pandas-docs/stable/index.html)中比较常用的函数和方法，以方便大家记忆。同时，我们提供一个PDF版本，方便大家打印。

```
Import pandas as pd
Import numpy as np
s = pd Series([1,3,6,np.nan,44,1])
s
dates = pd.date_range('20160101',periods=6)#随机生成六个日期
dates

df = pd.DateFrame(np.random.randn(6,4),index=dates,columns=['a','b','c','d'])
df1 = pd.DataFrame(np.arange(12).reshape((3,4)))#默认
df1
df2 = pd.DateFrame({'A':1.,
'B':pd.Timestamp('20130102'),
'C':pd.Series(1,index=list(range(4)),dtype='float32'),
'D':np.array([3] * 4,dtype='int32'),
'E':pd.Categorical(["test","train","test","train"]),
'F':'foo'})
df2
df2.dtypes#所有列的类型
df2.index#所有列的序号
df2.columns
df2.values
df2.describe() #运算数字形式
df2.T #转置
df2.sort_index(axis=1,ascending=False)#正排序
df2.sort_index(axis=0,ascending=False)#倒排序
df2.sort_values(by='E')#根据值排序
```

### 关键缩写和包导入

在这个速查手册中，我们使用如下缩写：

> df：任意的Pandas DataFrame对象
> s：任意的Pandas Series对象

同时我们需要做如下的引入：

> import pandas as pd
> import numpy as np

### 导入数据

- pd.read_csv(filename)：从CSV文件导入数据
- pd.read_table(filename)：从限定分隔符的文本文件导入数据
- pd.read_excel(filename)：从Excel文件导入数据
- pd.read_sql(query, connection_object)：从SQL表/库导入数据
- pd.read_json(json_string)：从JSON格式的字符串导入数据
- pd.read_html(url)：解析URL、字符串或者HTML文件，抽取其中的tables表格
- pd.read_clipboard()：从你的粘贴板获取内容，并传给read_table()
- pd.DataFrame(dict)：从字典对象导入数据，Key是列名，Value是数据

### 导出数据

- df.to_csv(filename)：导出数据到CSV文件
- df.to_excel(filename)：导出数据到Excel文件
- df.to_sql(table_name, connection_object)：导出数据到SQL表
- df.to_json(filename)：以Json格式导出数据到文本文件

### 生成对象

- pd.DataFrame(np.random.rand(20,5))：创建20行5列的随机数组成的DataFrame对象
- pd.Series(my_list)：从可迭代对象my_list创建一个Series对象
- df.index = pd.date_range('1900/1/30', periods=df.shape[0])：增加一个日期索引

### 索引

- df.index #获取索引
- df.index=['x','y]#设置索引的值
- df.set_index("country",drop=False)#指定某一列作为索引
- df.set_index("country").index.unique#返回index的唯一值
- s1 ["a"] ["b"]#从series复合索引中取值
- s1["a","b"]#从series复合索引中取值
- df.loc["a"].loc["b"]#从dataframe复合索引中取值

### 查看检查数据

- df.columns#列名
- df.value#df中的值，二维数组
- df.shape#形状,查看行数和列数
- df.dtypes#数据类型
- df.ndim#维度
- df.T#转置
- df.head(n)：查看DataFrame对象的前n行
- df.tail(n)：查看DataFrame对象的最后n行
- df.info()：查看索引、数据类型和内存信息
- df.describe()：查看数值型列的汇总统计,只展示数值型
- unique = effective_data["毕业学校"].unique()#某一列的唯一值
- df.value_counts(dropna=False)：查看Series对象的计数
- df.apply(pd.Series.value_counts)：查看DataFrame对象中每一列的唯一值和计数
- effective_data.isin(["北京林业大学"])#成员资格
- DataFrame.to_numpy()



- 

### 数据选取

取行取列的注意点：

[]写数组表示取行，对行进行操作，写字符串表示去列索引对列进行操作。

- df[col]：根据列名，并以Series的形式返回列
- df[[col1, col2]]：以DataFrame形式返回多列
- df[0:3]：切片前三行
- df['20130102':'20130104']：按索引切片

按标签选择

都可以选中，比切片多选一行。

- df.loc[dates[0]] #用标签提取一行数据
- df.loc['index_one']：按索引选取数据
- df.loc[:, ['A', 'B']]#用标签选择多列数据
- df.loc[ ['A', 'B'],:]#用标签选择多行数据
- df.loc['a','z']#a行z列的数据
- df.loc['20130102':'20130104', ['A', 'B']]#用标签切片，多行多列的值
- df.loc['20130102', ['A', 'B']]#返回对象降维
- df.loc[dates[0], 'A']#提取标量值
- df.at[dates[0], 'A']#提取标量值

按位置选择

- df.iloc[0]：按位置选取数据

- df.iloc[3:5, 0:2]#整数切片

- df.iloc[[1, 2, 4], [0, 2]]#用整数列表按位置切片

- df.iloc[1:3, :]#显式整行切片

- df.iloc[:, 1:3]#显式整列切片


- df.iat[1, 1]#显式提取值

- df.iat[1, 1]#快速访问标量，与上述等效

- df.iloc[0,:]：返回第一行

- df.iloc[0,0]：返回第一列的第一个元素

#### 布尔索引

df[df.A > 0]#用单列的值选择数据

df[df['clo].str.len()>4]&(df["clo2"]>700)]#选择clo字符串长度>4并且

df[df > 0]#选择 DataFrame 里满足条件的值

### 赋值

s1 = pd.Series([1, 2, 3, 4, 5, 6], index=pd.date_range('20130102', periods=6))#用索引自动对齐新增列的数据

df.at[dates[0], 'A'] = 0#按标签赋值

df.iat[0, 1] = 0#按位置赋值

df.loc[:, 'D'] = np.array([5] * len(df))#按 NumPy 数组赋值

df2[df2 > 0] = -df2#用 where 条件赋值

### 缺失值

 df1.dropna(how='any')#删除所有含缺失值的行 any只要有一行nan /all所有都为nan

df1.fillna(value=5)#填充缺失值

pd.isna(df1)#提取 nan 值的布尔掩码

pd.isnull(df1)#true为nan

df.fillna(100)#填充nan的值，不过一般填充中位数或者均值

df.filllna(t2.mean())#填充平均值

t2["age"].fillna(t2["age"].mean())#对age列进行填充

### 运算

### 数据清理

- df.columns = ['a','b','c']：重命名列名
- pd.isnull()：检查DataFrame对象中的空值，并返回一个Boolean数组
- pd.notnull()：检查DataFrame对象中的非空值，并返回一个Boolean数组
- df.dropna()：删除所有包含空值的行
- df.dropna(axis=1)：删除所有包含空值的列
- df.dropna(axis=1,thresh=n)：删除所有小于n个非空值的行
- df.fillna(x)：用x替换DataFrame对象中所有的空值
- s.astype(float)：将Series中的数据类型更改为float类型
- s.replace(1,'one')：用‘one’代替所有等于1的值
- s.replace([1,3],['one','three'])：用'one'代替1，用'three'代替3
- df.rename(columns=lambda x: x + 1)：批量更改列名
- df.rename(columns={'old_name': 'new_ name'})：选择性更改列名
- df.set_index('column_one')：更改索引列
- df.rename(index=lambda x: x + 1)：批量重命名索引

### 数据排序Sort

- df[df[col] > 0.5]：选择col列的值大于0.5的行
- df2.sort_index(axis=1,ascending=False)#正排序
- df2.sort_index(axis=0,ascending=False)#倒排序
- df.sort_values(col1)：按照列col1排序数据，默认升序排列
- df.sort_values(col2, ascending=False)：按照列col1降序排列数据
- df.sort_values([col1,col2], ascending=[True,False])：先按列col1升序排列，后按col2降序排列数据
- data.apply(np.mean)：对DataFrame中的每一列应用函数np.mean
- data.apply(np.max,axis=1)：对DataFrame中的每一行应用函数np.max

#### groupby分组

groupby对象能够遍历，能够调用聚合方法

- df.groupby(by="")：返回一个按列col进行分组的Groupby对象
- df.groupby([col1,col2])：返回一个按多列进行分组的Groupby对象
- df.groupby(col1)[col2]：返回按列col1进行分组后，列col2的均值
- df.pivot_table(index=col1, values=[col2,col3], aggfunc=max)：创建一个按列col1进行分组，并计算col2和col3的最大值的数据透视表
- df.groupby(col1).agg(np.mean)：返回按列col1分组的所有列的均值

### 数据合并（Merge）

- df1.append(df2)：将df2中的行添加到df1的尾部
- df.concat([df1, df2],axis=1)：将df2中的列添加到df1的尾部
- df1.join(df2,on=col1,how='inner')：对df1的列和df2的列执行SQL形式的join
-  pd.merge()列合并

### 数据统计

- df.describe()：查看数据值列的汇总统计
- df.mean()：返回所有列的均值
- df.mean(1)：返回所有行的均值
- df.corr()：返回列与列之间的相关系数
- df.count()：返回每一列中的非空值的个数
- df.max()：返回每一列的最大值
- df.min()：返回每一列的最小值
- df.median()：返回每一列的中位数
- df.std()：返回每一列的标准差
- df.value_counts()：统计值出现的次数

### 时间序列

datatime = pd.date_range(start="20200701",end="20200731",freq="10D")#freq控制频率 D每日历日。B工作日，H每小时，T或min每分，S每秒

datatime = pd.date_range(start="20200701",periods=10,freq="10D")#periods控制个数

## 数据分析

### 为什么学习数据分析

1.有岗位需求

2.python数据科学的基础

3.是机器学习课程的基础

### 数据分析流程

提出问题-准备数据-分析数据-获得结论-成果可视化

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