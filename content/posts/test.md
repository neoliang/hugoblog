---
title: Demo测试
date: "2010-03-16"
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

  
### P5 Instance
{{<p5js_ins  >}}


let w = width,h = height;
sketch.colorMode(sketch.HSB,1,1,mix(0.8,0.1,0.5),1)
sketch.background(1);
sketch.noStroke()

let cols =[
  sketch.color(0.0,0.7,sigma),
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


## 1. 多项式插值
{{<rawhtml>}}
  Sigma: <span id="demo"></span><br>
  <input type="range" min="0" max="100" value="50" class="slider" id="myRange">
  
<script type="text/javascript" >
function mix(a,b,f){
  return a*f+(1-f)*b;
}  
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
run_interpolation = null
onSlideInput = function() {
  output.innerHTML = slider.value/100;
  sigma = (slider.value)/100.0;
  if(run_interpolation != null)
    run_interpolation();
}
slider.oninput = onSlideInput;
onSlideInput();

function GaussianElimination(matrix)
{
    let N = matrix.length;
    if (N != matrix[0].length - 1)
        return
    for (let row = 0; row < N - 1; ++row)
    {
        //step0 find maxrow and swap
        let maxE = matrix[row][row];
        let maxIdx = row;
        for (let i = row + 1; i < N; ++i)
        {
            if (maxE < matrix[i][row])
            {
                maxE = matrix[i][row];
                maxIdx = i;
            }
        }
        //0.1 swap
        if (maxIdx != row)
        {
            for (let j = row; j < N + 1; ++j)
            {
                let t = matrix[maxIdx][j];
                matrix[maxIdx][j] = matrix[row][j];
                matrix[row][j] = t;
            }
        }
        if (Math.abs(matrix[row][row]) < 0.001)
        {
          return;
        }
        //elimination cols below row
        for (let i = row + 1; i < N; ++i)
        {
            let ef = -matrix[i][row] / matrix[row][row];
            for (let j = row; j < N + 1; ++j)
            {
                matrix[i][j] += ef * matrix[row][j];
            }
        }
    }
    //elimination cols up row
    for (let row = N - 1; row >= 0; --row)
    {
        matrix[row][N] = matrix[row][N] / matrix[row][row];
        matrix[row][row] = 1.0;
        for (let j = row - 1; j >= 0; --j)
        {
            //
            matrix[j][N] -= matrix[row][N] * matrix[j][row];
            matrix[j][row] = 0;
        }
    }
}

function GetPolynomialInterpolation(points)
{
    if (points == null || points.length <= 1) //点必须大于1
    {
        return null;
    }
    let n = points.length;
    let matrix = Array.from({length:n});
    for (let i = 0; i < n; ++i)
    {
        matrix[i] = Array.from({length:n});
        matrix[i][0] = 1;//常数项
        for (let j = 1; j < n; ++j)
        {
            matrix[i][j] = matrix[i][j - 1] * points[i].x;
        }
        matrix[i][n] = points[i].y; 
    }
    GaussianElimination(matrix);
    return (x) =>
    {
        let y = matrix[0][n];
        let dx = x;
        for (let i = 1; i < n; ++i)
        {
            y += matrix[i][n] * dx;
            dx *= x;
        }
        return y;
    };
}
</script>
{{</rawhtml>}}
{{<p5js id=interpolation height=420 >}}
function P(x,y){
  return {x:x,y:y};
}
function DrawFunc(f, xa, xb,c)
{
    let x = xa;
    let y = f(x);
    let N = 200;
    for (let i = 1; i <= N; ++i)
    {
        let t = float(i) / N;
        let x1 = xa*(1-t)+t*xb;
        let y1 = f(x1);
        //stroke(c);
        line(x,y,x1,y1);

        x = x1;
        y = y1;
    }
}
let radius = 8;
let points = [P(50,50),P(100,250),P(300,height*0.5),P(width*0.75,height*0.7),P(width*0.9,height*0.68)]
let selectedIdx = -1;
let interFunc = null;
function distance(a,b)
{
  return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function mousePressed(){
  console.log("mousePressed",mouseX,mouseY)
  selectedIdx = -1;
  for(let i = 0;i<points.length;++i)
  {
    let d = distance(points[i],P(mouseX,mouseY))
    if(d <= radius) 
    {
      selectedIdx = i;
      break;
    }
  }
  if(mouseButton === RIGHT && selectedIdx !== -1)//del selected
  {
    points[selectedIdx] = points[points.length-1];
    points.pop();
    selectedIdx = -1;
    interFunc = parent.GetPolynomialInterpolation(points)
  }
  else if(selectedIdx == -1)
  {
    selectedIdx = points.length
    points.push(P(mouseX,mouseY))
    interFunc = parent.GetPolynomialInterpolation(points)
  }
}
function mouseReleased(){
  selectedIdx = -1;
}
function mouseDragged() {
  if(selectedIdx >=0)
  {
    points[selectedIdx]=P(mouseX,mouseY)
    interFunc = parent.GetPolynomialInterpolation(points)
  }
}

function setup () {
  //createCanvas (800, 400);
  interFunc = parent.GetPolynomialInterpolation(points)
}
function draw(){
  colorMode(RGB,1.0);background (.976, .949, .878);
  fill(0)
  points.forEach(p=>ellipse(p.x,p.y,radius,radius))
  if(interFunc != null)
  {
    DrawFunc(interFunc,0,width);
  }
  
}
{{</p5js>}}

---

#### 气球
{{<p5js hideCode=false noSetup=true height=900 code-height=400 >}}

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

## ace 只读代码嵌入测试
{{<ace height=300 readOnly=true >}}
console.log("hello world");
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
{{</ace>}}



## 表格展示
### mandelbrot neck divergent count
{{<chart code-height=360 height=300 hideCode=false >}}
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
### 表格多实例测试
{{<chart code-height=360 height=300 hideCode=true >}}
chart_data =  {
  type: 'bar',
  data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }
}
{{</chart>}}
## Another P5
{{<p5js  noSetup=true hideCode=true >}}
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

## shader 嵌入测试
{{<shader >}}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
  vec2 position = - 1.0 + 2.0 * fragCoord.xy / iResolution.xy;
  float red = abs( sin( position.x * position.y + iTime / 5.0 ) );
  float green = abs( sin( position.x * position.y + iTime / 4.0 ) );
  float blue = abs( sin( position.x * position.y + iTime / 3.0 ) );
  fragColor = vec4( red, green, blue, 1.0 );

}
{{</shader >}}


