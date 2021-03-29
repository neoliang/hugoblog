---
title: Fourier Series
date: "2021-03-09"
url: "/posts/fourier_series"
thumbnail: "preview_images/thumbs/joydivision1.jpg"
image: "img/joy_division_banner.jpg"
description: "Joy Division Sunset"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-ace
categories:
- 数学
---

<!--more-->


{{<p5js code-height=500 noSetup=true defaultFold=true >}}
let ys = []

function draw_serie(A,f,t)
{
  let ox = 0
  let oy = 0
  for(let i = 0;i<17;++i){
    let n = i*2+1
    let B = A*4/(n*PI)
    let y = B*sin(f*n*t)
    let x = B*cos(f*n*t);
    
    stroke(150)
    ellipse(ox,oy,2*B)
    stroke(240)
    line(ox,oy,x+ox,y+oy)
    ox += x
    oy += y
  }

  line(ox,oy,200,oy)
  return oy;
}

t = 0


draw = ()=>{
  background(4)
  stroke(255)
  strokeWeight(1.5)
  translate(width*0.3,height*0.5)
  noFill()  
  let y = draw_serie(50,0.5,t)
  
  ys.unshift(y)
  noFill()
  beginShape()
  for(let i = 0;i<ys.length;++i)
  {
    vertex(200+i,ys[i])
  }
  endShape()
  if(ys.length>10000) ys.pop()
  t += 0.04
  
}

{{</p5js >}}
