---
title: Mandelbrot
date: "2020-04-16"
url: "/posts/mandelbrot"
thumbnail: "preview_images/thumbs/mandelbrot1.jpg"
image: "img/mandelbrot_banner1.jpg"
description: "神秘美丽的Mandelbrot介绍"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
- feature-math
categories:
- essay,math
---
记得《2001太空漫游》的作者阿瑟克加克与霍金、卡尔萨根参加过一个节目，主题是关于神、宇宙及一切[^1][^2]。在节目中阿瑟展示了他亲自编写的Mandelbrot图形程序。
<!--more-->

阿瑟向观众介绍可以像操作显微镜一样，放大图形的任意局部细节，而这个放大的过程可以无限循环下去，随着放大的倍数增加，程序展示出了不同的图形细节。该电视节目是在1988年播出的，那时计算机的处理器运算能力还比较弱，差不多处于80386的水准，专业显卡还未问世。阿瑟不得不让他的计算机彻夜的工作20多个小时才能完成某些局部细节的渲染。而现在就算以60PFS实时渲染Mandelbrot对于显卡来说只不过是小菜一碟，例如下图展示的就是Mandelbrot实时放大的效果:
[^1]:(https://www.bilibili.com/video/BV1RW411p7PN)
[^2]:(https://www.youtube.com/watch?v=HKQQAv5svkk)

{{<shader code-height=400 height=400 defaultFold=false >}}
float mandelbrot(vec2 c){
    const float N = 123.;
    vec2 z = vec2(0.);
    for(float i = 0.;i<1.0;i+=1./N)
    {
        z = vec2(1.*(z.x*z.x-z.y*z.y),2.0*z.x*z.y)+c;
        if(dot(z,z)>4.) return i/2.;
        float t = z.x;
    }
    return 1.;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    
    vec2 c = vec2(-.7452,.186) + 2.45*uv *pow(.0015,1.+cos(.2*iTime));
    
    float n = mandelbrot(c);
    vec3 red = mix(vec3(0.05,0.12,0.4),vec3(1),0.2);
    float circle = smoothstep(0.0,0.01,length(uv) - .5);
    vec3 v = mix(vec3(0.92),red,n);;    
    v = mix(v,mix(red,vec3(1),0.1),circle);
    fragColor = vec4(v,1.0);
}
{{</shader >}}

## Mandelbrot集合
上面动画展示的是Mandelbrot集合的图形化效果，Mandelbrot集合是指复平面上使函数{{<math>}}f(z)=z^2+c{{</math>}}不发散的所有点c的集合[^3]。Mandelbrot有一个定理，只有复平面上的点的模（长度）小于2，该点才在集合中。Mandelbrot集合比较适合中代码来表示，js代码如下：
[^3]:(https://en.wikipedia.org/wiki/Mandelbrot_set)

{{<ace readOnly=true allowRunning=true disableFoldButton=true >}}
//f(z) = z^2+c
function mandblot(z,c){
  return {
    x:z.x*z.x-z.y*z.y + c.x,
    y:2*z.x*z.y + c.y
  }
}
function mandelblotSet(c,inf){
  let z = {x:0,y:0};
  for(let i = 0;i<inf;++i)
  {   
    z = mandblot(z,c);
    if( z.x*z.x+z.y*z.y > 4.0) //半径大于2，发散
      return i;
  }
  return inf;
}
{{</ace>}}
实际上不在集合中的点发散得比较快，下图统计了256x256大小的Mandelbrot图像上的所有点的经历1～10次迭代后的发散分布情况，从图上可以看出经过1到2次迭代就发散点有40930个，比例高达60%。
{{<chart code-height=360 height=300 hideCode=false defaultFold=true >}}
let width = 256,height = 256;
let inf = 10;
let divCount = Array.from({length:inf+1},()=> 0);
for(let i = 0;i<width;++i)
{
  for(let j = 0;j<height;++j)
  {
    let x = i/width * 4 -2;
    let y = j/height* 4 -2;
    let div = mandelblotSet({x:x,y:y},inf);
    ++divCount[div];
  }
}
chart_data = {
    type: 'line',
    data: {
      labels:divCount.map((v,i)=>i+1),      
        datasets: [{
            label: '点c发散分布',
            data: divCount,
        }]
    },
}
{{</chart>}}

## Mandelbrot集合的脖子
Mandelbrot集合中一个个比较有趣的点在脖子的边界处的点的发散趋势，即下图的红色球和蓝色球的交界处：
![Mandelbrot集合的脖子](/img/mandelbrot_neck.jpg)
David Boll[^4]曾经试图证明红蓝球交界处的厚度为0，他在计算机上计算交界处`0.75+εi`的发散数，发现当ε = 0.0000001时，c点在经历了31415928次迭代后开始发散，用迭代数与ε相乘，这个值恰好与{{<math>}}\pi{{</math>}}相近。
[^4]:(https://en.wikipedia.org/wiki/Special:BookSources/978-0-262-56127-3)

下图是我取交界处150个数计算的发散趋势的分布情况，从图上可以看出，越接近交界，发散所需要的迭代数越大，迭代数相对于ε趋于正态布。
{{<chart code-height=240 height=300 hideCode=false defaultFold=true >}}
var testCount = 150;
var esps = Array.from({length:testCount},(v,i)=> -0.1+(i/testCount) * 0.2);
//esps = esps.filter(v => Math.abs(v) >= 0.008)
var divcount = (esp)=>mandelblotSet({x:-0.75,y:esp},500); 
var dc = esps.map(divcount);
chart_data = {
    type: 'line',
    data: {
      labels:esps.map(v => v.toPrecision(2)),       
        datasets: [{
            label: '迭代发散分布',
            data: dc,
        }]
    },
}
{{</chart>}}
如果将发散数量与ε相乘，可以发现，离边界越近，结果与{{<math>}}\pi{{</math>}}越相近
{{<chart code-height=360 height=300 hideCode=false defaultFold=true >}}
var esps = Array.from({length:testCount},(v,i)=> -0.1+(i/testCount) * 0.2);
esps = esps.filter(v=> Math.abs(v) > 0.008); 
var dc = esps.map(divcount);
var pis = esps.map((v,i)=> Math.abs(v * dc[i]))
chart_data = {
    type: 'line',
    data: {
      labels:esps.map(v => v.toPrecision(2)),       
        datasets: [{
            label: 'PI分布',
            data: pis,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min:3.06,
                    max:3.2
                }
            }]
        }
    }
}
{{</chart>}}

## Mandelbrot集合的面积
### 像素计数法
目前，Mandelbrot集合面积精度最高的近似值是`1.506484`[^5],人们还未找到求面积的公式，这个值主要通过数值方法计算出来的近似值。一种比较简单计算Mandelbrot集合面积的方法是使用像素点计数方法，例如对于一张`256x256`的图片，将图片上的所有像素点执行迭代，找出那些经历过一定数量迭代而不发散的像素点，将他们的面积相加，对应的代码如下：
[^5]:(https://www.fractalus.com/kerry/articles/area/mandelbrot-area.html)

{{<ace readOnly=true allowRunning=true disableFoldButton=true >}}
function MandelbortArea(size,inf){
  let area = 0;
  let smallArea = 16/ (size*size);
  for(let i = 0;i<size;++i)
  {
    for(let j = 0;j<size;++j)
    {
      let x = i/size * 4 -2;
      let y = j/size* 4 -2;
      let div = mandelblotSet({x:x,y:y},inf);
      if(div >= inf)
      {
        area += smallArea;
      }
    }
  }  
  return area;
}
{{</ace>}}
随时图形尺寸和最大迭代次数(代码中的inf参数)的增加，计算出来的面积也会越来越接近真实值，下图展示了通过像素计数方法使用不同图片尺寸计算出来面积值
{{<chart code-height=100 height=300 hideCode=false defaultFold=true >}}
let sizes = [32,64,128,256,512,1024];
let areas = sizes.map(v=> MandelbortArea(v,100))
chart_data = {
    type: 'line',
    data: {
      labels:sizes,       
        datasets: [{
            label: '面积',
            data: areas,
        }]
    }
}
{{</chart>}}
### 蒙特卡罗方法
逐个像素点计算的方法效率比较低，另一种比较常用的方法是蒙特卡罗方法，该方法随机从数素点中抽样计算，再根据概率做相应的调整，代码如下：
{{<ace readOnly=true allowRunning=true disableFoldButton=true >}}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}
function MonteCarloMandelbortArea(sampler){
  let size = 1024;
  let inf = 100;
  let area = 0;
  let smallArea = 16/ (size*size);
  let pdf = sampler / (size*size)

  for(let i = 0;i<sampler;++i)
  {
    let x =  getRandomInt(0,size) / size * 4 - 2;
    let y =  getRandomInt(0,size) / size * 4 - 2;
    
    let div = mandelblotSet({x:x,y:y},inf);
    if(div >= inf)
    {
      area += smallArea / pdf;
    }
  }  
  return area;
}
{{</ace>}}
上面的代码采用的图片尺寸为1024*1024,最大迭代次数为100，面积的的近似值与采样有关，采样越高，面积与真实值越接近，下图展示了不同采样计算出来的面积
{{<chart code-height=100 height=300 hideCode=false defaultFold=true >}}
let samplers = Array.from({length:100},(v,i)=> 100*(i+1));
let areas = samplers.map(MonteCarloMandelbortArea)
chart_data = {
    type: 'line',
    data: {
      labels:samplers,       
        datasets: [{
            label: '面积',
            data: areas,
        }]
    }
}
{{</chart>}}
从上图可以看出，随着采样次数的增加，面积越接近1.5。
## 小结
Mandelbrot集合还有一些其它比较有趣的特性，比如可以从中找到斐波那契数列[^6],有许多艺术家和程序员对它比较入迷，而它最吸引我的地方可能是在于简单规律后蕴藏着那复杂而精美的结构，我想这也许是数学和程序引人入胜的主要原因吧。
[^6]:(https://www.youtube.com/watch?v=4LQvjSf6SSw)