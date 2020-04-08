---
title: Demo测试
date: "2020-03-16"
url: "/posts/test"
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


##视频测试
{{<p5js>}}
background(0, 0, 100);
{{</p5js>}}



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



{{<ace height=100 >}}

console.log("hello world");

{{</ace>}}
