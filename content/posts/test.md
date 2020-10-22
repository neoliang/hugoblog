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
- feature-ui
categories:
- Demo
---
测试shadertoy,p5js、video及shader编辑
<!--more-->

  
### P5 Instance


{{<row>}}
{{<col width= 0.4 >}}
{{<sliderbar id=test1 width=0.9 title=sigma >}}
{{</col>}}
{{<col width= 0.4 >}}
{{<sliderbar id=test2 width=0.7 >}}
{{<sliderbar id=test2 width=0.7 >}}
{{</col>}}
{{<col width= 0.2 >}}
{{<checkbox id=abcd >}}
{{<checkbox id=tg2dd >}}
{{<checkbox id=tjjd2 >}}
  {{<checkbox id=tjjd2 >}}
{{</col>}}
{{</row>}}
## 1. 多项式插值
{{<rawhtml>}}
  最小二乘法 M:<span id="demo"></span><br>
  <input type="range" min="0" max="100" value="10" class="slider" id="myRange"><br>
   Gauss 基函数 sigma:<span id="sigmaValue"></span><br>
     <input type="range" min="0" max="100" value="50" class="slider" id="sigmaRange"><br>
  
<script type="text/javascript" >
function mix(a,b,f){
  return a*f+(1-f)*b;
}  
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
run_interpolation = null
LeastM = 5

ValueChangedCallback = null
let onSlideInput = function() {
  
  let m = Math.round((slider.value)/100.0 *8 + 2);
  output.innerHTML = m;
  if(m != LeastM){
    LeastM = m
    if(ValueChangedCallback !== null)
      ValueChangedCallback()
  }

}
slider.oninput = onSlideInput;
onSlideInput();

GaussSigma = 1
var sigmaSlider = document.getElementById("sigmaRange");
var sigmaOutput = document.getElementById("sigmaValue");
let onSigmaSlideInput = function(){
    let s = Math.round((sigmaSlider.value)/100.0 *29 + 1);
    sigmaOutput.innerHTML = s
    if(s != GaussSigma)
    {
      GaussSigma = s
      if(ValueChangedCallback != null)
        ValueChangedCallback()
    }
}
sigmaSlider.oninput = onSigmaSlideInput
onSigmaSlideInput()

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

function Polynomial(points)
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
        for (let j = 1; j < n; ++j)//a0+a1x+a2x^2
        {
            matrix[i][j] = matrix[i][j - 1] * points[i].x;
        }
        matrix[i][n] = points[i].y; 
    }
    GaussianElimination(matrix);
    return x => {
        let y = matrix[0][n];
        let dx = x;
        for (let i = 1; i < n; ++i)
        {
            y += matrix[i][n] * dx;
            dx *= x;
        }
        return y;
    }
}
let add = (a,b) => a+b
//f(x) = a0+a1x+a2x^2...+amx^m
function LeastSquare(points,m)
{
  m = Math.min(points.length-1,m)
  let matrix = Array.from({length:m+1})
  for (let j = 0; j <= m; j++) {
    matrix[j]=Array.from({length:m+2})
    for (let i = 0; i <=m; i++) {
      matrix[j][i] = points.map(p=>p.x**i * p.x**j).reduce(add)
    }
    matrix[j][m+1] = points.map(p=>p.y * p.x**j).reduce(add)
  }
  GaussianElimination(matrix);
  return x => {
        let y = matrix[0][m+1];
        let dx = x;
        for (let i = 1; i <= m; ++i)
        {
            y += matrix[i][m+1] * dx;
            dx *= x;
        }
        return y;
    }
}
function G(points,x,i){
  let dx = x-points[i].x;
  return Math.exp(-0.5*dx*dx/(GaussSigma*GaussSigma))
}
function Gaussian(points)
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
            console.log(G(points,points[i].x,j));
            matrix[i][j] = G(points,points[i].x,j);

        }

        matrix[i][n] = points[i].y; 
        console.log(matrix[i]);
    }
    console.log("ddd",matrix)
    GaussianElimination(matrix);

    return x => {
        let y = matrix[0][n];
        for (let i = 1; i < n; ++i)
        {
            y += matrix[i][n] * G(points,x,i);
        }
        return y;
    }
}
</script>
{{</rawhtml>}}
{{<p5js id=interpolation height=420 >}}
function P(x,y){
  return {x:x,y:y};
}
function DrawFunc(f, xa, xb,c)
{
    let x = xa, y = f(x)
    let N = 200;
    stroke(c);
    for (let t = 1/N; t <= 1; t+=1.0/N)
    {
        let x1 = xa*(1-t)+t*xb;
        let y1 = f(x1);       
        line(x,y,x1,y1);
        x = x1,y = y1;
    }
}
let radius = 8;
let points = [P(0.05,0.4),P(0.2,0.15),P(0.4,0.5),P(0.65,0.7),P(0.9,0.3)].map(p=>P(p.x*width,p.y*height))
let selectedIdx = -1;
function distance(a,b)
{
  return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
//double click to delete 
function doubleClicked() {
  let mP = P(mouseX,mouseY);
  let clickedIdx = points.findIndex(p=> distance(p,mP) <= radius)
  points[clickedIdx] = points[points.length-1];
  points.pop();
  DrawInterpolations()
}
function mousePressed(){
  let mP = P(mouseX,mouseY);
  selectedIdx = points.findIndex(p=> distance(p,mP) <= radius)
  console.log("mousePressed",mouseX,mouseY,selectedIdx)
  if(selectedIdx == -1)
  {
    selectedIdx = points.length
    points.push(P(mouseX,mouseY))
    DrawInterpolations()
  }
}
function mouseReleased(){
  selectedIdx = -1;
}
function mouseDragged() {
  if(selectedIdx >=0)
  {
    points[selectedIdx]=P(mouseX,mouseY)
    DrawInterpolations()
  }
}
function DrawInterpolations()
{
  background (.976, .949, .878);
  fill(color(1., .812, .337))
  strokeWeight(1.)
  points.forEach(p=>ellipse(p.x,p.y,radius,radius))
  let polyInterFunc = parent.Polynomial(points)
  let blue = color(0.,.369, .608)
  strokeWeight(1)
  DrawFunc(polyInterFunc,0,width,blue);
  let leastInterFunc = parent.LeastSquare(points,parent.LeastM);
  let red = color(.667,.133, .141)
  DrawFunc(leastInterFunc,0,width,red);
  let gaussianInterFunc = parent.Gaussian(points);
  let yellow = color(0.1,0.8)
  DrawFunc(gaussianInterFunc,0,width,yellow);
} 
function setup () {  
  colorMode(RGB,1.0)
  DrawInterpolations();
  parent.ValueChangedCallback = DrawInterpolations
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


