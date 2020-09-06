---
title: 如何渲染一个黑洞（二）
date: "2020-09-06"
url: "/posts/blackhole2"
description: "如何用Shader渲染一个黑洞第二部分"
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
在如何渲染一个黑洞（一）[^1]中，我们基于万有引力用光线追踪在ShaderToy中用不到40行代码实现了黑洞的奇点和事件视界这两个特性，这样我就可以观察到简单的方格背景由于引力透镜效应引起扭曲与变形，效果看起来已经挺酷的了，但这并不接近最终黑洞真实的效果。在本文中我们将讲述如何实现黑洞的另外两个特性吸积盘和相对论喷流，并加入星空背景等渲染手法，最终实现出如封面一样的黑洞。
<!--more-->
[^1]:(http://feefi.net/posts/blackhole)

---

## 一、星空背景与爱因斯坦环
因为黑洞强大引力导致任何光线都不能从其内逃逸，所以我们并不能直观察黑洞的存在。但如果黑洞附近有发光的恒星，当光经过黑洞时，有部分光线会因为引力透镜而产生弯曲，通过观察这种引力透镜引起的空间扭曲，我们就能间接的观察到黑洞。在上一篇文章中我们使用了最简单的方格背景来模拟引力透镜。代码如下：
```c
vec3 GetBg(vec3 p)
{
    return fract(p);
}
```
对应的背景图如下：
![简单的格子背景](/img/blackhole/gridbg.jpg)
加上黑洞的引力透镜效应，效果如下：
![引力透镜下简单的格子背景](/img/blackhole/simpleTorBg.jpg)
从上图中可以看到黑洞背后的格子背景形成了环状，如果我们把背景换成星空，可以观察到某些光源发出的光线受到引力透镜效应的影响形成环状，这就是爱因斯坦环[^2]。可以用一张贴图来模拟最简单的星空背景，贴图的uv坐标通过发光初始置的xy坐标变换得到，在RayMarching中，发光初始位置为光线步进的最终坐标p,通过将p的坐标xy转换到0～1范围，我们就能得到星空贴图的uv坐标。代码如下：
[^2]:(https://zh.wikipedia.org/wiki/%E6%84%9B%E5%9B%A0%E6%96%AF%E5%9D%A6%E7%92%B0)
```c
vec3 GetBg(vec3 p)
{
    vec2 uv = fract(p*0.13+0.5).xy;//to [0,1]
    return texture(iChannel0,uv).xyz;
}
```
对应的效果图如下：
![引力透镜下星空贴图背景](/img/blackhole/texStarBg.jpg)
我们知道，在黑洞的周围由于有强烈的辐射，会产生大量的X射线，这样会使得黑洞周围的亮度相对的较强，生产发光的效果。我们通过体渲染的技巧来模拟这种情况，核心算法是在光线追踪的每一个步进进点都计算一个亮度值累加，让该点的亮度靠近黑洞中心越近值越高，有两种方法可以用来模拟这种高亮随距离的变化情况：

{{<math>}}y = \frac{1}{x^2} {{</math>}} （公式一）


{{<math>}}y = e^\frac{1}{x^2} {{</math>}} （公式二）

核心代码如下：
```c
vec3 relP = p - cp;       
float r2 = dot(relP,relP); //当前点到黑洞的距离平方
float glow = 0.013/r2;//0.01*(exp(0.2/r2)-0.5);        
bc += glow * (1.-hitbh) ; //黑洞发光颜色
```
公式一（中心更亮，发光区域范围小）：
![星空背景+(Glow公式一)](/img/blackhole/texStarBgGlow.jpg)

公式二（中心相对暗，发光区域范围大）：
![星空背景+(Glow公式二)](/img/blackhole/texStarBgGlow1.jpg)

ShaderToy中的这张星空贴图整体太亮，与夜晚实际的星空差异较大，我们用程序生成的一幅相对较暗的星空背景[^3]，如下图：
![程序生成星空背景](/img/blackhole/texStarBgGlow2.jpg)
从上图中我们可以清晰看到爱因斯坦环。
[^3]:(https://www.shadertoy.com/view/ttjfRK)
## 二、吸积盘
黑洞周围的气体、星尘在强大的引力作用下，会形成一个围绕黑洞高速旋转的盘状结构，这就是黑洞吸积盘。一种比较简单的模拟吸积盘方法是创建大量颜色不同的粒子，让它们在引力的作用下围绕着奇点做圆周运动来模拟气体和星尘，这种方法的缺点需要创建成千上万的粒子，执行效率相对低。而另一种方法是我们通过SDF绘制一个环,并在环上贴上噪声纹理来模拟星尘和气体。在本文中我们将采用第二种方法来实现。

环的SDF如下:
```c
float torus_sdf( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

```
在光线步进的过程中，我们计算出环的SDF,如果光线与环相交，就累加上对应的颜色，代码如下：
```c
//对环的y方向缩放，然后计算SDF
float tor = torus_sdf(torpos*vec3(1,13.,1.),vec2(1.8,1.2));
float hitTor = smoothstep(0.,-0.01,tor);//是否击中环
torCol += 0.015*vec3(0.9,0.6,0.4)*hitTor*(1.-hitbh); //累加颜色
```
效果如下：
![用环来模拟吸积盘](/img/blackhole/simpleTor.jpg)
已经有点吸积盘的样子了，不过这只是一个单一颜色的环，我们可以在环上应用噪声贴图来生成不规则的点状来模拟出星尘和气体。噪声贴图的uv坐标可以根据环上的坐标来生成，u坐标取当前点到环中心的距离然后映射到[0,1]，v坐标取环xz平面上弧度然后映射到[0,1]，代码如下：
```c
float v = smoothstep(0.,1.,length(torpos.xz)/19.);
float u = atan(torpos.z,torpos.x)/Pi *v -iTime*0.03;
vec2 toruv = vec2(u,v)*vec2(15,10.1);

float distor = texture(iChannel0,toruv).r;
torCol += 0.025*vec3(0.9,0.6,0.4)*hitTor*(1.-hitbh)*distor;
```
效果如下：
![带噪声的吸积盘](/img/blackhole/NosieTor.jpg)
从上图可以看到，吸积盘的内部有细节上的变化，看起来比较像气体和星尘，但星尘和背景的边缘太明显了，我们让远离盘的地方淡出来弱化边缘，代码如下：
```c
float v = smoothstep(0.,1.,length(torpos.xz)/19.);
float u = atan(torpos.z,torpos.x)/Pi *v -iTime*0.03;
vec2 toruv = vec2(u,v)*vec2(15,10.1);

float distor = texture(iChannel0,toruv).r;
float fade = smoothstep(4.,1.5,length(torpos.xz)); //弱化边缘
torCol += 0.025*vec3(0.9,0.6,0.4)*hitTor*(1.-hitbh)*distor*fade;
```
效果如下[^4]：
![吸积盘边缘淡出](/img/blackhole/NosieTorFade.jpg)
[^4]:(https://www.shadertoy.com/view/tljfzK)
## 三、相对论喷流
当吸积盘上的气体、星尘跨越事件视界落入黑洞，就会产生粒子和能量从黑洞的两极以接近光速喷射而出，形成相对论喷流。我们可以用简单的光柱来模拟这种现象，光柱在靠近黑洞的一端辐射和能量较强，使用蓝色来表示，而远离黑洞的一端辐射和能量较低，使用红色来表示，代码如下：
```c
float jetHeight = smoothstep(0.,2.5, abs(torpos.y));
vec3 blue = vec3(0.3,0.3,0.6);
vec3 red = vec3(0.6,0.3,0.3);
float jetWidth = 0.001/dot(torpos.xz,torpos.xz);
jetCol += jetWidth*(1.-hitbh)*mix(blue,red,jetHeight);
```
效果如下：
![黑洞的相对论喷流](/img/blackhole/blackJet.jpg)
## 四、小结
至此，我们完成了一个简单的黑洞渲染，虽然核心代码不到150行，但确涉及到了广泛的知识面，有万有引力、相对论、光线追踪、SDF，体渲染和噪声贴图的应用等。相关代码已经上传到[github](https://github.com/neoliang/blackhole)及ShaderToy[^5]
[^5]:(https://www.shadertoy.com/view/tl2fzK)
  





