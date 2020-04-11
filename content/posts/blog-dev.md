---
title: 开发日志
date: "2020-04-8"
url: "/posts/blog-dev"
thumbnail: "img/story-logo-black.svg"
description: "开发日志，记录本博客开发过程中的需求，遇到的问题及解决方法"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
categories:
- Demo

---
开发本博客的主要目是展示代码生成的作品及记录生成作品相关的开发过程和代码，本博客从建立到现在已经历了近一个月的开发时间。使用的是Hugo静态网页生成器，虽然使用了很多开源代码和模版，但在这个基础上仍做了些修改和调整以满足我的博客需求，目前修改和调整仍在进行中。
<!--more-->

### 已实现功能
首页的作品展示使用了开源的hugo模板Hugrid[^1]，在这个模板的基础上，我加入了以下新功能：
- 预览多张图片
- 预览图片加上标题
- 原来的模板对手机触摸支持得不好，点击和滑动时会意外的关闭，对比我做了大量的优化和测试

[^1]:(https://themes.gohugo.io/hugrid/)

博客的文章写作使用的是Story模板[^2],Story的排版美观，对于作品展示和写作是比较理想的选择，支持数学公式，代码高亮、自动存档及搜索等功能。我在这个模板的基础上增加了以下功能：
- 整合了图片预览模板Hugrid
- 代码编辑器Ace[^3]嵌入,使用（使用`- feature-ace`开启)
- Chart.Js图表绘制（使用`- feature-chart`开启)
- P5.js绘图嵌入
- Shader嵌入

[^2]:(https://github.com/xaprb/story)
[^3]:(https://ace.c9.io/)

### 待完善功能
1. iFrame排版对齐修复，P5.js使用iFrame实现，iFrame嵌入时排版的宽度和原生元素上有差异
	- 将AceEditor从iFrame中分享出来（已完成）
1. 代码编辑器运行按钮嵌入（参考Shadertoy）
1. 代码编辑器折叠按钮和文字美化 （参考Shadertoy）
1. 支持P5.js,Chart.js和shader的嵌入时不显示代码 (已完成)
	> 备注:`<div/>`的写法是错误的，正常的写法 `<div> </div> `
1. 字体大小调整,适配手机横坚屏（参考cnblog)
1. 代码嵌入使用AceEditor的只读模式,支持多种语言语法高亮（已完成)
1. shader嵌入支持（屏幕适配及多实例）
1. P5js改进
	- 支持setup函数及非setup函数
	- canvas由hook创建，内置屏幕宽高变量 （已完成）
