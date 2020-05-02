---
title: 随机抽样与幂函数分布
date: "2020-04-28"
url: "/posts/power_distribution"
thumbnail: "img/power_distribution.jpg"
image: "img/power_distribution_banner.jpg"
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

一般来讲，我们可以通过概率密度函数pdf积分求出累积分布函数cdf，再通过求出累积分布函数的反函数来生成样本,通过这样的方法，可以求出幂函数的{{<math >}}f(x)=x^n{{</math>}}的幂方根抽采样函数为:

{{<math >}}X=\sqrt[n+1]\xi{{</math>}}  *（幂方根采样函数）*

我们来对比上式与最大值采样函数的采样耗时

{{<math >}}X= max(\xi_1,\xi_2,...,\xi_{n+1}){{</math>}}  *（最大值采样函数）*

{{<chart code-height=360 height=400 hideCode=false defaultFold=true >}}
let profileN = 300000;
function sampleRandom(n){
  let r = 0;
  for(let i = 0;i<profileN;++i){
    r = 0;
    for(let s = 0;s<n+1;++s) r = Math.max(Math.random(),r);
  }
  return r;
}
function samplePow(n)
{
  let r = 0;
  for(let i = 0;i<profileN;++i){
    r = Math.pow(Math.random(),1.0/(n+1));
  }
  return r;
}

let N = 10;
let randomSamples = [];
let powerSamples = [];
for(let i = 0;i<N;++i){
  let start = Date.now();
  let r = sampleRandom(i+1);
  let millis = Date.now() - start;
  console.log(i+1,millis);
  randomSamples.push(millis);
  start = Date.now();
  r = samplePow(i+1);
  millis = Date.now() - start;
  powerSamples.push(millis);
}


chart_data = {
    type: 'line',
    data: {
      labels:randomSamples.map((v,i)=>(i+1)),      
        datasets: [{
            label: '最大值采样',
            data: randomSamples,
            fill:false,
            borderColor:'rgba(0, 94, 155, 0.5)',
        },
        {
            label: '幂方根采样',
            data: powerSamples,
            fill:false,
            borderColor:'rgba(170, 34, 36, 0.5)',
        }
        ]
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
幂方根采样为了生成样本{{<math >}}X{{</math>}},要先从均匀分布中抽取{{<math >}}\xi{{</math>}},再算出n次方根，这样的计算量相对于从均匀分布中抽取多个{{<math >}}\xi_i{{</math>}}取最大值耗时也许会高一些，因此对于某些次幂也许用后者来生成样本是比较好的选择。从在本次测试中可以观察到几个比较有趣的现象：
- {{<math >}}X=\sqrt[2]\xi{{</math>}}比{{<math >}}X= max(\xi_1,\xi_2){{</math>}}抽样耗时低
- 在次幂小于4时，最大值采样的的耗时要低于幂方根采样的耗时。
- 最大值抽样的耗时与n成线性比例
- 幂方根抽样在n等于1时耗时最低，n等于2时耗时最高，n等于3时开始下降，在n大于4后耗时保持稳定，不再变化

