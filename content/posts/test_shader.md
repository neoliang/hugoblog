---
title: Demo-测试2
date: "2020-03-16"
url: "/posts/test_shader"
thumbnail: "preview_images/thumbs/mandelbrot1.jpg"
image: "img/mandelbrot_banner1.jpg"
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


{{<shader code-height=410 height=400 hideCode=false >}}
float mandelbrot(vec2 c){
    const float N = 123.;
    vec2 z = vec2(0.);
    float iter = 0.;
    for(float i = 0.;i<1.0;i+=1./N)
    {
        z = vec2(1.*(z.x*z.x-z.y*z.y),2.0*z.x*z.y)+c;
        if(dot(z,z)>4.) break;
        float t = z.x;
        ++iter;
    }
    return iter/N;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    vec2 c = 3.*uv;
    c.x -= 0.4;
    float n = mandelbrot(c);
    vec3 red = mix(vec3(0.05,0.12,0.3),vec3(0.9),0.2);
    float circle = smoothstep(0.0,0.01,length(uv) - .5);
    vec3 v = mix(vec3(0.92),red,pow(n,0.25));;    
    v = mix(v,red,circle);
    fragColor = vec4(v,1.0);
}

{{</shader >}}

### Mandelbrot
Mandelbrot的定义：{{<math>}}f(z)=z^2+c{{</math>}}
{{<p5js noSetup= true >}}
//f(z) = z^2+c
~~~//隐藏的代码
function mandblot(x,y,cx,cy){
  let x1 = x*x-y*y + cx;
  let y1 = 2*x*y + cy;
  return {x:x1,y:y1};
}
function mandelblotSet(cx,cy){
  let x = 0;
  let y = 0;
  for(let i = 0;i<N;++i)
  {
    let z1 = mandblot(x,y,cx,cy)
    x = z1.x;
    y = z1.y;
    let r = x*x+y*y;
    if( r > 4.0)
    {
      return i;
    }
  }
  return N
}
~~~
let _x=0;
let N = 500;

background(0);

pixelDensity(1);
loadPixels();
while(true){
  if(_x >= width){
    noLoop(); 
    break;
  }
  for(let y = 0; y < height; y++){
    let my = 2*(y/height) - 1;//-1,1
    let mx = 2*(_x/width) - 1; //-2,2
    mx *= width/height;//宽高比修正
    mx -= 0.5;
    let temp = mandelblotSet(mx, my);
    let v = temp / N * 255;
    let si = 4*(y*width+_x);
    pixels[si] = pixels[si+1] = pixels[si+2] = v ;
    pixels[si+3] = 255;
  }
  ++_x;
} 
updatePixels();

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
    if( r > 4.0)
    {
      return i;
    }
  }
  return N
}

//计算mandelbrot的脖子
var testCount = 150;
var esps = Array.from({length:testCount},(v,i)=> -0.1+(i/testCount) * 0.2);
//esps = esps.filter(v => Math.abs(v) >= 0.008)
var divcount = (esp)=>mandelblotSet(-0.75,esp); 
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