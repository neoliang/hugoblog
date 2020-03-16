---
title: Demo测试
date: "2020-03-16"
url: "//test"
description: "本文测试几个ShortCode功能"
classes:
- feature-figcaption
- feature-figcaption-hidden
categories:
- Demo
---
测试shadertoy,p5js、video及shader编辑
<!--more-->


##shader嵌入测试[^1]
[^1]:(https://www.shadertoy.com/view/tslyRH)

{{< shadertoy tslyRH >}}


##shader在线编辑测试
{{< glsl >}}


##视频测试
也许在人类的内心深处有一种强烈的与宇宙建立连接的欲望吧，不怪卡尔萨根说，我们由星尘组成。我们都是天文学家的后代。

{{< video poster="/img/carl-sagan3.jpg" src="/video/wearemadeofstarstuff.MP4" >}}


##飞飞的作品展示
{{< p5js data-height="500" autoplay="true" canvas-width="300">}}
function setup() {
  createCanvas(100, 100);
}

function draw() {
  background(255, 0, 200);
}

{{< /p5js >}}
