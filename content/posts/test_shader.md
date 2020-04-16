---
title: Demo-测试2
date: "2020-03-16"
url: "/posts/test_shader"
thumbnail: "img/story-logo-black.svg"
description: "测试Shader功能"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-chart
- feature-ace
- feature-math
categories:
- Demo
---
测试shadher
<!--more-->


## shader 嵌入测试
```C#
        static int IsMandelbrot(int MaxIter, double cx, double cy)
        {
            //(xi+y)*(xi+y) = y^2-x^2 + 2xyi
            //(x+yi)*(x+yi) = x^2 -y^2 + 2xyi 
            double x = 0;
            double y = 0;
            for (int i = 0; i < MaxIter; ++i)
            {
                //错误1
                //y = y * y - x*x +cy;
                //x = 2 * x * y+cx;
                // 

                //错误2
                //double x1 = x *x - y * y + cy;
                //double y1 = 2 * x * y + cx;
                //x = y1;
                //y = x1;

                double x1 = x * x - y * y + cx;
                double y1 = 2 * x * y + cy;
                x = x1;
                y = y1;
                if (x * x + y * y > 4.0) return i;
            }
            return MaxIter;
        }
        static void  MandelbrotArea(int MaxIter, float delta,Action<double,double,bool,double> visiter)
        {
            double smallArea = delta * delta;
            for (double x = -2; x < 2; x += delta)
            {
                for (double y = -2; y < 2; y += delta)
                {
                    bool inside = IsMandelbrot(MaxIter, x + delta / 2, y + delta / 2) >= MaxIter;
                    visiter(x, y, inside, smallArea);
                }
            }
            
        }
        static double MonteCarloMandelbrotArea(int MaxIter, Action<double, double, bool,double> visiter)
        {
            double area = 0;

            const int N = 8000;
            double smallArea = 16.0 / N;
            for (int i =0;i<N;++i)
            {
                float x = UnityEngine.Random.Range(-2.0f, 2.0f);
                float y = UnityEngine.Random.Range(-2.0f, 2.0f);
                bool inside = IsMandelbrot(MaxIter, x, y) >= MaxIter;
                visiter(x, y, inside, smallArea);
            }
            return area;
        }
        [MenuItem("Assets/DLCTest/Mand")]
        public static void MandTest()
        {
            StringBuilder sb = new StringBuilder();

            int iterCol = 10;
            int deltalRow = 2;
            int margin = 1;
            int cellSize = 256;
            int width = iterCol*cellSize;
            int height = deltalRow*cellSize;

            var tex = new Texture2D(width, height, TextureFormat.RGB24, false);
            var bgColor = new Color(0.667f, 0.133f, 0.141f);           
            var redColor = new Color(0.0f, 0.369f, 0.608f);
            var blueColor = new Color(1.0f, 0.812f, 0.33f);

            for (int i = 0; i < width; ++i)
            {
                int y = i % cellSize;
                
                for (int j = 0; j < height; ++j)
                {
                    int x = j % cellSize;
                    if (margin < x && x < cellSize - margin
                        && margin < y && y < cellSize - margin)
                    {
                        tex.SetPixel(i, j, bgColor);
                    }
                    else
                    {
                        tex.SetPixel(i, j, Color.black);
                    }
                }
            }

            for (int iter = 0; iter <= iterCol; ++iter)
            {
                for (int rowIter = 0; rowIter < deltalRow; ++rowIter)
                {
                    float delta = 0.1f*(1 - rowIter/deltalRow);
                    double a = 0;
                    MonteCarloMandelbrotArea(10+10*iter, (x, y, inside, smallArea) =>
                    {
                        if (inside) { a += smallArea; }

                        int realCellSize = cellSize - 2 * margin;
                        int mx = iter*cellSize + (int)((x + 2) / 4 * realCellSize) + margin;
                        int nx = iter * cellSize + (int)((x + 2 + Math.Sqrt(smallArea)) / 4 * realCellSize);
                        int my = rowIter * cellSize + (int)((y + 2) / 4 * realCellSize) + margin;
                        int ny = rowIter * cellSize + (int)((y + 2 + Math.Sqrt(smallArea)) / 4 * realCellSize);
                        for (int i = mx; i < nx; ++i)
                        {
                            for (int j = my; j < ny; ++j)
                            {
                                tex.SetPixel(i, j, inside ? redColor : blueColor);
                            }
                        }

                    });
                    sb.AppendFormat("{0};{1};{2}\n", (iter+1)*10, delta, a);
                }
            }
            System.IO.File.WriteAllText("1.txt", sb.ToString());
            tex.Apply();
            var bytes = tex.EncodeToPNG();
            string p = Application.dataPath + "/2.png";
            System.IO.File.WriteAllBytes(p, bytes);
            AssetDatabase.ImportAsset(p);
```


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

