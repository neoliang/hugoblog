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
- 求x=3时，y=?
这个题怎么做[^2]？
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
这种近似太粗糙，分段的线性插值在每一个插值点的突变比较明显，左右不连续，如下图所示

{{<p5js id=interpolation defaultFold=true >}}
let  P = (x,y)=>{return {x:x,y:y}}
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
let points = [P(0.05,0.4),P(0.2,0.2),P(0.3,0.5),P(0.65,0.8),P(0.9,0.3)].map(p=>P(p.x*width,p.y*height))
function LinearInterpolation(ps)
{
  return x=>{
    let i = ps.findIndex(p=>p.x > x)
    if(i > 0){
      let f = (x - ps[i-1].x)/(ps[i].x-ps[i-1].x)
      return ps[i-1].y*(1-f)+f*ps[i].y;
    }
    return 0;
  }
}
function DrawInterpolations()
{
  background (.976, .949, .878);
  fill(color(1., .812, .337))
  strokeWeight(1.)
  points.forEach(p=>ellipse(p.x,p.y,5,5))
  let polyInterFunc = LinearInterpolation(points)
  let blue = color(0.,.369, .608)
  strokeWeight(1)
  DrawFunc(polyInterFunc,points[0].x,points[points.length-1].x,blue);
} 
function setup () {  
  colorMode(RGB,1.0)
  DrawInterpolations();
}
{{</p5js>}}
## 二、多项式插值


