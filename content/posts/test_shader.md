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


{{<shader code-height=210 height=400 hideCode=false >}}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}
{{</shader >}}

{{<shader code-height=200 >}}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv = (2.*fragCoord.xy-iResolution.xy)/iResolution.y;
    uv.y -= pow(abs(uv.x),1.3); uv.y *= 1.1;
    float t = iTime*3.;
    t = sin(t+sin(t+sin(t+sin(t))))*0.5 + 0.5;
    t = clamp(t,0.5,1.0);
    float mainheart = 0.5*t/length(uv);
    vec3 col = mainheart * vec3(0.2,0.1,0.05);
    fragColor = vec4(col,1.0);
}



{{</shader >}}