### Mandelbrot
Mandelbrot的定义：{{<math>}}f(z)=z^2+c{{</math>}}
{{<p5js noSetup= true >}}
//f(z) = z^2+c
~~~//隐藏的代码
function mandblot(x,y,cx,cy){
  let x1 = x*x-y*y + cx;
  let y1 = 2*x*y + cy;
  return {x:x1,y:y1};
}
function mandelblotSet(cx,cy){
  let x = 0;
  let y = 0;
  for(let i = 0;i<N;++i)
  {
    let z1 = mandblot(x,y,cx,cy)
    x = z1.x;
    y = z1.y;
    let r = x*x+y*y;
    if( r > 4.0)
    {
      return i;
    }
  }
  return N
}
~~~
let _x=0;
let N = 500;

background(0);

pixelDensity();
loadPixels();
while(true){
  if(_x >= width){
    noLoop(); 
    break;
  }
  for(let y = 0; y < height; y++){
    let my = 2*(y/height) - 1;//-1,1
    let mx = 2*(_x/width) - 1; //-2,2
    mx *= width/height;//宽高比修正
    mx -= 0.5;
    let temp = mandelblotSet(mx, my);
    let v = temp / N * 255;
    let si = 4*(y*width+_x);
    pixels[si] = pixels[si+1] = pixels[si+2] = v ;
    pixels[si+3] = 255;
  }
  ++_x;
} 
updatePixels();

{{</p5js>}}
{{<ace readOnly=true allowRunning=true disableFoldButton=true >}}
//f(z) = z^2+c
function mandblot(x,y,cx,cy){
  let x1 = x*x-y*y + cx;
  let y1 = 2*x*y + cy;
  return {x:x1,y:y1};
}

let N = 500;
function mandelblotSet(cx,cy){
  let x = 0;
  let y = 0;
  for(let i = 0;i<N;++i)
  {
    let z1 = mandblot(x,y,cx,cy)
    x = z1.x;
    y = z1.y;
    let r = x*x+y*y;
    if( r > 4.0)
    {
      return i;
    }
  }
  return N
}

//计算mandelbrot的脖子
var testCount = 150;
var esps = Array.from({length:testCount},(v,i)=> -0.1+(i/testCount) * 0.2);
//esps = esps.filter(v => Math.abs(v) >= 0.008)
var divcount = (esp)=>mandelblotSet(-0.75,esp); 
var dc = esps.map(divcount);
{{</ace>}}

在脖子的边界处，发散趋势成正态分布，如下图：
{{<chart code-height=360 height=300 hideCode=false defaultFold=true >}}

chart_data = {
    type: 'line',
    data: {
      labels:esps.map(v => v.toPrecision(2)),       
        datasets: [{
            label: '迭代发散分布',
            data: dc,
        }]
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

如果将发散数量与距离边界的值相乘，可以发现，离边界越近，结果与{{<math>}}\pi{{</math>}}越相近
{{<chart code-height=360 height=300 hideCode=false defaultFold=true >}}
var esps = Array.from({length:testCount},(v,i)=> -0.1+(i/testCount) * 0.2);
esps = esps.filter(v=> Math.abs(v) > 0.008); 
var dc = esps.map(divcount);
var pis = esps.map((v,i)=> Math.abs(v * dc[i]))
chart_data = {
    type: 'line',
    data: {
      labels:esps.map(v => v.toPrecision(2)),       
        datasets: [{
            label: 'PI分布',
            data: pis,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min:3.06,
                    max:3.2
                }
            }]
        }
    }
}
{{</chart>}}