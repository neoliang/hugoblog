---
title: 关于代码与艺术
date: "2020-05-16"
url: "/posts/about"
thumbnail: "img/story-logo-black.svg"
description: "关于本博客的创作动机与过程"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
categories:
- Demo
---
代码与艺术的创作开始于今年春节。今年春节比较特殊，假期因为新冠肺炎延长到近一个月，当时我被困在农村，网络环境不是很好，浏览网页都比较费劲，没有太多娱乐项目可以用来打发时间。好在是初春时分，天气晴朗，农村的空气又没有任何光污染，天空特别通透。晚上躺在草堆上，仰望星空，能看到群星闪烁，漆黑的夜里，特别安静，天上的星星与人间的灯火连成一片，置身于中，时间与空间仿佛都消失了。
<!--more-->
![天上的星星与人间的灯火](/img/starsandlights.jpg)
在这样的环境里待太久，自然会想一些宇宙与人生的事，而宇宙与人生的事想久了就会觉得无聊和空虚。我想也许敲几行代码能给这百无聊赖乡下生活增加点趣味，于是就想到用代码来做一些与星空和宇宙相关事，用代码模拟黑洞的想法在这样的情景下就诞生了。随即我开始短暂的关于相对论，光线追踪等知识的学习，用shadertoy实现一个洞的效果，具体实现方法可以参考[这篇文章](/posts/blackhole)
![农村院子里拍摄的金星与月亮](/img/venusandmoon.jpg)
在实现小目标的过程中，收获颇多，似乎发现了一个新的天地。原来物理、天文与图形学竟然有如此紧密的联系，比如相对论与微分几何，微分几何与切线空间之间的联系；麦克斯韦方程组与辐射度，辐射度与光线追踪之间的联系。关于这一切是如此的有趣迷人，我决定开一个专栏，记录下学习和探索这些知识的美妙过程。

而相对于写文章，我更擅长写代码，代码相对于自然语言能更能精准的表达出物质的本质和规律，可以通过代码使用表格、图形的方式将这些本质和规律可视化以便于我们进一步理解它们。由于在记录过程中会涉及到大量的代码，我从头设计和制作了该网站，方便在创作过程使用的代码可以在网页的文章中实时，读者也能在阅读网页的过程中亲自动手去修改代码并运行。除此之外，我还在网站的首页展示了在写各篇文章过程中不同实验所生成的图片，并对这些图片加上了注释和文章的链接。

![Logo](/preview_images/full/logo-v1.jpg)
## 关于Logo

专栏的名字叫代码与艺术，我想传达的是基于自然规律的美和艺术，在所有的自然规律中，最本质最神秘和最浪漫的恐怕非宇宙莫属了，大爆炸、黑洞、系外行星、三体轨迹。关于宇宙的一切宏大、美丽，当然最神奇是我们还能找到理解方法。所以在Logo的设计上我想表达宇宙与人的关系。

Logo完全用程序语言绘制的，在设计我采用了最简单的方式，几何元素只使用了直线、三角形和圓，颜色只使用了黑白灰和红色。

### 宇宙

我画了一系列同心圆，代表人在地球上观察到因为万有引力运动的群星的轨迹。同心圆的半径并不是完全均匀的随机，而是满足于正态分布，这样做的主要原因是自然界中大多数随机都满足于正态分布，除此之外，正态分布随机看起来也会比均匀分布随机更美一些。

### 人

星座是人类关于宇宙最早的记录，西元2世紀，古希腊天文学家托勒密綜合了当时的天文成就，用假想的线条将一系列星星连接起来，編制了48个星座。我在同心圆所代表的星上随机加上了一些圆来代表星星，并用直线将它们连接起来代表星座，这样的人与宇宙间就通过星座建立了连接。

三角形在自然界中并不常见，只有人类或者具有智慧的生物才能制造出这样的形状，人类最早的智慧毕达哥拉斯定理(勾股定理)也和三角形的密切相关，所以我在在同心圆的中心画了一个三角形，用来代表人和智慧。

在Logo中，其它的状形都是灰白，只有三角形使用了红色，并在位置被置于中心，我想表达的是人与科学在宇宙中的地位，相对于浩瀚的宇宙，人类虽然很渺小，科学和技术也处于很原始的阶段，但至今为此，人类似乎是这浩瀚的舞台上的唯一的表演者。如果说宇宙的存在有某种意义，那么人类将是唯一解开这个意义的钥匙。




## 鸣谢

本博客使用[Hugo](https://gohugo.io/)创建。Hugo是使用Go语言实现的静态网站生成器，Hugo简单易用，大部分情况下只需要Markdown就完成博客书写；当然，如果想扩展博客支持代码、图表和数学公式等也比较容易，只需要写几行简单的代码，通过[ShortCode](https://gohugo.io/templates/shortcode-templates/)就能实现。如果你也想创建自己的博客，推荐使用。

博客的文章主题和排版使用了[story](https://story.xaprb.com/theme-features/),Story拥有比较简洁和美观的主题，非常适合写博客和展示图片。

网站的首页的图片展示主题使用的是Hugo [Grid](https://themes.gohugo.io/tags/grid)，Grid以方格格的形式展示图片，简洁美观。

博客的代码展示部分使用的是[ACE](https://ace.c9.io/)，ACE不但支持代码语法高亮，而且可以在线编辑并运行。

博客中的图表展示部分使用的是[Chart.js](https://www.chartjs.org/)，Chart.js可以很方便的绘制线性、柱状等各种图表。

在此对以上提及的开源代码表示衷心的感谢！


