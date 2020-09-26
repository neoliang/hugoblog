---
title: GAMES101-学习笔记(0)
date: "2020-09-23"
url: "/posts/games101_part1"
description: "计算机图形学概览学习笔记"
thumbnail: "img/games101/whitted.jpg"
image: "img/games101/banner.jpg"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-math
- feature-ace
categories:
- games101
- 图形学
---
GAMES101-现代计算机图形学入门由[^1]图形学界大佬闫令琪[^2]通过网络直播亲自讲解，闫令琪何许人也，图灵将得主Pat Hanrahan[^0]徒孙，博士期间在SIGGRAPH上以第一作者的身份发表论文达7篇，打破了渲染研究领域世界记录，其论文成果被《猩球崛起》《狮子王》等电影采用。
<!--more-->
耗无疑问大神渲染科研水平是世界一流的，更难能可贵的是闫大神讲课教学水平也是一流的，他在视频里用简练直白的语言描述出事件的本质，用生活中通俗常见的实例帮助加深理解，将图形学中相对晦涩的概念讲得极其透彻，形象生动。视频中有很多形象生动的例子，这里举例三个令我印象比例深刻的：
1. 透视投影矩阵的推导讲解分为两个极其简单和本质的部分，基本上只需要掌握初中的数学知识就能看懂；
1. 从信号与采样的角度来讲反走样，将走样的原因分析得深入透彻，在理解这些基础上，再学习各种反走样算法就会比较轻松容易；
1. 用生活中比较常见的LED灯泡功率实例、地球北半球冬夏与日照的关系实例引入和解释辐射度量学中的相对陌生辐射照度、辐射率等概念；

我是在B站上观看的视频课程，看完后收获颇多，视频中抛出的一些问题深有启发，值得仔细思考和探索，于是我决定重新再看一遍，对大神提出的问题详加思考和推导，完成相应的作业，并在这里记录下学习的过程.

