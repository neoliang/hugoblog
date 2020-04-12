---
title: Demo-Shader测试
date: "2020-03-16"
url: "/posts/test_shader"
thumbnail: "img/story-logo-black.svg"
description: "测试Shader功能"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
categories:
- Demo
---
测试shadher
<!--more-->


## shader 嵌入测试
{{<shader >}}
uniform float time;
uniform vec2 resolution;

void main( void ) {

  vec2 position = - 1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
  float red = abs( sin( position.x * position.y + time / 5.0 ) );
  float green = abs( sin( position.x * position.y + time / 4.0 ) );
  float blue = abs( sin( position.x * position.y + time / 3.0 ) );
  gl_FragColor = vec4( red, green, blue, 1.0 );

}
{{</shader >}}


{{<shader >}}
uniform float time;
uniform vec2 resolution;

void main( void ) {



  vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/resolution.y;
  uv.y -= pow(abs(uv.x),1.3); uv.y *= 1.1;
  float t = time*3.;
  t = sin(t+sin(t+sin(t+sin(t))))*0.5 + 0.5;
  t = clamp(t,0.5,1.0);
  float mainheart = 0.5*t/length(uv);
  vec3 col = mainheart * vec3(0.2,0.1,0.05);
  gl_FragColor = vec4(col,1.0);

}
{{</shader >}}