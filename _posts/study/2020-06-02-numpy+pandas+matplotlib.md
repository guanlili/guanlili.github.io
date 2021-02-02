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

## pandas

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