[^1]:(https://www.bilibili.com/video/BV1X7411F744?p=1)
[^2]:(https://sites.cs.ucsb.edu/~lingqi/index.html)
[^0]:(https://en.wikipedia.org/wiki/Pat_Hanrahan)
---

## 计算图形学概览

本篇是视频一的学习笔记，讲述的是计算图形学概览。视频的开篇介绍了图形学的概念及图形学在游戏、电影、动画、设计和医疗等领域上的应用情况，结合实例来说明图形学涉及的领域及应用面临的问题。有意思的大神也比较喜欢玩游戏，专门说到了《只狼》这个游戏，并分享了一个如何判断游戏画面好坏的小技巧，就是看画面是否足够亮。当然有同学在弹幕中表示黑暗之魂，血源、FF14等游戏趟枪。

### 为什么要学图形学？ 
![渲染与视觉](/img/games101/part0/awesome.jpg)

### 课程大纲
这门课程的大纲一共由四个部分组成，分别是光栅化、几何、光线追踪与动画模拟。实际上视频还增加关于高级材质、相机与光场等额外内容，最终课程讲述的主要内容如下：
1. 光栅化
	- 向量、矩阵与变换与投影等线性代数简介
	- 三角形光栅化，反走样尝试缓冲
	- 渲染流水线、光照、阴影与纹理映射等着色技术
1. 渲染对象的几何表示
	- 几何的显式与隐式表达
	- 贝塞尔曲线、曲面
	- 几何对象细分、简化
1. 光线追踪
	- Whitted-Style 光线追踪
	- 光线求交加速
	- 辐射度量学
	- 光线传播、渲染方程与全局光照
	- 概率论与蒙特卡罗路径追踪
1. 材质、相机与颜色
	- 材质、BRDF
	- 散射、头发、皮毛和布料等高级渲染课题
	- 相机、光场
	- 颜色与感知
1. 动画与模拟
	- 关键帧动画
	- 物理模拟
	- 动力学
	- 欧拉方法
---
### 计算机图形学与计算机视觉
计算机图形学与计算机视觉之间的边界越来越模糊，一般来讲图形学研究的是将Model变成Image的过程，对应下图中2，反之则是计算机视觉。另外，Model的表示与模拟也是计算机图形学研究的方向，涉及到模型的简化、细分，材质表示等，对应下图中的1。
![计算机图形学与视觉](/img/games101/part0/render_visual.jpg)

### 学图形学需要哪些知识：
1. 数学：线性代数、微积分、统计
1. 物理：光学、力学
1. 其它：信号处理、数值分析
1. 一点点美学

### 开发环境搭建
图形学比较困难，一方面涉及的知识面比较广，需要领会和贯通各个知识点。另一方面我们还需要亲自动手实现相关的代码。在编写代码代码之前，环境的搭建也是一个比较烦人的事，这到不是因为这事需要高深的技术，而是因为各个操作系统、开发工具及编程语言的差异，就算拿到别人的源代码，折腾很久也不定能正确编译运行。在GAMES201的视频课程中胡渊明[^hu]大神也提到了开发环境和编程语言对开发生产力和程序可移植性的影响，为了解决这些问题，他发明了taichi语言。
[^hu]:(http://taichi.graphics/me/)

### 作业零
作业零的目的是让大家熟悉开发环境，文档里要求安装ubuntu虚拟机,通过cmake来编译工程，这样做的好处是只要我们按文档安装好虚拟机，再用cmake编译工程，就能得到正确的结果，可以避免从头开发搭建开发环境，减少出错的概率，节省时间。但使用虚拟机真的不是一个很好的选择，首先我个人在安装时就遇到了一个小麻烦——无法选择64位操作系统，经查资料发现在bios中将cpu设置为允许虚拟技术[^3]得到解决。其次虚拟机的分辨率比较低，操作十分不流畅，卡顿比较明显，考虑到以后还需要实现软件光栅化的程序，造成的卡顿会更加严重。另一种方法是使用linux云主机，配合visual code来远程开发[^vscloud],但要让远程主机运行图形程序会比较麻烦。于是我我决定使用xcode作来开发工具，对于作业零来说，依赖的第三方库只有eigen，而eigin是header only的库，最简单的办法就是将eigen源代码[^4]下载到本地，然后放到以下目录[^5]
```shell
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include
```
作业0如下：
>给定一个点 P =(2,1), 将该点绕原点先逆时针旋转 45◦，再平移 (1,2), 计算出 变换后点的坐标(要求用齐次坐标进行计算)。

逆时针旋转{{<math>}}\theta{{</math>}}的矩阵R如下：

{{<math>}}\left[ \begin{array}{lcr}
cos(\theta)& -sin(\theta)&0\\sin(\theta)& cos(\theta)&0\\0&0&1\end{array} \right]{{</math>}} 

平移矩阵T如下：

{{<math>}}\left[ \begin{array}{lcr}
0& 0&t_{x}\\0& 0&t_{y}\\0&0&1\end{array} \right]{{</math>}} 

`TxR`如下：

{{<math>}}\left[ \begin{array}{lcr}
cos(\theta)& -sin(\theta)&t_{x}\\sin(\theta)& cos(\theta)&t_{y}\\0&0&1\end{array} \right]{{</math>}} 

相关代码如下，输出的结果为：`(1.70711,4.12132)`

```c++
const float PI = 3.1415926f;
int main(){
    Eigen::Vector3f p(2,1,1);
    Eigen::Matrix3f m;
    float angle = 45.0f/180.0f * PI;
    float c = cosf(angle),s = sinf(angle);
    m << c,-s,1,
         s,c,2,
        0,0,1;
    p = m * p;
    std::cout << p;
    return 0;
}

```
代码已上传到github[^pa0]

[^vscloud]:(https://zhuanlan.zhihu.com/p/64849549)
[^3]:(http://www.fixedbyvonnie.com/2014/11/virtualbox-showing-32-bit-guest-versions-64-bit-host-os/)
[^4]:(https://gitlab.com/libeigen/eigen/-/archive/3.3.7/eigen-3.3.7.zip)
[^5]:(https://www.jianshu.com/p/faa1bb1f17dd)
[^pa0]:(https://github.com/neoliang/games101)