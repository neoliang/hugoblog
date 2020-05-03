---
title: Joy Sunset
date: "2020-04-28"
url: "/posts/joy_sunset"
thumbnail: "preview_images/thumbs/joydivision1.jpg"
image: "img/joy_division_banner.jpg"
description: "Joy Division Sunset"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-ace
categories:
- portfolio
- physics
---
 Joy Sunset灵感来源于Joy Division 1979年发行专辑Unkown Pleasures的封面,封面取自于Harold Craft博士的毕业论文《12颗脉冲星的脉冲轮廓和色散的射电观测》中一幅描述CP 1919脉冲星的脉冲轮廓的插图。脉冲星的脉冲轮廓线条充满节奏感，看起来像层叠的小山，它激发了我的灵感，于是我开始着手用代码重现这幅脉冲小山图。
<!--more-->

实现逻辑比较简单，从上到下画一系列间隔(代码中的vStep)一定距离的平行的线段，距离中心(centerX)为某值(代码中的radius)的范围内y值取一个取大的随机值形成山峰，其它区域为平原。为了表示平原也有一定起伏，加上20%的随机```dy = 0.8*dy + random(0,20)*0.2```，最终结果如下：
{{<p5js code-height=500 noSetup=true defaultFold=true >}}
let hStep = height/18,vStep = hStep/2;
function lineHill(x1,x2,y){
  let radius = (x2-x1)*0.28; 
  let centerX = (x1+x2)/2 ; 
  let ls = [];
  for(let x=x1;x<=x2;x += hStep){
    let dy = (radius - abs(x - centerX))*0.5;
    dy = dy < 0 ? 0 : dy;
    dy = random(0,dy)*0.6;
    if(y <= margin*3) 
        dy = random(0,20)*0.2; 
    else 
      dy = 0.8*dy + random(0,20)*0.2; 
    ls.push(dy);
  }
  return ls;
}
let margin = 10,yStart = 30;
background(0);fill(0);
strokeWeight(2);stroke(255);
for(let y = yStart;y<height-margin;y+= vStep){
  let x1 = margin,x2 = width-margin
  let hill = lineHill(margin,width-margin,y)
  beginShape()
  for(let x=x1;x<=x2;x += hStep){
    let dy = hill[int((x-x1)/hStep)]
    dy = dy + randomGaussian(0,dy*0.25)
    curveVertex(x+random(-2,2),y-dy)
  }
  endShape() 
}
{{</p5js >}}

接下来我们让每一行的中心随机偏移一定的量，让山看起来更加错落有致```centerX = (x1+x2)/2 + randomGaussian(0,0.5*radius)```，再按山的远近配上灰度渐变的颜色，这样山看起来有烟雾缭绕的朦胧感。为了让山看起来更有手绘的感觉，我们将颜色设置一个比较低的透明度，每一层山复制绘制多份，每一份高度在原来的基础上随机产生一定的偏移```dy = dy + randomGaussian(0,dy*0.2)```，注意这里用的是高斯分布的随机而不是均匀分布，因为均匀的随机叠加在一起，效果和多层相同的图片叠加在一起差不多，而高斯分布则会让山有主次之分，看起来更自然一些。
{{<p5js code-height=500 noSetup=true defaultFold=true >}}
let hStep = height/12,vStep = hStep/3;
function lineHill(x1,x2,y){
  let radius = (x2-x1)*0.28; 
  let centerX = (x1+x2)/2 + randomGaussian(0,0.5*radius); 
  let ls = [];
  for(let x=x1;x<=x2;x += hStep){
    let dy = (radius - abs(x - centerX))*0.5;
    dy = dy < 0 ? 0 : dy;
    dy = random(0,dy)*0.9;
    dy = 0.7*dy + random(0,20)*0.3; 
    ls.push(dy);
  }
  return ls;
}
let margin = 10,yStart = height/2;
background(255);
colorMode(RGB,1,1,1,1)
noStroke();
for(let y = yStart;y<height-margin;y+= vStep){
  let v = (y-yStart)/(height-margin-yStart)
  v = pow(v,0.9)
  v = abs(1-v)
  
  fill(0.01*(1-v)+v,0.2*(1-v)+v,0.3*(1-v)+v,0.6)

  let x1 = margin,x2 = width-margin
  let hill = lineHill(margin,width-margin,y)
  for(let i = 0;i<50;++i){
  beginShape()
  for(let x=x1;x<=x2;x += hStep){
    let dy = hill[int((x-x1)/hStep)]
    dy = dy + randomGaussian(0,dy*0.2)
    curveVertex(x+random(-2,2),y-dy)
  }
    endShape() 
  }
}
{{</p5js >}}
加上天空，云彩(天空和云的绘制方法可以参考我的另一篇文章[^1])和太阳，效果如下：

