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
    vec2 m = iMouse/iResolution.xy;
    // Time varying pixel color
    vec3 col = vec3(uv*m,0.0);

    // Output to screen
    fragColor = vec4(col,1.0);
}
{{</shader >}}
