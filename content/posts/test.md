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


一个黑洞由四个部分组成（如上图所示 ）
  

1. 奇点，位于黑洞的最中心，体积无限小，质量无限大的点，这两种特性使得奇点的密度无限大，具有很强大的引力，以至于所有掉入黑洞的物质和能量最终都会坍缩和终结于这里。
1. 事件视界，以奇点为中心某一特定半径的球形区域，物质和能量一旦跨越该边界将被黑洞引力吸入奇点，一去不复返。
1. 吸积盘，事件视界之外的气体、星尘在黑洞强大的引力作用下，会朝向黑洞下落。这个过程被称作“黑洞吸积”。由于气体具有一定的角动量，这些气体在下落过程中会形成一个围绕黑洞高速旋转的盘状结构，如同太阳系的各大行星轨道平面一样，这就是黑洞吸积盘[^2]。
1. 相对论喷流，吸积盘上的气体、星尘有部分会跨越事件视界落入黑洞，从而产生粒子，能量等从黑洞的两极接近光速喷射而出，形成相对论喷流。  
[^2]:(https://zhuanlan.zhihu.com/p/30445343)

### P5 Instance
{{<p5js_ins >}}
let w = width,h = height;
sketch.colorMode(sketch.HSB,1,1,1,1)
sketch.background(1);
sketch.noStroke()

let cols =[
  sketch.color(0.0,0.7,0.8),
  sketch.color(0.7,0.1,0.2),
  sketch.color(0.75,0.0,0.8)
  ]
sketch.frameRate(30)
let frame = 0
sketch.draw = ()=>{
  sketch.background(1);
  sketch.stroke(0,0,0.75);
  sketch.noFill();
  sketch.rect(0,0,w,h);
  let i = 0
  ++frame
  for(let x = 40;x<w;x+=50+(i%3)*20)
  {
    sketch.fill(cols[i++%3])
    for(let y = 40;y<h;y+=45)
    {
      let t = sketch.noise(x/500,(y)/500)*40
      let s = (Math.sin((frame/15+t))*-0.5+0.5)*30 
      sketch.ellipse(x+sketch.noise(x/100,y/100,frame/10),y,s,s)
    }
  }
}
{{</p5js_ins >}}
### P5

{{<p5js hideCode=false height=900 code-height=400 >}}
function mix(a,b,v){
return Array.from(a,(v1,i)=> v1*v+b[i]*(1-v))
}
function ballonTail(x,y,t)
{
bezier(x,y,
       x-random(0,t/5),y+0.33*t,
       x+random(0,t/5),y+0.66*t,
       x,y+t)
}
let w = width,h = height
background(41,118,206);
colorMode(RGB,1,1,1,1)
let cols = [
  [144,197,141],  
  [70,14,174],
  [226,20,104], 
  [54,150,141],
  [235,178,40],
  [74,66,149],
  
].map(v=>v.map(vv=>vv/255))

let margin = 10
let space = 2
let s = 100
let rot = (x,y,a)=>{
  translate(x,y)
  rotate(a)
  translate(-x,-y)
}
noStroke()
for(let i = 0;i<600;++i)
{
  let x = random(0,w)
  let y = abs(randomGaussian(0,h/2))
  fill(1,1,1,0.05)
  let r = 50 + abs(randomGaussian(0,50))
  let r1 = random(20,50)
  ellipse(x,y,r,r1)
}
stroke(0.0)
for(let i = 0;i<80;++i){
  let x = random(margin,w-margin)
  let y = random(margin,h-margin)
  let f = (y-margin)/(h-margin)
    //let f = sqrt((x - w/2)*(x - w/2) + (y-h/2)*(y-h/2))
    //f /= 400
    if(f > 1) f = 1
    f = 1-f
    f = pow(f,1.2)
    f = 0.7*f + 0.3*noise(x/800,y/500)
    
    let px = x + randomGaussian(0,100)
    
    let py = y + randomGaussian(0,70)* f
    let a = f*random(-PI,PI)
    //rot(px+s/2,py+s/2,a)
    let value =  f
    //value = sqrt(value)
    //fill(0.+random(0.05),0.9-0.7*value,0.3+0.7*value)
    let ridx = int(random(0,cols.length));
    if(ridx >= 1)
    {
      //ridx = int(random(0,3));
    }
    let col = cols[int(ridx)]
    strokeWeight(0.3)
    stroke(0)
    //noStroke()
    //col = mix(col,cols[1],sqrt(sqrt(f)))
    col = col.map(v => (v * (1-value)+value)).map(v=>0.9*v+value*v*0.1)
    fill(col[0],col[1],col[2],0.85)
    let off = 0.5*random(0,1)*s*0.8 + (1-f) * 0.5*s*0.8
    ellipse(px,py,s-off,s-off)
    strokeWeight(1.)
    stroke(col[0],col[1],col[2],0.65)
    noFill()
    ballonTail(px,py+(s-off)/2,50+random(50))
    fill(col[0],col[1],col[2],0.5)
    ellipse(px,py+(s-off)/2-1,3,3)
    resetMatrix()
} 
{{</p5js >}}

## ace
{{<ace height=100 readOnly=true >}}
console.log("hello world");
{{</ace>}}



##作品展示
{{<chart code-height=360 height=300 hideCode=true >}}
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
{{<p5js  hideCode=true >}}
let w = width;
let h = height;
colorMode(HSB,1,1,1,1)
background(1);

noStroke()
let cols =[
  color(0.0,0.7,0.8),
  color(0.7,0.1,0.2),
  color(0.75,0.0,0.8)
  ]
frameRate(30)
let frame = 0
draw = ()=>{
  background(1);
  stroke(0,0.,0.75);
  noFill();
  rect(0,0,w,h);
  let i = 0
  ++frame
  for(let x = 40;x<w;x+=50+(i%3)*20)
  {
    fill(cols[i++%3])
    for(let y = 40;y<h;y+=45)
    {
      let t = noise(x/500,(y)/500)*40
      let s = (sin((frame/15+t))*-0.5+0.5)*30 
      ellipse(x+noise(x/100,y/100,frame/10),y,s,s)
    }
  }
}
{{</p5js >}}

{{<shader id="3321" >}}
{{</shader >}}