{{<p5js noSetup=true defaultFold=true >}}
let hStep = height/12,vStep = hStep/3;
function lineHill(x1,x2,y){
  let radius = (x2-x1)*0.28; 
  let centerX = (x1+x2)/2 + randomGaussian(0,0.5*radius); 
  let ls = [];
  for(let x=x1;x<=x2;x += hStep){
    let dy = (radius - abs(x - centerX))*0.5;
    dy = dy < 0 ? 0 : dy;
    dy = random(0,dy)*0.9;
    dy = 0.7*dy + random(0,20)*0.3; 
    ls.push(dy);
  }
  return ls;
}
let margin = 10,yStart = height/2;
background(255);
colorMode(RGB,1,1,1,1)
noStroke();

//sun
fill(0.9,0.5,0.2,0.05)
let sundir = 50
for(let i = 0;i<10;++i)
{
  
  ellipse(width*0.75+randomGaussian(0,0.01*sundir),height*0.25+randomGaussian(0,0.01*sundir),sundir,sundir)
}

//clouds
for(let i = 0;i<350;++i)
{
  let x = random(0,width)
  let y = abs(randomGaussian(0,yStart/4))
  fill(0.3,0.1,0.4,0.006)
  let r = 50 + abs(randomGaussian(0,25))
  let r1 = random(10,30)
      for(let j = 0;j<3;++j)
    ellipse(x+randomGaussian(0,3),y+randomGaussian(0,3),r,r1)
}
//hills
//stroke(0);
for(let y = yStart;y<height-margin;y+= vStep){
  let v = (y-yStart)/(height-margin-yStart)
  v = pow(v,0.9)
  v = abs(1-v)
  
  fill(0.01*(1-v)+v,0.2*(1-v)+v,0.3*(1-v)+v,0.6)

  let x1 = 0,x2 = width
  let hill = lineHill(x1,x2,y)
  for(let i = 0;i<50;++i){
  beginShape()
  curveVertex(0,y);
  for(let x=x1;x<=x2;x += hStep){
    let dy = hill[int((x-x1)/hStep)]
    dy = dy + randomGaussian(0,dy*0.2)
    curveVertex(x+random(-2,2),y-dy)
  }
  curveVertex(width,y);
  vertex(width,y);
    endShape() 
  }
}
{{</p5js >}}

再调整参数让山回到对称的状态，将太阳置于中心放大，效果如下：
{{<p5js noSetup=true defaultFold=true >}}
let hStep = height/12,vStep = hStep/3;
function lineHill(x1,x2,y){
  let radius = (x2-x1)*0.28; 
  let centerX = (x1+x2)/2 ; 
  let ls = [];
  for(let x=x1;x<=x2;x += hStep){
    let dy = (radius - abs(x - centerX))*0.5;
    dy = dy < 0 ? 0 : dy;
    dy = random(0,dy)*0.8;
    dy = 0.8*dy + random(0,20)*0.2; 
    ls.push(dy);
  }
  return ls;
}
let margin = 10,yStart = height*0.65;
background(255);
colorMode(RGB,1,1,1,1)
noStroke();

//sun
fill(0.9,0.5,0.2,0.05)
let sundir = height*0.75
for(let i = 0;i<10;++i)
{
  
  ellipse(width*0.5+randomGaussian(0,0.01*sundir),height*0.5+randomGaussian(0,0.01*sundir),sundir,sundir)
}
let clamp = (v,low,high)=>
{
  if(v < low) return low;
  if(v > high) return high;
  return v;
}
//clouds
for(let i = 0;i<350;++i)
{
  let x = random(0,width)
  let y = abs(randomGaussian(0,yStart/4))
  fill(0.3,0.1,0.4,0.006)
  let r = 50 + abs(randomGaussian(0,25))
  let r1 = random(10,30)
      for(let j = 0;j<3;++j)
    ellipse(x+randomGaussian(0,3),y+randomGaussian(0,3),r,r1)
}
//hills
for(let y = yStart;y<height-margin;y+= vStep){
  let v = (y-yStart)/(height-margin-yStart)
  v = pow(v,0.5)
  v = abs(1-v)
  v = clamp(v,0.,0.8);
  fill(0.01*(1-v)+v,0.2*(1-v)+v,0.3*(1-v)+v,0.6)

  let x1 =0,x2 = width
  let hill = lineHill(x1,x2,y)
  for(let i = 0;i<50;++i){
  beginShape()
  curveVertex(x1,y);
  for(let x=x1;x<=x2;x += hStep){
    let dy = hill[int((x-x1)/hStep)]
    dy = dy + randomGaussian(0,dy*0.2)
    curveVertex(x+random(-2,2),y-dy)
  }
  curveVertex(width,y);
  vertex(width,y);//???
  endShape() 
  }
}
{{</p5js >}}

[^1]:(https://zhuanlan.zhihu.com/p/111553201)

