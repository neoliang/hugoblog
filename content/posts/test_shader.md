---
title: Demo-测试2
date: "2020-03-16"
url: "/posts/test_shader"
thumbnail: "img/story-logo-black.svg"
description: "测试Shader功能"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
- feature-math
categories:
- Demo
---
测试shadher
<!--more-->


## shader 嵌入测试


{{<shader code-height=210 height=400 hideCode=false >}}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    vec2 m = iMouse/iResolution.xy;
    // Time varying pixel color
    vec3 col = vec3(uv*m,0.0);

    // Output to screen
    fragColor = vec4(col,1.0);
}
{{</shader >}}

### Mandelbrot
Mandelbrot的定义：{{<math>}}f(z)=z^2+c{{</math>}}
{{<p5js >}}
let  depth = 100;
let i;
let ii, rr;

function setup(){
  background(0);
  i = 0;
}

function draw(){
  loadPixels();
  //println(float(i)/width);
  for(let p = 0; p < 10; p++){
    
    i++;
    
    if(i >= width){
      noLoop(); 
      break;
    }
      for(let j = 0; j < height; j++){
        let mx, my;
        mx = map(i, 0, width, -2, 1);
        my = map(j, 0, height, 1.5, -1.5);
        let temp = iterate(mx, my, depth);
        pixels[j*width+i] = color(map(temp, 0, depth, 0, 255));
      }
    
  }
  updatePixels();
}

function iterate( a,  b,  max){
  let i, r, tri;
  let count = 0;
  r = a;
  i = b;
  for(let q = 0; q < max; q++){
    count++;
    rr = r*r;
    ii = i*i;
    tri = 2*r*i;
    r = rr+ii*-1+a;
    i = tri+b;
    if(r*r+i*i > 4){break;}
  }
  return count;
}
{{</p5js>}}
{{<ace readOnly=true allowRunning=true disableFoldButton=true >}}
//f(z) = z^2+c
function mandblot(x,y,cx,cy){
  let x1 = x*x-y*y + cx;
  let y1 = 2*x*y + cy;
  return {x:x1,y:y1};
}

let N = 500;
function mandelblotSet(cx,cy){
  let x = 0;
  let y = 0;
  for(let i = 0;i<N;++i)
  {
    let z1 = mandblot(x,y,cx,cy)
    x = z1.x;
    y = z1.y;
    let r = x*x+y*y;
    if( r> 2.0)
    {
      return i;
    }
  }
  return N
}

//计算mandelbrot的脖子
let testCount = 100;
var esps = Array.from({length:testCount},(v,i)=> -0.1+(i/testCount) * 0.2);
//esps = esps.filter(v => Math.abs(v) >= 0.008)
let divcount = (esp)=>mandelblotSet(-0.75,esp); 
var dc = esps.map(divcount);
{{</ace>}}

在脖子的边界处，发散趋势成正态分布，如下图：
{{<chart code-height=360 height=300 hideCode=false defaultFold=true >}}

chart_data = {
    type: 'line',
    data: {
      labels:esps.map(v => v.toPrecision(2)),       
        datasets: [{
            label: '迭代发散分布',
            data: dc,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                }
            }]
        }
    }
}
{{</chart>}}

如果将发散数量与距离边界的值相乘，可以发现，离边界越近，结果与{{<math>}}\pi{{</math>}}越相近
{{<chart code-height=360 height=300 hideCode=false defaultFold=true >}}
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
                    min:2.9,
                    max:3.2
                }
            }]
        }
    }
}
{{</chart>}}