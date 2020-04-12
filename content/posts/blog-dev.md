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
- iFrame排版对齐修复，P5.js使用iFrame实现，iFrame嵌入时排版的宽度和原生元素上有差异
  - 将AceEditor从iFrame中分离出来
  - 宽度适配(Set iFrame inner html margin and padding to zero)
- 支持P5.js,Chart.js和shader的嵌入时不显示代码
  > `<div/>`的写法是错误的，正常的写法 `<div> </div> `
- Chartjs支持多实例显示
- 代码嵌入使用AceEditor的只读模式,支持多种语言语法高亮
- P5js改进
  - 支持setup函数及非setup函数 ([备注](#变量作用域备注))
  - canvas由hook创建，内置屏幕宽高变量
  - 尝试instance模式
  > instance 模式的语法和全局模式有差别，虽然可以用with来解决，但ballonsketch在测试时显示不正常，也未发现报错，暂时弃用  _(4月12日)_
  
  > #### 变量作用域备注
  > js的变量作用域比较奇怪例如以下代码：_(4月12日)_
  ```js
  function a(){return 255;}
  let b = a;
  console.log(b()); //0
  function a(){return 0;}
  ```
  ```js
  var a = ()=>255
  var b = a;
  console.log(b());
  a = ()=> 0;
  ```
  >看起来js执行时至少经历两个pass,第一个pass处理函数编译.第二个pass时对变量赋值。 在这个前提下，hook setup函数就得使用点小技巧，例如：
  ```js
  function a(){return 255;}
  var b = window.a;
  console.log(b());
  window.a = ()=> 0;

  //或者
  function a(){return 255;}
  var b = a;
  console.log(b());
  a = ()=> 0;
  ````


[^2]:(https://github.com/xaprb/story)
[^3]:(https://ace.c9.io/)

### 待完善功能

- 代码编辑器运行按钮嵌入（参考Shadertoy）
- 代码编辑器折叠按钮和文字美化 （参考Shadertoy）

- 字体大小调整,适配手机横坚屏（参考cnblog)

- shader嵌入支持（屏幕适配及多实例）
- 在线编辑Shader,p5js及表格存档生成对应的引用id,可以通过id以iframe或Shortcode的方式嵌入网页
