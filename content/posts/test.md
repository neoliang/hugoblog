---
title: Demo测试
date: "2020-03-16"
url: "/posts/test"
thumbnail: "img/story-logo-black.svg"
description: "本文测试几个ShortCode功能"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
categories:
- Demo
---
测试shadertoy,p5js、video及shader编辑
<!--more-->

## 一、黑洞简介
  

黑洞是恒星的一种，它的质量和引力巨大以致于连光都不能从内部逃脱。在黑洞周围，由于强引力的作用会引发时空非常大扭曲。这样，即使是被黑洞挡着的恒星发出的光，虽然有一部分会落入黑洞中消失，可另一部分也会通过弯曲的空间中绕过黑洞往前传播，这就是引力透镜效应。

![Anatomy of a black hole. Credit: Illustration: ESO, ESA/Hubble, M.Kornmesser/N.Bartmann](/img/blackhole/intro.jpg)


一个黑洞由四个部分组成（如上图所示 ）[^1]
[^1]:(https://www.technology.org/2019/09/25/leta%C2%80%C2%99s-talk-about-black-holes/)
  

1. 奇点，位于黑洞的最中心，体积无限小，质量无限大的点，这两种特性使得奇点的密度无限大，具有很强大的引力，以至于所有掉入黑洞的物质和能量最终都会坍缩和终结于这里。
1. 事件视界，以奇点为中心某一特定半径的球形区域，物质和能量一旦跨越该边界将被黑洞引力吸入奇点，一去不复返。
1. 吸积盘，事件视界之外的气体、星尘在黑洞强大的引力作用下，会朝向黑洞下落。这个过程被称作“黑洞吸积”。由于气体具有一定的角动量，这些气体在下落过程中会形成一个围绕黑洞高速旋转的盘状结构，如同太阳系的各大行星轨道平面一样，这就是黑洞吸积盘[^2]。
1. 相对论喷流，吸积盘上的气体、星尘有部分会跨越事件视界落入黑洞，从而产生粒子，能量等从黑洞的两极接近光速喷射而出，形成相对论喷流。  
[^2]:(https://zhuanlan.zhihu.com/p/30445343)

## P5
{{<p5js id="2315" code-height=100 >}}
background(0, 0, 100);
{{</p5js >}}

## ace
{{<ace height=100 >}}
console.log("hello world");
{{</ace>}}



##作品展示
{{<chart code-height=360 height=300 >}}
function mandblot(x,y,cx,cy){
  let x1 = x*x-y*y + cx;
  let y1 = 2*x*y + cy;
  return {x:x1,y:y1}
}
function divcount(esp){
  let x = 0;
  let y = 0;
  let N = 500;
  for(let i = 0;i<N;++i)
  {
    let z1 = mandblot(x,y,-0.75,esp)
    x = z1.x;
    y = z1.y;
    let r = x*x+y*y;
    //print(r)
    if( r> 2.0)
    {
      return i;
    }
  }
  return N
}


let testCount = 100;
let esps = Array.from({length:testCount},(v,i)=> -0.1+(i/testCount) * 0.2);
//esps = esps.filter(v => Math.abs(v) >= 0.008)
let dc = esps.map(divcount);
let pis = esps.map((v,i)=> Math.abs(v * dc[i]))

chart_data = {
    type: 'line',
    data: {
    	labels:esps.map(v => v.toPrecision(2)),       
        datasets: [{
            label: '#epsilon',
            data: dc,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min:2.9,
                    //max:3.2
                }
            }]
        }
    }
}
{{</chart>}}

## Another P5
{{<p5js id="2315" >}}
background(0, 0, 10);
ellipse(25,25,30,30);
{{</p5js >}}

{{<shader id="3321" >}}
{{</shader >}}
{{<shader id="33121" >}}
{{</shader >}}

