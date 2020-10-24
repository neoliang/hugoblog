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
- Demo
---
在数学的数值分析领域中，内插或称插值（interpolation）是一种通过已知的、离散的数据点，在范围内推求新数据点的过程或方法。求解科学和工程的问题时，通常有许多数据点借由采样、实验等方法获得，这些数据可能代表了有限个数值函数，其中自变量的值。而根据这些数据，我们往往希望得到一个连续的函数（也就是曲线）；或者更密集的离散方程与已知数据互相吻合，这个过程叫做拟合[^1]。

[^1]:(https://en.wikipedia.org/wiki/Interpolation)
<!--more-->

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

可以用插值来解决这问题，下面我们详细介绍。

[^2]:(https://www.matongxue.com/madocs/126/)

# 插值

给定n个离散数据点（称为节点）{{<math>}} (x_{k},y_{k}) k=1,2,...,n{{</math>}}。对于{{<math>}}x,(x\neq x_{k},k=1,2,...n){{</math>}}，求{{<math>}}x{{</math>}}所对应的{{<math>}}y{{</math>}}的值称为内插。

{{<math>}}f(x){{</math>}}为定义在区间{{<math>}}[a,b]{{</math>}}上的函数。{{<math>}}x_{1},x_{2},x_{3}...x_{n}{{</math>}}为{{<math>}}[a,b]{{</math>}}上 n 个互不相同的点，{{<math>}}G{{</math>}}为给定的某一函数类。若{{<math>}}G{{</math>}}上有函数{{<math>}}g(x){{</math>}}满足：

- {{<math>}}g(x_{i})=f(x_{i}),k=1,2,...n{{</math>}}

则称{{<math>}}g(x){{</math>}}为{{<math>}}f(x){{</math>}}关于节点{{<math>}}x_{1},x_{2},x_{3}...x_{n}{{</math>}}在{{<math>}}G{{</math>}}上的插值函数。

有许多不同的插值方法可以解决上述的问题，其中一些在下面描述。在选择适当的算法时需要考虑的一些问题是：方法有多准确？ 它的计算成本有多高？ 插值有多平滑？ 需要多少数据点？

## 一、线性插值

考虑上面估计周三火星到太阳的距离，即求{{<math>}}f(3){{</math>}},由于3在2和4之间，最简单的办法就是对x=2和x=4对应的两个点(x_a,y_a)和(x_b,y_b)做线性插值，对应的公式为：
- {{<math>}}y=y_a+(y_b-y_a) * \frac{x-x_a}{x_b-x_a}{{</math>}}
相应的插值结果如下图所示
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
  parent.DrawFunc(this,polyInterFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  DrawInterpolations();
  parent.createInterpolation(this,points,6,DrawInterpolations)
}
{{</p5js>}}
分段的线性插值在每一个插值点的突变比较明显，自然界中很少见这种弯折的线段，不管是汽车的行驶路线还是行星的运动轨迹，都是平滑的，都不会在在某一个点有明显的突变或弯折。因为运行的物体速度或加速度的变化在时间上是连续的，不太可能会出现跳跃情况。这就要相应的插值函数具有多阶可导的性质，多项式插值就是其中一类函数。

## 二、多项式插值

多项式插值是线性插值的推广。线性插值是一个线性函数。我们现在用一个更高阶的多项式代替这个插值。 对于n个点{{<math>}}P_j(x_j,y_j), j=1,2,\dots,n{{</math>}}，可以使用多项式函数
- {{<math>}}f(x)=\sum_{i=0}^{n-1}\alpha_i B_i(x){{</math>}} 插值 {{<math>}}\{P_j\}{{</math>}}，其中 {{<math>}}B_i(x)=x^i{{</math>}}
求插值函数有多种方法，我们逐一来介绍

### 2.1 线性方程
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

求解线性方程组常用的方法是高斯消元法，高斯消元法的实现比较简单，通常用矩阵来表示方程组的系数，我们先从上到下，从左到右逐列消除矩阵左下角的的元素，然后按相反的操作顺序消除右上角的元素，即可解出方程，具体过程如下[^3]：
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

{{<p5js defaultFold=true >}}
let radius = 6
let  P = (x,y)=>{return {x:x,y:y}}
let points = [[0.05,0.4],[0.2,0.2],[0.3,0.5],[0.65,0.8],[0.9,0.3]].map(p=>P(p[0]*width,p[1]*height))
function DrawInterpolations()
{
  background (.976, .949, .878);
  points.forEach(p=>ellipse(p.x,height-p.y,radius,radius))
  let polyInterFunc = parent.Polynomial(points)
  let blue = color(0.,.369, .608)
  parent.DrawFunc(this,polyInterFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  DrawInterpolations();
  parent.createInterpolation(this,points,radius,DrawInterpolations)
}
{{</p5js>}}
[^3]:(https://en.wikipedia.org/wiki/Gaussian_elimination)


### 2.2 拉格朗日插值法
{{<rawhtml>}}
<script type="text/javascript">
let points = [[0.2,0.7],[0.5,0.5],[0.85,0.85]]
let radius = 8
let sigma = 60;
let absPoints = (p5) =>
  points.map(p=>P(p[0]*p5.width,p[1]*p5.height))
function DrawLagrangePoints(p5,c=0)
{
  p5.fill(1.0,0.8,0.4)
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
  fs.forEach((f,i)=>parent.DrawFunc(this,f,cols[i]))
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
  parent.DrawFunc(this,finalF,color(0.1,0.8))
}
{{</p5js>}}
- 那么{{<math>}}G_i(x){{</math>}}该如何求：以下是拉格朗日的思路：令
{{<math>}}G_i(x)=y_i f_i(x_i){{</math>}}，[^4]
  - {{<math>}}f_i(x_j)=\begin{cases}1&i=j\\0&i\ne j\end{cases}{{</math>}}
  - 对于经过三个点的函数，可以如下构造{{<math>}}f_1(x){{</math>}}很显然可以满足上述条件（代值进去就可以验算）：{{<math>}} f_1(x)=\frac{(x-x_2)(x-x_3)}{(x_1-x_2)(x_1-x_3)}{{</math>}}
  - 更一般地有： {{<math>}}\displaystyle f_i(x)=\prod_{j=0,j\ne i}^{n}\frac{(x-x_j)}{(x_i-x_j)}{{</math>}}，很明显满足上述条件
> 为了直观说明原因，上述图示中使用的函数{{<math>}}G_i(x){{</math>}}并不是拉格朗日函数，而是正态分布函数

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

{{<p5js defaultFold=true >}}
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
  parent.DrawFunc(this,lagrangeInterFunc,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  DrawInterpolations();
  parent.createInterpolation(this,points,radius,DrawInterpolations)
}
{{</p5js>}}

[^4]:(https://www.matongxue.com/madocs/498/)