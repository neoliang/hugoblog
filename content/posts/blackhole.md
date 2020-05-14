---
title: 如何渲染一个黑洞（一）
date: "2020-02-14"
url: "/posts/blackhole"
description: "本文描述如何用Shader渲染一个黑洞"
thumbnail: "preview_images/thumbs/blackhole.jpg"
image: "img/blackhole/head.jpg"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-math
- feature-ace
categories:
- portfolio
- physics
---
黑洞是一种比较神秘天体，在很多科幻小说和电影中我们都能看到有关它的描述，例如《星际穿越》中的卡冈图雅黑洞，它强大引力透镜效应使时空扭曲形成壮观的帽状吸积盘给人留下深刻的印象。卡冈图雅的特效实现由30个人，数千台计算机耗时一年才完成[^10]。实际上实现黑洞的基本原理并不复杂，只需万有引力和光线追踪即可，本文将讲述如何在Shader中实现一个黑洞效果，其核心代码比较简单，不到40行。
<!--more-->
[^10]:(https://www.guokr.com/article/439477/?f=wx)

---

## 一、黑洞简介
  

黑洞是恒星的一种，它的质量和引力巨大以致于连光都不能从内部逃脱。在黑洞周围，由于强引力的作用会引发时空非常大扭曲。这样，即使是被黑洞挡着的恒星发出的光，虽然有一部分会落入黑洞中消失，可另一部分也会通过弯曲的空间中绕过黑洞往前传播，这就是引力透镜效应。

![Anatomy of a black hole. Credit: Illustration: ESO, ESA/Hubble, M.Kornmesser/N.Bartmann](/img/blackhole/intro.jpg)
  

1. 奇点，位于黑洞的最中心，体积无限小，质量无限大的点，这两种特性使得奇点的密度无限大，具有很强大的引力，以至于所有掉入黑洞的物质和能量最终都会坍缩和终结于这里。
1. 事件视界，以奇点为中心某一特定半径的球形区域，物质和能量一旦跨越该边界将被黑洞引力吸入奇点，一去不复返。
1. 吸积盘，事件视界之外的气体、星尘在黑洞强大的引力作用下，会朝向黑洞下落。这个过程被称作“黑洞吸积”。由于气体具有一定的角动量，这些气体在下落过程中会形成一个围绕黑洞高速旋转的盘状结构，如同太阳系的各大行星轨道平面一样，这就是黑洞吸积盘[^2]。
1. 相对论喷流，吸积盘上的气体、星尘有部分会跨越事件视界落入黑洞，从而产生粒子，能量等从黑洞的两极接近光速喷射而出，形成相对论喷流。  
[^2]:(https://zhuanlan.zhihu.com/p/30445343)


---
  

虽然渲染黑洞有多种方法，但这些方法大多都是以光线追踪和时空扭曲为基础的。光线追踪核心思想比较简单，即计算光线路径在场景中的各个点交互产生的颜色值。在传统的光线追踪算法中，光线是沿直线传播的，因此可以用直线来模拟光线路径，而在黑洞强引力的情况下，光线会因为引力透镜效应而产生弯曲，这种现象可以用爱因斯坦的场方程来描述[^eq]：

{{<math>}}R_{\mu\nu}-\frac{1}{2}g_{\mu\nu}=\frac{8\pi G}{c^4}T_{\mu\nu}{{</math>}} 

尽管爱因斯坦方程的形式看起来很简单，实际上他们是一组复杂的二阶非线性微分方程,并没有通解。但对于一些比较特殊的情况，比如史瓦西解(度规)，所对应的几何是一个是静止不旋转、不带电荷之黑洞。

有了史瓦西度规，我们可以对时空距离{{<math>}}ds^2{{</math>}} 积分，算出光子在球坐标系下的路径，再结合光线追踪即可，有兴趣的同学可以参考这篇文章[^3]。史瓦西度规只是最普通的一个解。另外，还可以用克尔度规来模拟光子路径[^9]。

本文使用的是一种比较简单的方法，主要思路是根据光子与黑洞的距离用万有引力计算出加速度，让光子速度随加速度发生变化模拟路径弯曲，再结合Ray Marching方法对光线路径积分算出光子坐标。虽然说光子的速度产生变化违背了物理学中光速不变原则，但用这样的方法模拟出来的光子路径与史瓦西解的差异并不大。
[^eq]:(https://en.wikipedia.org/wiki/Einstein_field_equations)
[^3]:(https://rantonels.github.io/starless/)
[^9]:(https://www.codeproject.com/Articles/994466/Ray-Tracing-a-Black-Hole-in-Csharp)

## 二、Ray Marching简介

光线步进(Ray Marching)是光线追踪(Ray Tracing)的一种实现方法，如下图，我们在屏幕后放置一个相机，从相机发出一条与（下图中蓝色的线）屏幕连上像素点连接的射线。用该射线与场景中的物体作相交检测。

![光线步进示意1](/img/blackhole/raymarching.jpg)

沿着这条射线一步一步往前进，直到光线与场景中的物体相交或者达到最大步数。如果光线与物体相交，则将屏幕上的该象素点设置为交点的颜色。如下图所示，屏幕上该点发出的射线往前走了6步，最终于绿色小球相交，固将该点的颜色设置为绿色。

![光线步进示意2](/img/blackhole/raymarching1.jpg)


对屏幕上的所有象素点执行该过程，如下[^4]
[^4]:(https://www.shadertoy.com/view/wlSGWy)

{{< video poster="/img/blackhole/raymarching.jpg" src="/video/blackhole/raymarching.mp4" >}}


利用上述的算法，在Shadertoy中的实现画一个黑球，用来模拟无引力透镜的黑洞,核心代码如下：

{{<ace height=200 readOnly=true language="glsl" >}}
for(int i = 0;i<maxStep;++i)
{
    vec3 p = eye + ray_dir * step;
    float hit = HitTest(p); //hit表示距物体的最小距离
    step += hit; //ray marhing 光线步进
    if(hit < 0.01){
        col = vec3(0.);
        break;
    }       
}
{{</ace>}}

更详细的代码请参考[^5]，实现效果如下：
[^5]:(https://www.shadertoy.com/view/WldXWM)

![黑洞(v0.1--无引力透镜)](/img/blackhole/blackv0.1.png)


## 三、引力透镜下的Ray Marching

上一节实现的黑洞看起来只是一个简单的黑色的圆，并没有什么特别的地方。接下来我们在光线步进的基础上加万有引力让光线产生弯曲。实际上把屏幕上发出的射线想象为向前运动光子更直观一些，光子的运动轨迹在引力的作用下发生了弯曲，如下图

![星球发出的光在引力透镜下弯曲](/img/blackhole/raymarching2.jpg)

让光子产生弯曲的引力公式：{{<math>}}F=G\cdot \frac{M\cdot m}{r^2}{{</math>}}


光子引力加速度: {{<math>}}a = \frac{F}{m}=G\cdot \frac{M}{r^2} {{</math>}}

核心代码如下，更详细的代码请参考[^6] 
[^6]:(https://www.shadertoy.com/view/WltSDM)

{{<ace height=350 readOnly=true language="glsl" >}}
vec3 p = eye;
vec3 v = ray_dir;
float dt = 0.02;
float GM = 0.4;   
for(int i = 0;i<maxStep;++i)
{
    //F = G * M * m / r^2;
    //a = F/m
    //v = v + a * dt;
    //p = p + v * dt;
    p += v * dt;
    vec3 relP = p - black_hole_pos; //黑洞相对原点的位置       
    float r2 = dot(relP,relP);
    vec3 a = GM/r2 * normalize(-relP); //加速度的方向朝向黑洞，为-relP
    v += a * dt;        
    float hit = HitTest(relP); //hit表示距物体的最小距离
    if(hit < 0.01){
        col = vec3(0.);
        break;
    }       
}
{{</ace>}}

黑洞的背后的红色发光恒星发出的光线在引力透镜的弯曲下，最终会形成一个环，如下图

![黑洞引力透镜下的恒星形成一个环](/img/blackhole/blackv0.2.jpg)

动态图如下[^9]： 
[^9]:(https://www.shadertoy.com/view/wltSD7)

{{< video src="/video/blackhole/raymarchingbh.mp4" poster="/img/blackhole/blackv0.2.jpg" >}}

这样我们就实现了一个简单的黑洞，不过这看起来好像只是一个黑色的圆再加上了一个红色的环，效果并不酷。如果我们加上一个简单的背景，并让黑洞随机运动，并让背景产生引力透镜效果看起来就很不错了，如下所示[^8] 
{{< video src="/video/blackhole/blackhole-v0.mp4" poster="/img/blackhole/blackv1.jpg" >}}
[^8]:(https://www.shadertoy.com/view/WltSDM)

## 四、小结

至此，我们用不到50行的代码就实现了一个简单的黑洞效果，看起来已经有点酷了。但这个demo只有展示了黑洞的引力透镜和事件视界两个特性。在下一篇文章中，我将会讲述如何实现吸积盘及喷流，在实现这些效果的过程也会讲述噪声、纹理生成及glow等技术。



