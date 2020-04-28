---
title: 随机抽样与幂函数分布
date: "2020-04-28"
url: "/posts/power_distribution"
thumbnail: "preview_images/thumbs/mandelbrot1.jpg"
image: "img/mandelbrot_banner1.jpg"
description: "随机抽样与幂函数分布"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
- feature-math
categories:
- Math
---
一般来讲，我们可以通过对概率密度函数pdf积分求出累积分布函数cdf，再求出累积分布函数的反函数来生成样本。但对于幂函数来，还有另外一种比较简单的样本生成函数。
<!--more-->


## 随机抽样与幂函数


先来做一个简单的实验，我们从0到1之间以0.1的距离均匀的随机抽取1万次，那么每个数出现的次数将会接近1000.如下图所示。
{{<chart code-height=360 height=400 hideCode=false defaultFold=true >}}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; 
}
let N = 10000;
let S = 10;
let counts = Array.from({length:S},()=>0);

for(let i = 0;i<N;++i)
{
  let r = getRandomInt(1,S+1);
  ++counts[r-1];
}
chart_data = {
    type: 'bar',
    data: {
      labels:counts.map((v,i)=>(i+1)/10),      
        datasets: [{
            label: '随机抽样',
            data: counts,
        }
        ]
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
如果我们每次抽取多个，取其中的最大值，每个数出现的次数分布会是怎么呢，下图展示了随机抽取2～4个数取最大值的分布情况。
{{<chart code-height=360 height=400 hideCode=false defaultFold=true >}}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; 
}
let N = 10000;
let S = 10;
let countss = [];
for(let i = 1;i<=4;++i){
  let counts = Array.from({length:S},()=>0);
  for(let j = 0;j<N;++j)
  {
    let r = 0;
    for(let s = 0;s<i;++s) r = Math.max(getRandomInt(1,S+1),r);
    ++counts[r-1];
  }
  countss.push(counts);
}

let bg = [
    'rgba(128, 128, 128, 0.5)',
    'rgba(170, 34, 36, 0.5)',
    'rgba(0, 94, 155, 0.5)',
    'rgba(255, 207, 86, 0.5)',
    ];
let datasets = countss.map((c,i) => {
  let label = 'Uniform';

  if(i>0) label = 'Max'+ (i+1);
  return {
    label:label,
    data : c,
    borderColor:bg[i],
    fill:false
  }
});
chart_data = {
    type: 'line',
    data: {
      labels:Array.from({length:S},(k,i)=> (i+1)/10),      
        datasets: datasets
    },
     options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max:2000
                }
            }]
        }
    }
}
{{</chart>}}

从图上可以看出
- 灰色Uniform是均匀分布，所有点出现的次数都接近于1000
- 红色Max2的分布接近于线性 {{<math >}} f(x)=kx {{</math>}}
- 蓝色Max3的分布接近于2次曲线 {{<math >}} f(x)=kx^2 {{</math>}}
- 黄色Max4的分布接近于3次曲线 {{<math >}} f(x)=kx^3 {{</math>}}

实际这和抽样的概率分布有关，我们从0～1中随机选择一个数x，然后再随机抽取另外一个数，这个数小于x的概率刚好为x,由于每次抽样是独立的，固再选择n个数的概率都小于x为{{<math >}}x^n{{</math>}},换成概率语言如下：

选择样本  {{<math >}}X= max(\xi_1,\xi_2,...,\xi_n){{</math>}}

其小于x的概率为:  {{<math >}}P_r\{X<x\} = \prod_{1}^{n}P_r\{\xi_i<x\}=x^n{{</math>}}

### 这有什么实际的用途呢？

一般来讲，我们可以通过概率密度函数pdf积分求出累积分布函数cdf，再通过求出累积分布函数的反函数来生成样本,通过这样的方法，可以求出幂函数的{{<math >}}f(x)=x^n{{</math>}}的采样函数为:

{{<math >}}X=\sqrt[n+1]\xi{{</math>}}