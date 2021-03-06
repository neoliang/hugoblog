---
title: 插值与拟合
date: "2020-10-22"
url: "/posts/interpolation"
description: "几种插值与拟合算法实现"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-ace
- feature-ui
- feature-math
categories:
- Math
- Geometry
---
本文描述不同的插值与拟合算法实现，并用程序语言以图形化的方式展示不同插值和拟合函数，通过图形化的表示，我们可以直观和清晰认识到各种不同插值和拟合函数优缺点，例如函数的平滑度、准确度等。
<!--more-->
插值（interpolation）是一种通过已知的、离散的数据点，在范围内求新数据点的过程或方法。求解科学和工程的问题时，通常有许多数据点借由采样、实验等方法获得，这些数据可能代表了有限个数值函数，其中自变量的值。而根据这些数据，我们往往希望得到一个连续的函数（也就是曲线）；或者更密集的离散方程与已知数据互相吻合，这个过程叫做拟合[^1]。

[^1]:(https://en.wikipedia.org/wiki/Interpolation)

比如天文学家开普勒观察火星运行之后记录（下列数字纯属虚构）：
周一，火星距离太阳3万公里
周二，火星距离太阳6万公里
周三，雾霾，没有观测数据
周四，火星距离太阳5万公里
周五，火星距离太阳7万公里
要想知道周三的数据，我们先把这个数据变得数学一些：
- x=1，y=3
- x=2，y=6
- x=4，y=5
- x=5，y=7
- 求x=3时，y=?这个题怎么做[^2]？

有许多不同的插值方法可以解决上述的问题，其中一些在将下面描述。在选择适当的算法时需要考虑的一些问题是：方法有多准确？ 它的计算成本有多高？ 插值有多平滑？

[^2]:(https://www.matongxue.com/madocs/126/)

# 什么是插值？

前面提到拟合是根据数已知的数据集，我们可以找到一个连续的函数或者更密集的离散方程与已知数据互相吻合，插值是已经数据点全部经过拟合函数的一种特殊情况。

给定n个离散数据点（称为节点）{{<math>}} (x_{k},y_{k}) k=1,2,...,n{{</math>}}。对于{{<math>}}x,(x\neq x_{k},k=1,2,...n){{</math>}}，求{{<math>}}x{{</math>}}所对应的{{<math>}}y{{</math>}}的值称为内插。

{{<math>}}f(x){{</math>}}为定义在区间{{<math>}}[a,b]{{</math>}}上的函数。{{<math>}}x_{1},x_{2},x_{3}...x_{n}{{</math>}}为{{<math>}}[a,b]{{</math>}}上 n 个互不相同的点，{{<math>}}G{{</math>}}为给定的某一函数类。若{{<math>}}G{{</math>}}上有函数{{<math>}}g(x){{</math>}}满足：

- {{<math>}}g(x_{i})=f(x_{i}),k=1,2,...n{{</math>}}

则称{{<math>}}g(x){{</math>}}为{{<math>}}f(x){{</math>}}关于节点{{<math>}}x_{1},x_{2},x_{3}...x_{n}{{</math>}}在{{<math>}}G{{</math>}}上的插值函数。



## 一、线性插值

考虑上面估计周三火星到太阳的距离，即求{{<math>}}f(3){{</math>}},由于3在2和4之间，最简单的办法就是对x=2和x=4对应的两个点{{<math>}}(x_a,y_a){{</math>}}和{{<math>}}(x_b,y_b){{</math>}}做线性插值，对应的公式为：
- {{<math>}}y=y_a+(y_b-y_a) * \frac{x-x_a}{x_b-x_a}{{</math>}}
对任意相邻的两个点做线性插值，可以得到分段线性插值，相应的插值结果如下图所示
>鼠标左键选中点拖动，单击空白处添加新点，双击删除

{{<jsfile src=/js/posts/interpolation.js >}}

{{<p5js id=interpolation defaultFold=true >}}
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function LinearInterpolation(points)
{
  let ps = points.map(p=>P(p.x,p.y))//copy
  ps.sort((a,b)=>a.x-b.x)
  return x=>{
    let i = ps.findIndex(p=>p.x > x)
    if(i<0) i=ps.length-1
    i = Math.min(ps.length-1,Math.max(i,1))
    //线性插值
    let f = (x - ps[i-1].x)/(ps[i].x-ps[i-1].x)
    return ps[i-1].y*(1-f)+f*ps[i].y;
  }
}
function DrawInterpolations()
{
  background (.976, .949, .878);
  fill(color(1, 0.81, 0.34))
  points.forEach(p=>ellipse(p.x,height-p.y,6,6))
  let polyInterFunc = LinearInterpolation(points)
  let blue = color(0,0.369, 0.608)
  parent.Plot(this,polyInterFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  DrawInterpolations();
  parent.HandleMouse(this,points,6,DrawInterpolations)
}
{{</p5js>}}
分段的线性插值在每一个插值点的突变比较明显，自然界中很少见这种弯折的线段，不管是汽车的行驶路线还是行星的运动轨迹，都是平滑的，都不会在在某一个点有明显的突变或弯折。因为运行的物体速度或加速度的变化在时间上是连续的，不太可能会出现跳跃情况。这就要相应的插值函数具有多阶可导的性质，多项式插值就是其中一类函数。

## 二、多项式插值

多项式插值是线性插值的推广。线性插值是一个线性函数。我们现在用一个更高阶的多项式代替这个插值。 对于n个点{{<math>}}P_j(x_j,y_j), j=1,2,\dots,n{{</math>}}，可以使用多项式函数
- {{<math>}}f(x)=\sum_{i=0}^{n-1}\alpha_i B_i(x){{</math>}} 插值 {{<math>}}\{P_j\}{{</math>}}，其中 {{<math>}}B_i(x)=x^i{{</math>}}
求插值函数有多种方法，我们逐一来介绍

### 2.1 线性方程组与高斯消元法
考虑上面的火星运行轨迹，有四个已知点，可以联立方程组求出{{<math>}}f(x)=a+bx+cx^2+dx^3{{</math>}}这个三次多项式的参数{{<math>}}a,b,c,d{{</math>}}
{{<math>}}
\begin{cases}
    3=a+b+c+d\\
    6=a+2b+4c+8d\\
    5=a+4b+16c+64d\\
    7=a+5b+25c+125d
\end{cases}
{{</math>}}
有4个未知数和4个方程，我们可以求出三次多项式（如果有唯一解的话）一定同时经过已知的四个点。

求解线性方程组常用的方法是高斯消元法，高斯消元法的原理比较简单，通常用矩阵来表示方程组的系数，我们先从上到下，从左到右逐列消除矩阵左下角的的元素，然后按相反的操作顺序消除右上角的元素，即可解出方程，具体过程如下[^3]：
![高斯消元法实现过程](/img/gaussian_elimination.jpg)
值得注意的是，我们在消除左下角的元素时，可能会出现当前对角线的元素为零的情况，但我们可以找到该元素所有的列后面最大的非零元素，然后将最大元素所在的行与当前行变换即可。如果最大元素为零，那么表示方程无解。相关代码如下：
{{<ace allowRunning=true >}}
function GaussianElimination(matrix)
{
    let N = matrix.length;
    if (N != matrix[0].length - 1)
        return
    for (let row = 0; row < N - 1; ++row)
    {
        //step0 find max index of row
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
        //0.1 swap max row
        if (maxIdx != row)
        {
          let t = matrix[maxIdx];
          matrix[maxIdx] = matrix[row]
          matrix[row] = t;
        }
        if (Math.abs(matrix[row][row]) < 0.0001)
        {
          return;
        }
        //step 1 elimination cols below row
        for (let i = row + 1; i < N; ++i)
        {
            let ef = -matrix[i][row] / matrix[row][row];
            for (let j = row; j < N + 1; ++j)
            {
                matrix[i][j] += ef * matrix[row][j];
            }
        }
    }
    //step2 elimination cols up row
    for (let row = N - 1; row >= 0; --row)
    {
        matrix[row][N] = matrix[row][N] / matrix[row][row];
        matrix[row][row] = 1.0;
        for (let j = row - 1; j >= 0; --j)
        {
            matrix[j][N] -= matrix[row][N] * matrix[j][row];
            matrix[j][row] = 0;
        }
    }
}  
//多项式插值
function Polynomial(points)
{
    let n = points.length;
    let matrix = Array.from({length:n},(_,i)=>{
      //f(x) = a0+a1*x+a2*x^2...+an*x^n
      let vecA = Array.from({length:n},(v,k)=>points[i].x**k)
      vecA.push(points[i].y)
      return vecA
    })
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
{{</ace>}}

相应的插值图形如下：
>鼠标左键选中点拖动，单击空白处添加新点，双击删除

{{<p5js defaultFold=true codeHeight=280 >}}
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function DrawInterpolations()
{
  background (.976, .949, .878);
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  let polyInterFunc = parent.Polynomial(points)
  let blue = color(0.,.369, .608)
  parent.Plot(this,polyInterFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  fill(color(1, 0.81, 0.34))
  DrawInterpolations();
  parent.HandleMouse(this,points,radius,DrawInterpolations)
}
{{</p5js>}}
[^3]:(https://en.wikipedia.org/wiki/Gaussian_elimination)


### 2.2 拉格朗日插值法
{{<rawhtml>}}
<script type="text/javascript">
let points = [[0.2,0.7],[0.5,0.5],[0.85,0.85]]
let radius = 6
let sigma = 60;
let absPoints = (p5) =>
  points.map(p=>P(p[0]*p5.width,p[1]*p5.height))
function DrawLagrangePoints(p5,c=0)
{
  p5.fill(p5.color(1, 0.81, 0.34))
  p5.stroke(c)
  absPoints(p5).forEach(p=>p5.ellipse(p.x,p5.height-p.y,radius,radius))
}
function GetLagrangeGs(p5){ 
  let gs = absPoints(p5).map(p=> {
    let s = sigma*p5.height/300
    return x=> p.y*Math.exp(-0.5*(x-p.x)**2/(s*s))
  })  
  return gs;  
}
function a2d(m,n) //mxn 2d array
{
  return Array.from({length:m},()=>Array.from({length:n}))
}
</script>
{{</rawhtml>}}
除了解线性方程组外，多项式插值还可以通过另外一种方式来实现，这就是以法国18世纪数学家约瑟夫·拉格朗日命名的一种多项式插值方法。虽然插值公式看起来比较复杂，但核心原理却比较简单：对于经过个n个点的函数{{<math>}}f(x){{</math>}}，可以分解成{{<math>}}n{{</math>}}个函数{{<math>}}G_i(x){{</math>}}相加来实现，{{<math>}}G_i(x){{</math>}}在点{{<math>}}(x_i,y_i){{</math>}}等于{{<math>}}y_i{{</math>}},而其它点等于0，插值公式表示如下：
- {{<math>}}f(x)=\sum_{i=0}^n G_i(x){{</math>}}，其中{{<math>}}\begin{cases}
  G_i(x)= y_i&x=x_i\\
  G_i(x)=0&x \neq x_i
\end{cases}{{</math>}}
例如求经过下图中经过三个黄色点的插值函数：
{{<p5js defaultFold=true hideCode=true height=300 >}}
function setup () {  
  colorMode(RGB,1.0)
  background (.976, .949, .878);
  strokeWeight(1)
  let fs = parent.GetLagrangeGs(this);
  parent.DrawLagrangePoints(this);
}
{{</p5js>}}
- 我们可以用以下三个函数相加
{{<p5js defaultFold=true hideCode=true height=300 >}}

function DrawInterpolations()
{
  let cols = [
color(.667,.133, .141),
color(1., .812, .337),
color(0.,.369, .608),
]
  background (.976, .949, .878);
  parent.DrawLagrangePoints(this);
  let fs = parent.GetLagrangeGs(this);
  fs.forEach((f,i)=>parent.Plot(this,f,cols[i]))
} 
function setup () {  
  colorMode(RGB,1.0)
  strokeWeight(1)
  DrawInterpolations();
}
{{</p5js>}}
- 得到如下的插值曲线
{{<p5js defaultFold=true hideCode=true height=300 >}}
function setup () {  
  colorMode(RGB,1.0)
  background (.976, .949, .878);
  strokeWeight(1)
  let fs = parent.GetLagrangeGs(this);
  parent.DrawLagrangePoints(this);
  let finalF = x=>  fs.reduce((v,f)=>+f(x)+v,0)
  parent.Plot(this,finalF,color(0.1,0.8))
}
{{</p5js>}}
- 上面图示的原理比较直观，满足上述条件的函数{{<math>}}G_i(x){{</math>}}可以找到无数个，以下是拉格朗日的求解思路：令
{{<math>}}G_i(x)=y_i f_i(x_i){{</math>}}，[^4]
  - {{<math>}}f_i(x_j)=\begin{cases}1&i=j\\0&i\ne j\end{cases}{{</math>}}
  - 对于经过三个点的函数，可以如下构造{{<math>}}f_1(x){{</math>}}很显然可以满足上述条件（代值进去就可以验算）：{{<math>}} f_1(x)=\frac{(x-x_2)(x-x_3)}{(x_1-x_2)(x_1-x_3)}{{</math>}}
  - 更一般地有： {{<math>}}\displaystyle f_i(x)=\prod_{j=0,j\ne i}^{n}\frac{(x-x_j)}{(x_i-x_j)}{{</math>}}
> 备注：以上图示中使用的函数{{<math>}}G_i(x){{</math>}}并不是拉格朗日函数，而是正态分布函数

拉格朗日插值的结果与多项式完全相同，对应的代码如下：
{{<ace allowRunning=true height=220 >}}
function Lagrange(points)
{
  return x =>{
    let y = 0;
    for(let i=0;i<points.length;++i)
    {
      let fix = points //f_i(x)
        .map((p,j) => i != j ? (x-p.x)/(points[i].x-p.x) : 1)
        .reduce((total,v)=>total*v,1);
      y+= points[i].y*fix;
    }
    return y;
  }
}
{{</ace >}}

相应的插值图形如下：
>鼠标左键选中点拖动，单击空白处添加新点，双击删除

{{<p5js defaultFold=true codeHeight=280 >}}
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function DrawInterpolations()
{
  background (.976, .949, .878);
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  let lagrangeInterFunc = parent.Lagrange(points)
  let blue = color(0.,.369, .608)
  //lagrangeInterFunc(points[0].x)
  parent.Plot(this,lagrangeInterFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  fill(color(1, 0.81, 0.34))
  DrawInterpolations();
  parent.HandleMouse(this,points,radius,DrawInterpolations)
}
{{</p5js>}}

### 2.3 牛顿插值法
不管是解线性方程组还是拉格朗日差值法，当新增加一个插值点时，整个插值都需要重新计算。多项式的插值复杂都是{{<math>}}O(n^3){{</math>}}，当插值点达到成千上万个的时候，重新计算一次插值函数的代价是比较高的。牛顿插值法就是为了解决重新计算的问题而提出的。
***定义***
- 一阶差商：{{<math>}} f[i,i+1]=\frac{f(x_{i+1})-f(x_i)}{x_{i+1}-x_i}{{</math>}}
- 二阶差商：{{<math>}} f[i,i+2]=\frac{f[i+1,i+2]-f[i,i+1]}{x_{i+2}-x_i}{{</math>}}
- k阶差商：{{<math>}} f[i,i+k]=\frac{f[i+1,i+k]-f[i,i+k-1]}{x_{i+k}-x_i}{{</math>}}
- 牛顿插值多项式表示为：
{{<math>}}\displaystyle N_n(x)=f(x_0)+\sum_{i=1}^{n}f[0,i]\prod_{j=0}^{i-1}(x-x_j){{</math>}}
>以上牛顿插值的公式形式相对维基百科[^newtown_poly]做了一些小的改动，比原来的形式更偏向程序语言描述，与二维数组和循环相对应，在编程时可以很容易将该公式转换为相应的代码。
[^newtown_poly]:(https://en.wikipedia.org/wiki/Newton_polynomial)

牛顿插值的结果与多项式完全相同，相应的代码如下：
{{<ace allowRunning=true >}}
function Newtown(ps)
{
  let n = ps.length
  let f = a2d(n,n)
  for(let i =0;i<n-1;++i) 
    f[i][i+1] = (ps[i+1].y-ps[i].y)/(ps[i+1].x-ps[i].x)
  for(let k=2;k<n;++k){
    for(let i=0;i+k<n;++i){
      f[i][i+k] = (f[i+1][i+k]-f[i][i+k-1])/(ps[i+k].x-ps[i].x)
    }
  }
  return x =>{
    let y = ps[0].y;
    let dx = x-ps[0].x;
    for(let i = 1;i<n;++i){
      y += f[0][i]*dx ;
      dx *= x-ps[i].x;
    }
    return y;
  }
}
{{</ace >}}

相应的插值图形如下：
>鼠标左键选中点拖动，单击空白处添加新点，双击删除

{{<p5js defaultFold=true codeHeight=280 >}}
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function DrawInterpolations()
{
  background (.976, .949, .878);
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  let NewtownInterFunc = parent.Newtown(points)
  let blue = color(0.,.369, .608)
  //lagrangeInterFunc(points[0].x)
  parent.Plot(this,NewtownInterFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  fill(color(1, 0.81, 0.34))
  DrawInterpolations();
  parent.HandleMouse(this,points,radius,DrawInterpolations)
}
{{</p5js>}}
虽然魏尔施特拉斯逼近定理表明，闭区间上的连续函数可用多项式级数一致逼近，但是多项式插值也有一些缺点，例如[矩阵病态](https://baike.baidu.com/item/%E7%97%85%E6%80%81%E7%9F%A9%E9%98%B5)问题引起的不稳定和龙格振荡现象[^6]。使用正交多项式基可以解决上述的问题，例如Bernstein基函数和高斯基函数（？证明）,下面详情介绍高斯基函数

## 三、径向基函数(RBF)插值

 多项式插值使用的是不同阶函数的线性组合 ，而径向基函数插值是使用高斯基函数的线性组合 {{<math>}}\displaystyle f(x)=b_0 + \sum_{i=1}^{n}b_i g_i(x) {{</math>}}，其中：
   -  {{<math>}}g_i(x)=e^{-\frac{(x-x_i)^2}{2\sigma^2}}{{</math>}}

即{{<math>}}g_i(x){{</math>}}的对称轴在插值点上，{{<math>}}i=1,…,n{{</math>}}，RBF的求解比较简单，可以将{{<math>}}b_0,\sigma{{</math>}}设置为常量，将n个点的值带入可以得到n个方程式，直接使用我们前面实现的高斯消元法即可将系数求出，相应的代码如下：
{{<ace allowRunning=true >}}
let b0 = 0
function RBF(ps,sigma)
{
  let n = ps.length
  let matrix = a2d(n,n+1)
  let gix = (x,i)=> Math.exp(-0.5*(x-ps[i].x)**2/sigma**2)
  for(let row=0;row<n;++row)
  {
    for(let i=0;i<n;++i)
    {   
      matrix[row][i] = gix(ps[row].x,i)
    }
    matrix[row][n] = ps[row].y-b0;
  }
  GaussianElimination(matrix)
  return x =>{
    let y = 1;
    for(let i = 0;i<n;++i)
      y += matrix[i][n]*gix(x,i)
    return y
  }
}
{{</ace>}}

相应的插值图形如下：
>鼠标左键选中点拖动，单击空白处添加新点，双击删除，左右滑动设置不同的sigma

{{<sliderbar id=sigma width=0.7 title=Sigma >}}
{{<rawhtml>}}
<script type="text/javascript" >
function mix(a,b,f){
  return a*f+(1-f)*b;
}  
GaussianSigma = 1
let minSigma = 1
let maxSigma = 60
var slider = document.getElementById("slider_sigma");
var output = document.getElementById("slider_value_sigma");
SigmaValueChangedCallback = null
let onSlideInput = function() {
  
  let m = Math.round((slider.value)/100.0 *(maxSigma-minSigma) + minSigma);
  output.innerHTML = "Sigma:" + m;
  if(m != GaussianSigma){
    GaussianSigma = m
    if(SigmaValueChangedCallback !== null)
      SigmaValueChangedCallback()
  }

}
slider.value = 0;
slider.oninput = onSlideInput;
onSlideInput();

</script>
{{</rawhtml>}}
{{<p5js defaultFold=true codeHeight=280 >}}
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function DrawInterpolations()
{
  background (.976, .949, .878);
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  let interFunc = parent.RBF(points,parent.GaussianSigma)
  let blue = color(0.,.369, .608)
  parent.Plot(this,interFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  fill(color(1, 0.81, 0.34))
  DrawInterpolations();
  parent.HandleMouse(this,points,radius,DrawInterpolations)
  parent.SigmaValueChangedCallback = DrawInterpolations
}
{{</p5js>}}

上图的插值函数除了插值点附近，其余点基本为零，形状看起来并是很好。原因是我们将RBF的{{<math>}}\sigma{{</math>}}设置为1，通过调整不同的{{<math>}}\sigma{{</math>}}值，可以得到更好的插值函数形状。

## 四、函数拟合
使用多项式插值时，当数据点个数较多时，插值会导致多项式曲线阶数过高，带来不稳定因素。可通过固定幂基函数的最高次数来逼近这个数据点，所谓的逼近是指让目标函数{{<math>}}f(x){{</math>}}与数据点的距离尽可能小，令 {{<math>}}\displaystyle \varepsilon=\sum_{j=0}^{n}|f(x_j)-y_j|{{</math>}}，即寻找让 {{<math>}}\varepsilon {{</math>}}最小的{{<math>}}f(x){{</math>}}。{{<math>}}\varepsilon {{</math>}}的表达式中绝对值，并不好求导数。可以改写成这样的形式：{{<math>}}\displaystyle \varepsilon=\sum_{j=0}^{n}(f(x_j)-y_j)^2{{</math>}}，使用最小二乘法来求解。

### 4.1 最小二乘法
固定幂基函数的最高次数 m(m < n)。设{{<math>}}\displaystyle f(x) = \sum_{i=0}^{m} a_iB_i(x){{</math>}}，其中基函数 {{<math>}} B_i(x) = x^i{{</math>}}。
- 令{{<math>}}\displaystyle \varepsilon=\sum_{j=0}^{n}(f(x_j)-y_j)^2{{</math>}}
- 对{{<math>}}\varepsilon{{</math>}}求{{<math>}}a_j{{</math>}}偏导： {{<math>}}\displaystyle \frac{\partial\varepsilon}{\partial a_j}=2\sum_{k=0}^{n}(f(x_k)-y_k)x_k^j{{</math>}}，求解{{<math>}}\frac{\partial\varepsilon}{\partial a_j}=0{{</math>}}方程组即可得到所有的{{<math>}}a_j{{</math>}}
- {{<math>}}\displaystyle \frac{\partial\varepsilon}{\partial a_j}=0 \Rightarrow \sum_{k=0}^{n}f(x_k)x_k^j=\sum_{k=0}^{n}y_k x_k^j{{</math>}}
- 改写成向量的形式：{{<math>}}\vec f\cdot \vec x^j = \vec y \cdot \vec x^j{{</math>}}，其中
  - {{<math>}}\vec y = (y_0,y_1,...,y_n){{</math>}}
  - {{<math>}}\vec  x^j=(x_0^j,x_1^j,...x_n^j){{</math>}}
  - {{<math>}}\vec f = (f(x_0),f(x_1),f(x_n))= \vec a X{{</math>}}
  - {{<math>}}X = (\vec x^0,...,\vec x^m)^T{{</math>}}


对所以{{<math>}}a_j{{</math>}}求偏导，可以联立出一个方程组，通过求解方程组，我们就可以得到拟合函数的所有系数。

### 4.2 岭回归拟合

在上述的求解线性方程过程中,当矩阵不是列满秩时，或者某些列之间的线性相关性比较大时， 矩阵的行列式接近于0，接近于奇异，上述问题变为一个不适定问题，计算误差会很大，缺乏稳定性与可靠性。为了解决这个问题，我们需要将不适定问题转化为适定问题：可以为上述优化函数加上一个正则化项，变为：
- {{<math>}}\displaystyle \varepsilon=\sum_{j=0}^{n}(f(x_j)-y_j)^2 + \lambda \sum_{j=0}^{n} a_j {{</math>}}，相应的方程组变为：
-  {{<math>}}\displaystyle \lambda + \sum_{k=0}^{n}f(x_k)x_k^j  =\sum_{k=0}^{n}y_k x_k^j{{</math>}}

根据上述公式，可以编写相应的代码如下：
{{<ace allowRunning=true >}}
function LeastSqure(ps,m,lambda=0)
{
  m = Math.min(ps.length,m)
  let matrix = a2d(m,m+1)
  for(let j = 0;j<m;++j)
  {
    for(let k=0;k<m;++k)
    {
      matrix[j][k] = ps.map(p=>p.x**j * p.x**k).reduce((t,v)=>t+v,0)
    }
    matrix[j][j] += lambda;//岭回归
    matrix[j][m] = ps.map(p=>p.x**j * p.y).reduce((t,v)=>t+v,0)
  }
  GaussianElimination(matrix);
  return x => {
      let y = matrix[0][m];
      let dx = x;
      for (let i = 1; i < m; ++i)
      {
          y += matrix[i][m] * dx;
          dx *= x;
      }
      return y;
  }  
}
{{</ace>}}

相应的插值图形如下：
>鼠标左键选中点拖动，单击空白处添加新点，双击删除，左右滑动设置不同的m和{{<math>}}\lambda{{</math>}}


{{<sliderbar id=leastM width=0.7 title=m >}}
{{<sliderbar id=lambda width=0.7 title=lambda:0 >}}
{{<rawhtml>}}
<script type="text/javascript" >
leastM = 1
leastLambda = 0
LeastValueChangedCallback = null
{
  let slider = document.getElementById("slider_leastM");
  let output = document.getElementById("slider_value_leastM");
  slider.oninput = function() { 
    let m = Math.round((slider.value)/100.0 * 18 + 2);
    output.innerHTML = "m:" + m;
    if(m != leastM){
      leastM = m
      if(LeastValueChangedCallback !== null){
        LeastValueChangedCallback()
      }
    }

  }
  slider.value = 5;
  slider.oninput();
}
{
  let slider = document.getElementById("slider_lambda");
  let output = document.getElementById("slider_value_lambda");
  slider.oninput = function() { 
    let m = Math.round((slider.value)/100.0 * 50);
    output.innerHTML = "lambda:" + m;
    if(m != leastLambda){
      leastLambda = m
      if(LeastValueChangedCallback !== null){
        LeastValueChangedCallback()
      }
    }

  }
  slider.value = 0;
  slider.oninput();
}
</script>
{{</rawhtml>}}
{{<p5js defaultFold=true codeHeight=280 >}}
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function DrawInterpolations()
{
  background (.976, .949, .878);
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  let interFunc = parent.LeastSqure(points,parent.leastM,parent.leastLambda)
  let blue = color(0.,.369, .608)
  parent.Plot(this,interFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  fill(color(1, 0.81, 0.34))
  DrawInterpolations();
  parent.HandleMouse(this,points,radius,DrawInterpolations)
  parent.LeastValueChangedCallback = DrawInterpolations
}
{{</p5js>}}

## 五、总结

{{<row>}}
{{<col width= 0.01 >}}
<p> </p>
{{</col >}}
{{<col width= 0.4 >}}
{{<checkbox id=poly title=高斯消元 >}}
{{<checkbox id=newtown title=牛顿迭代 >}}
{{<checkbox id=lagrange title=拉格朗日 >}}
{{<checkbox id=rbf title=RBF >}}
{{<checkbox id=least title=最小二乘 >}}
{{</col>}}
{{<col width= 0.5 >}}
{{<sliderbar id=t_sigma width=0.7 >}}
{{<sliderbar id=t_lambda width=0.7 >}}
{{<sliderbar id=t_leastM width=0.7 >}}
{{</col>}}
{{</row>}}
{{<rawhtml>}}
<script type="text/javascript" >
t_leastM = 1
t_leastLambda = 0
t_sigma = 10
t_ValueChangedCallback = null
show = {
  "poly":true,
  "newtown":true,
  "lagrange":true,
  "rbf":true,
  "least":true
}
function HandlelCheck (name){
  let checkbox = document.getElementById("check_"+name)
  checkbox.onclick=()=>
  {
    show[name] = checkbox.checked
    if(t_ValueChangedCallback !== null){
      t_ValueChangedCallback()
    }
  }  
}
HandlelCheck("poly")
HandlelCheck("newtown")
HandlelCheck("lagrange")
HandlelCheck("rbf")
HandlelCheck("least")

{
  let slider = document.getElementById("slider_t_leastM");
  let output = document.getElementById("slider_value_t_leastM");
  slider.oninput = function() { 
    let m = Math.round((slider.value)/100.0 * 18 + 2);
    output.innerHTML = "m:" + m;
    if(m != t_leastM){
      t_leastM = m
      if(t_ValueChangedCallback !== null){
        t_ValueChangedCallback()
      }
    }

  }
  slider.value = 5;
  slider.oninput();
}
{
  let slider = document.getElementById("slider_t_lambda");
  let output = document.getElementById("slider_value_t_lambda");
  slider.oninput = function() { 
    let m = Math.round((slider.value)/100.0 * 50);
    output.innerHTML = "lambda:" + m;
    if(m != t_leastLambda){
      t_leastLambda = m
      if(t_ValueChangedCallback !== null){
        t_ValueChangedCallback()
      }
    }

  }
  slider.value = 0;
  slider.oninput();
}
{
let slider = document.getElementById("slider_t_sigma");
let output = document.getElementById("slider_value_t_sigma");
let onSlideInput = function() {
  
  let m = Math.round((slider.value)/100.0 *59 + 1);
  output.innerHTML = "Sigma:" + m;
  if(m != t_sigma){
    t_sigma = m
    if(t_ValueChangedCallback !== null)
      t_ValueChangedCallback()
  }

}
slider.value = 30;
slider.oninput = onSlideInput;
onSlideInput();
}
</script>
   <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
{{</rawhtml>}}
{{<p5js defaultFold=true codeHeight=280 >}}
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function DrawInterpolations()
{
  background (.976, .949, .878);
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  if(parent.show["least"]){
    let interFunc = parent.LeastSqure(points,parent.t_leastM,parent.t_leastLambda)
    let blue = color(0.,.369, .608)
    parent.Plot(this,interFunc,blue);
  }
  if(parent.show["rbf"]){
    let interFunc = parent.RBF(points,parent.t_sigma)
    parent.Plot(this,interFunc,color(.667,.133, .141));
  }
  if(parent.show["poly"]){
    let interFunc = parent.Polynomial(points)
    parent.Plot(this,interFunc,color(1,0.8,0.4));
  }
  if(parent.show["lagrange"]){
    let interFunc = parent.Lagrange(points)
    parent.Plot(this,interFunc,color(0.1,0.8,0.2));
  }
  if(parent.show["newtown"]){
    let interFunc = parent.Newtown(points)
    parent.Plot(this,interFunc,color(0.2));
  }
} 
function setup () {  
  colorMode(RGB,1.0)
  fill(color(1, 0.81, 0.34))
  DrawInterpolations();
  parent.HandleMouse(this,points,radius,DrawInterpolations)
  parent.t_ValueChangedCallback = DrawInterpolations
}
{{</p5js>}}

## 使用神经网络求函数
{{<p5js >}}
let tf = parent.tf;
const Pi = 3.1415926
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let xs = Array.from({length:400},()=> Math.random()*2-1)
let ys = xs.map(x=>Math.sin(x*Pi)*0.9+0.2*Math.random()-0.1).map(y=> y*0.5+0.5)

let points = xs.map((x,i)=>P((x+1)*width*0.5,ys[i]*height))

const hiddenNum = 3
var a = tf.randomNormal([hiddenNum,1]).variable();// Array.from({length:3},_=> tf.scalar(Math.random()).variable())
var b = tf.randomNormal([hiddenNum,1]).variable();//a.map(()=>tf.scalar(Math.random()).variable())
var w = tf.randomNormal([hiddenNum,1]).variable();//a.map(()=>tf.scalar(Math.random()).variable())

function predict(X) {
  //w*e^{-(ax+b)^2}
  let x1 = X.tile([1,hiddenNum])
  x1 = x1.reshape([-1,hiddenNum,1])
  return x1.mul(a).add(b).exp().sum(0)
  //return x1.sum(0);
  // let exps = a.map((a_,i)=>{
  //   return a_.mul(X).add(b[i]).square().mul(tf.scalar(-1)).exp()
  // })
  // let e0 = exps[0]
  // for(let i = 1;i<exp.length;++i)
  // {
  //   e0 = e0.add(exp[i])
  // }
  // return e0
}

let plotX = []
for(let i = 0;i<=50;++i)
{
  plotX.push(i/50*2-1)
}
const XX = tf.tensor2d(plotX,[1,plotX.length])
const L = tf.tensor2d(ys,[1,ys.length])
const X = tf.tensor2d(xs,[1,xs.length])

function loss(Y,L) {
  return Y.sub(L).square().mean()
}
const learningRate = 0.01
const optimizer = tf.train.adam(learningRate)

function DrawInterpolations()
{
  background (.976, .949, .878);
  stroke(color(0.2,0.7))
  fill(color(0.,.369, .608,0.5))
  strokeWeight(0.5)
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  
  let ys = []
  tf.tidy(()=>{
    let Py = predict(XX)
    ys = Py.dataSync();
    Py.dispose();
  })

  beginShape()
  noFill()
  stroke(color(1,0.8,0.1))
  strokeWeight(2)
  for(let i = 0;i<plotX.length;++i)
  {
    //console.log(ys[i])
    vertex((plotX[i]+1)*width*0.5,height-ys[i]*height)
  }
  endShape()
} 
function setup () {  
  colorMode(RGB,1.0)
  fill(color(1, 0.81, 0.34))
}
function draw(){
  DrawInterpolations()
  tf.tidy(()=>{
    optimizer.minimize(()=>loss(predict(X),L))
  })
  console.log(tf.memory().numTensors)
}
{{</p5js>}}

## 使用神经网络求函数

[^4]:(https://www.matongxue.com/madocs/498/)
[^6]:(https://en.wikipedia.org/wiki/Runge%27s_phenomenon)