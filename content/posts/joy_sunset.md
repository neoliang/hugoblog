---
title: Joy Sunset
date: "2020-04-28"
url: "/posts/joy_sunset"
thumbnail: "preview_images/thumbs/joydivision1.jpg"
image: "img/joy_division_banner.jpg"
description: "Joy Division Sunset"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-ace
categories:
- Math
---
 Joy Sunset灵感来源于Joy Division 1979年发行专辑Unkown Pleasures的封面,封面取自于Harold Craft博士的毕业论文《12颗脉冲星的脉冲轮廓和色散的射电观测》中一幅描述CP 1919脉冲星的脉冲轮廓的插图。脉冲星的脉冲轮廓线条充满节奏感，看起来像层叠的小山，它激发了我的灵感，于是我开始着手用代码重现这幅脉冲小山图。
<!--more-->
{{<p5js code-height=500 noSetup=true >}}
let hstep = 20;
function lineHill(x1,x2,y)
{
  let r = (x2-x1)/3.5
  let cx = (x1+x2)/2 ;
  let ls = []
  for(let x=x1;x<=x2;x += hstep)
  {
    let dy = (r - abs(x - cx))*0.6
    dy = dy < 0 ? 0 : dy
    dy = random(0,dy)*0.6
    if(y <= margin*2.5){ dy = random(0,20)*0.2} else 
    {
      dy = 0.8*dy + random(0,20)*0.2
    }
    ls.push(dy)
  }
  return ls
}
let margin = 10
let w = width,h= height;
 
background(0);
colorMode(RGB,1,1,1,1) 
noStroke()

let yStart = 30
strokeWeight(2)
stroke(1);
fill(0);  
for(let y = yStart;y<h-margin;y+= 10){
  let v = (y-yStart)/(h-margin-yStart)
  v = abs(v-0.8)
  v = pow(v,1.5)
  let x1 = margin,x2 = w-margin
  let hill = lineHill(margin,w-margin,y)
  for(let i = 0;i<1;++i){
    beginShape()
    for(let x=x1;x<=x2;x += hstep)
    {
      let dy = hill[int((x-x1)/hstep)]
      dy = dy + randomGaussian(0,dy*0.1)
      curveVertex(x+random(-2,2),y-dy)
    }
    endShape()
  }
}

{{</p5js >}}