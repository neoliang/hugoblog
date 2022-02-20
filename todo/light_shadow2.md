
---
title: 光与影	
date: "2021-11-05"
url: "/posts/light_shadow2"
description: "讲述光照的计算"
thumbnail: "preview_images/thumbs/light_shdow2.png"
image: "img/light_shadow2/banner.png"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-math
- feature-ace
categories:
- 光照
- 阴影
---

光与影像是一对孪生兄弟，有光的地方一定会有影，有影的地方一定会有光。光是什么，它是怎么传输的，什么是颜色，人眼是怎么感知颜色的？这些问题一直困扰着人类。或许从人类有记忆时开时，就有了对光思考和探索，它蕴含着浩瀚宇宙的奥秘，启发了艺术、宗教及科学。千百年来，这个地球上无数颗聪明的头脑被光神秘的气质所吸引，试图解开它的奥秘，特别地在物理学领域，有数十个诺贝尔获奖者诞生于对光的本质的研究和探索过程中。

<!--more-->

## 漫反射

在光照的计算中，最简单的或许是漫反射的计算了，漫反射是指一个点从任意角度观察都相同，观察到的出射光照的强度与入射光强度及入射光方向与法线的夹角余弦成正比，用公式来描述：{{<math>}} L_o=L_i*cos(\theta) = L_i*\vec l \cdot \vec n {{</math>}}

## 阴影

- sdf下的软阴影
- shadowmap
	- pcf
	- pcss
	- vsm

## 环境光

## 高光