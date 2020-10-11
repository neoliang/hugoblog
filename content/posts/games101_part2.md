---
title: GAMES101-学习笔记(1)-坐标变换
date: "2020-10-02"
url: "/posts/games101_part2"
description: "计算机图形学概览学习笔记-坐标变换"
thumbnail: "img/games101/part1/triangle.jpg"
image: "img/games101/banner.jpg"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-math
- feature-ace
categories:
- games101
- 图形学
---
本文是GAMES101课程的光栅化中的坐标变换的总结,这部分主要由三个课时的视频组成，首先是超快猛的关于向量和矩阵的线性代数入门介绍，接下来讲述的是缩放、旋转和平移等仿射变换，最后是模型、观察及投影坐标变换。课程的内容提纲挈领，讲述的内容全是精华，前后衔接紧密，所讲述的知识在后面的章节都会有相应的应用。例如向量的点乘的物理意义之一是判断两向量的接近程度，在后面的着色章节用于计算光照强度；再例如向量的叉乘物理意义之一是判断一个点在向量的左则还是右则，在后面光线追踪的章节用于计算光线与三角形求交。
<!--more-->

>纸上得来终觉浅，绝知此事要躬行。 
 ---陆游《冬夜读书示子聿》

### 一、超快猛线性代数入门

1. 向量：表示方向与长度，在N维笛卡尔坐标系中用N个数来表示，例如三维坐标系中的向量{{<math>}}\vec a^T=(a_x,a_y,a_z){{</math>}} 
	- 向量点乘：{{<math>}}\vec a \cdot \vec b = x_a*x_b+y_a*y_b+z_a*z_b {{</math>}} 
	- 向量点乘的应用：
		- 计算两向量的夹角的余弦
		- 计算向量在另一个向量上的投影
		- 将向量分解为水平及垂直目标向量的两向量（可应用于rodrigues推导）
		- 计算两个向量方相近程度（可应用于光照计算）
	- 向量的叉乘：{{<math>}}\vec a \times \vec b =\left( \begin{array}{lcr}
		y_a*z_b-y_b*z_a \\x_b*z_b-x_a*z_b\\x_a*y_b-x_b*y_a
\end{array} \right)  {{</math>}} 
	- 叉乘的矩阵形式：{{<math>}}\vec a \times \vec b = A*\vec b = \left( \begin{array}{lcr}
0& -z_a&y_a\\
z_a& 0 &-x_a\\
-y_a&x_a&0\end{array} \right)  \left( \begin{array}{lcr}
		x_b \\y_b\\z_b
\end{array} \right){{</math>}} 
	- 向量叉乘的应用：
		- 判断一个向量在另一个向量的左或右
		- 计算面积
	- 点乘判断前后，叉乘判断左右
1. 矩阵:二维数组，在图形学中用来表示坐标的平移、旋转与缩放等坐标变换
	- 矩阵乘矩阵，规则为左行乘右列，即{{<math>}}AB_{i,j} = \sum_{r=1}^{n} A_{i,r}*B_{r,j} {{</math>}}({{<math>}}A_{mn}{{</math>}}是m行n列矩阵{{<math>}}B_{np} {{</math>}}是n行p列矩阵)
	- 矩阵之间的乘积不满足交换率，比如先平移再旋转与先旋转再平移结果是有差异的。一种解释是可以把矩阵乘法看作是复合函数[^1]，即{{<math>}}AB \Rightarrow A(B){{</math>}}，而函数一般是不满足交换律的，比如：{{<math>}}f(x)=sin(x){{</math>}}，{{<math>}}g(x)=x^2{{</math>}},那么：{{<math>}}f(g(x)=sin(x^2)  \ne g(f(x))=sin^2(x){{</math>}} 
	- 矩阵满足结合律和分配律
	- 在OpenGL，CG等语言中向量既可以看作一个mx1的列矩阵，也可以看作1xm的行矩阵
	- 正交矩阵的逆等于转置，旋转矩阵是正交矩阵，所以其逆等于转置

[^1]:(https://www.matongxue.com/madocs/555/)
----

### 二、仿射变换

1. 缩放、旋转、错切(shear)变换
	- 3D缩放矩阵 {{<math>}}\left( \begin{array}{lcr}
s_x& 0&0\\
0& s_y &0\\
0&0&s_z\end{array} \right){{</math>}}
	- 旋转矩阵{{<rawhtml>}}<a name="rotaion_z"></a>{{</rawhtml>}}
		- {{<math>}}Rz(\theta) = \left( \begin{array}{lcr}
cos(\theta)& -sin(\theta)&0\\
sin(\theta)& cos(\theta) &0\\
0&0&1\end{array} \right){{</math>}}
		- {{<math>}}Rx(\theta) = \left( \begin{array}{lcr}
0&cos(\theta)& -sin(\theta)\\
0&sin(\theta)& cos(\theta) \\
0&0&1\end{array} \right){{</math>}}
		- {{<math>}}Ry(\theta) = \left( \begin{array}{lcr}
cos(\theta)&0& sin(\theta)\\
0&1&0\\
-sin(\theta)&0& cos(\theta) 
\end{array} \right){{</math>}}
		- 注意以上旋转为左手坐标系下的表示，右手坐标系下{{<math>}}Rx(\theta){{</math>}}左下角和右上角的{{<math>}}sin(\theta){{</math>}}分别是负、正，而{{<math>}}Ry(\theta){{</math>}}的{{<math>}}sin(\theta){{</math>}}下好相反
		- 旋转还可以用四元数来表示，四元数可以用于旋转的插值而矩阵不能
	- 2D错切矩阵 {{<math>}}\left( \begin{array}{lcr}
1& a\\
0& 1 \end{array} \right){{</math>}}

1. 仿射变换与齐次坐标系
	- 仿射变换等于线性变换加平移，即{{<math>}}a = Ab + t {{</math>}}
	- 坐标点的平移不能用矩阵相乘来表示，但可以写成{{<math>}}\left( \begin{array}{lcr} a\\1\end{array} \right) =  \left( \begin{array}{lcr}
A&t\\
0&1\end{array} \right)\left( \begin{array}{lcr} b\\1\end{array} \right){{</math>}}  这样增加一个维度后,就可以在高维度通过线性变换来完成低维度的平移变换[^2]
	- 平移变换只适用于点，而向量在平移后保持不变，所以对于向量新增加的维度的坐标恒为0，即向量{{<math>}}\vec v{{</math>}}的齐次坐标为{{<math>}}\left( \begin{array}{lcr} \vec v\\0\end{array} \right){{</math>}} 而点p的齐次坐标为{{<math>}}\left( \begin{array}{lcr} p\\1\end{array} \right){{</math>}}
	- 这种增加一个维度来表示点或者向量的坐标系称为齐次坐标系
	- 在齐次坐标系下所有仿射变换都可以用矩阵相乘来表示
	- 向量、点的加法、减法在齐次坐标系下与笛卡尔坐标系下是相容的，特别地，点与点相加在齐次坐标系表示求两个点的中点
	- 同样缩放、旋转变换在齐次坐标系下与笛卡尔坐标系下是相容的
1. 逆变换等于乘于变换矩阵的逆矩阵

1. 复杂变换的分解，例如二维坐标系下绕任意一点旋转（三维坐标系后续有推导）
	- 将旋转中心移动到原点
	- 旋转
	- 将中心从原点移动回来
	- 公式表示：{{<math>}}R(p,\theta) = T(p)\cdot R(\theta) \cdot T(-p) {{</math>}}
  


>矩阵{{<math>}}  \left( \begin{array}{lcr}
A&t\\
0&1\end{array} \right)=\left( \begin{array}{lcr}
a&b&c&t_x\\
d&e&f&t_y\\
g&h&i&t_z\\
0&0&0&1
\end{array} \right){{</math>}}表示先做线性变换(乘以矩阵A)再平移(加上t)
[^2]:(https://www.matongxue.com/madocs/244/)
----

### 三、MVP
1. Modle变换：将各个模型在世界空间的摆好Pose,等待拍照。即在模型上应用平移、缩放和旋转等仿射变换，将坐标从模型空间变换到世界空间；
1. 观察变换：在世界空间中放置相机，即以相机为原点建立观察坐标系；
	- 观察矩阵推导：视频课程中的推导讲得比较透彻，容易理解，但推导过程相对较长，另外有一种比较简洁的推导方法，假设观察坐标系的原点为o，三个坐标轴(基底)为{{<math>}}\vec r {{</math>}}，{{<math>}}\vec u {{</math>}}，{{<math>}}\vec f{{</math>}}，对于该坐标系的任意一点{{<math>}}v{{</math>}}在世界坐标系中的坐标p如下：
	- {{<math>}}p=x_v*\vec r + y_v*\vec u + z_v* \vec f  + o = T(o)\left( \begin{array}{lcr}
		\vec r&\vec u&\vec f
\end{array} \right) \left( \begin{array}{lcr}
		x_v \\y_v\\z_v
\end{array} \right){{</math>}} 将矩阵展开形式如下：
	- {{<math>}}p = \left( \begin{array}{lcr}
1&0&0&x_o\\
0&1&0&y_o\\
0&0&1&z_o\\
0&0&0&1
\end{array} \right) \left( \begin{array}{lcr}
x_r&x_u&x_f&0\\
y_r&y_u&y_f&0\\
z_r&z_u&z_f&0\\
0&0&0&1
\end{array} \right)v{{</math>}} 根据该式可得：
	- {{<math>}}v = {\left( \begin{array}{lcr}
x_r&x_u&x_f&0\\
y_r&y_u&y_f&0\\
z_r&z_u&z_f&0\\
0&0&0&1
\end{array} \right)}^{-1}{\left( \begin{array}{lcr}
1&0&0&x_o\\
0&1&0&y_o\\
0&0&1&z_o\\
0&0&0&1
\end{array} \right)}^{-1} p{{</math>}} 即：
	- {{<math>}}v = \left( \begin{array}{lcr}
x_r&y_r&z_r&-\vec r \cdot o\\
x_u&y_u&z_u&-\vec u \cdot o\\
x_f&y_f&z_f&-\vec f \cdot o\\
0&0&0&1
\end{array} \right) p{{</math>}}
	- 综上得观察矩阵 {{<math>}}View = \left( \begin{array}{lcr}
x_r&y_r&z_r&-\vec r \cdot o\\
x_u&y_u&z_u&-\vec u \cdot o\\
x_f&y_f&z_f&-\vec f \cdot o\\
0&0&0&1
\end{array} \right){{</math>}}
	- ***{{<rawhtml>}}<font color=red>注意，这里是在左手坐标系下推导的观察矩阵，相机是往z的正方向看的，而在右手坐标系下相机是往z负方向看。因为只有往z负方向看，最终变换到观察窗口中的坐标x才是向右，y才是向上的；如果往z正方向看，则观察窗口中的坐标x是向左的，这样光栅光的结果最终是左右翻转的</font>{{</rawhtml>}}***
	{{<rawhtml>}}<a name="view"></a>{{</rawhtml>}}
	- 固右手坐标系对应的观察矩阵为： {{<math>}}View = \left( \begin{array}{lcr}
x_r&y_r&z_r&-\vec r \cdot o\\
x_u&y_u&z_u&-\vec u \cdot o\\
-x_f&-y_f&-z_f&\vec f \cdot o\\
0&0&0&1
\end{array} \right){{</math>}}


1. 投影变换：相机按下快门，各个三维模型在相机的底片上形成二维图形。即将观察坐标系中的三维图形投影到二维的视图窗口上，视频中的投影矩阵推导讲得比较透彻，从正交到透视，层层递进，正交是透视的基础，而透视只需要处理将Frustum挤压到Cuboid的过程即可以，非常容易理解；
	- 正交投影矩阵为：{{<math>}}\left( \begin{array}{lcr}
\frac{2}{r-l}&0&0&-\frac{r+l}{r-l}\\
0&\frac{2}{t-b}&0&-\frac{t+b}{t-b}\\
0&0&\frac{2}{n-f}&-\frac{n+f}{n-f}\\
0&0&0&1
\end{array} \right){{</math>}}
		- 其中n、f分别为近裁剪面和远裁剪面
		- 视频的推导过程分成两步，先将相机的中心移动到原点，然后再缩放，将两个矩阵相乘就得到最终的投影矩阵
		- 另外一种比较简单的办法是直接将坐标值映射到 [-1,1] 区间，以{{<math>}} x {{</math>}}为例：
			- step1：将{{<math>}}x{{</math>}}映射到[0,1]区间 {{<math>}}x^{\prime} = \frac {x-l}{r-l} {{</math>}}
			- step2：将{{<math>}}x^{\prime}{{</math>}}从 [0,1] 映射到 [-1,1]， {{<math>}}x^{\prime} = x^{\prime} * 2 - 1{{</math>}}
			- 根据step1和step2可得{{<math>}}x^{\prime} = \frac {2}{r-l} - \frac {x+l}{r-l}{{</math>}}
		- ***{{<rawhtml>}}<font color=red>注意：在右手坐标系中，一般情况下相机往z负方向看，这样屏幕向上为y正方向，屏幕向左为x正方向。这里的n和f为负值，固矩阵的第3行3列的分母为 n-f </font>{{</rawhtml>}}***
	- 透视投影矩阵为：{{<math>}}\left( \begin{array}{lcr}
\frac{-1}{tan(\frac {fov}{2})*asp}&0&0&0\\
0&\frac{-1}{tan(\frac {fov}{2})}&0&0\\
0&0&\frac{f+n}{n-f}&\frac {-2*f*n}{n-f}\\
0&0&1&0
\end{array} \right){{</math>}} （1式）
		- 具体推导过程可以参考这篇文章[^3]，这篇文章推导思路大体正确，但推导结果不对，正确的结果应该是前面列出（1式）原因正如前面所说near和far取值为负，这样{{<math>}}tan(\frac {fov}{2}) = \frac {t-b}{-2 n}{{</math>}}，导致最终推导出来的矩阵第1行1列和2行2列都有负号。
	{{<rawhtml>}}<a name="projection"></a>{{</rawhtml>}}
		- ***{{<rawhtml>}}<font color=red>注意：在OpenGL中，相机是往z负方向看的，但在实际使用投影API时传入的near和far均为正值，所以计算时： {{<math>}}y^{\prime} = \frac {-n}{z} y{{</math>}}，这样推导出的矩阵如下：</font>{{</rawhtml>}}***
		- {{<math>}}\left( \begin{array}{lcr}
\frac{1}{tan(\frac {fov}{2})*asp}&0&0&0\\
0&\frac {1}{tan(\frac {fov}{2})}&0&0\\
0&0&\frac{f+n}{f-n}&\frac {-2*f*n}{f-n}\\
0&0&-1&0
\end{array} \right){{</math>}}

1. 视口变换，相对于观察和投影变换，视口变换比较简单，我们只需要将 x,y 分别从 [-1,1] 转到 [0,width] 和 [0,height] 即可,变换公式为：{{<math>}}x^{\prime} = width \cdot \frac {x+1}{2} {{</math>}}  {{<math>}}y^{\prime} = height \cdot \frac {y+1}{2} {{</math>}}
	- 对应的矩阵为：{{<math>}}\left( \begin{array}{lcr}
\frac {width}{2}&0&0&\frac {width}{2}\\
0&\frac {height}{2}&0&\frac {height}{2}\\
0&0&1&0\\
0&0&0&1
\end{array} \right){{</math>}}
[^3]:(https://zhuanlan.zhihu.com/p/122411512)

    
---
  
### 四、线性代数实践与应用

>水煮蛋该从“小端“剥开还是从“大端“剥开，这是个值得考虑的问题，执着任何一个选择都有可能会让国家引起叛乱，让皇帝丢了王位、甚至送了性命[^4]。

[^4]:(https://zh.wikipedia.org/wiki/%E5%AD%97%E8%8A%82%E5%BA%8F)


和水煮蛋该从“小端“剥开还是从“大端“剥开一样，图形学中也面临着一些这样值得考虑的问题，比如矩阵该使用行为主序还是列为主序？比如向量该看作是1xn的矩阵还是nx1的的矩阵？比如坐标系该使用左手还是右手？在编码实践中，我们需要题解这些差异，注意不同的引擎或图形API的这些差别，如果不注意，可能会出现一些奇怪的Bug。比如GAMES101的作业一，如果按闫老师课程中的推导过程来计算投影矩阵，会出现三角形倒置的情况。

下面列举出三个比较典型的实例：
1. 行矩阵与列矩阵：一般来说，一个以行为主序的矩阵{{<math>}}M_{a,b}{{</math>}}具有a行b列，而以列为主序的矩阵{{<math>}}M_{a,b}{{</math>}}具有a列b行,行矩阵与列矩阵的差别：
	- 内存布局与下标索引：对于{{<math>}}M_{a,b}{{</math>}}我们可以在语法和语义上来规定是行还是列矩阵，同样，我们也可以在内存布局上指定按行存储还是按列存储。一般地，内存布局应该做到对语言使用者透明，但有时候会涉及到矩阵数据从CPU传递到GPU,这就很有必要了显示的说明矩阵的内存布局：
		- GLSL和HLSL的矩阵默认的内存布局是列为主序的，所以CPU传递到GPU的矩阵在内存布局上应该也列为主序
		- GLSL和HLSL对矩阵的索引在语义上一些差异，例如一个矩阵 m，m[a][b] 在HLSL中表示矩阵m的第a行b列，而在GLSL中表示矩阵m的第b行a列。
		- 对于HLSL，可以通过关键字#pragma pack_matrix 显示来指定内存布局，但这只会影响CPU传递到GPU的矩阵数据布局顺序，以及加载到寄存器的汇编指令生成，而对语言使用者来说是透明的，不管内存布局以列还是行为主，在语法和语义上都是一致的。例如，不管内存布局如何指定：
			- `float2x2 m = { 1.0f,1.1f, 2.0f,2.1f };`
			-  在语义上 m[0] 和 m[1] 的值永远为`{1.0f,1.1f}`和`{1 2.0f,2.1f}`
	- 构造函数：一般来说行矩阵的构造函数使用的是行向量，而列矩阵的构造函数使用的是列向量，
		- 在Cg或HLSL中矩阵构造函数以行向量为主[^5]
		- 在GLSL中矩阵构造函数是以列向量为主
		- 具体区别可见如下代码示例：
		```c++
		//Cg或HLSL,矩阵构造以行向量为单位
		float3x3 m = float3x3(
			1.1, 1.2, 1.3, // first row 
			2.1, 2.2, 2.3, // second row
			3.1, 3.2, 3.3  // third row
			);
		float3 row0 = float3(0.0, 1.0, 0.0);
		float3 row1 = float3(1.0, 0.0, 0.0);
		float3 row2 = float3(0.0, 0.0, 1.0);
		float3x3 n = float3x3(row0, row1, row2); // sets rows of matrix n
		
		//GLSL矩阵构造以列向量为单位
		mat3 m = mat3(1.1, 2.1, 3.1, //first column
              		  1.2, 2.2, 3.2, //second column
              		  1.3, 2.3, 3.3  // third column
              		  );
		vec3 col0 = vec3(0.0, 1.0, 0.0);
		vec3 col1 = vec3(1.0, 0.0, 0.0);
		vec3 col2 = vec3(0.0, 0.0, 1.0);
		mat3 n = mat3(col0, col1, col2); // sets columns of matrix n```

	- 与向量相乘
		- 在HLSL和GLSL中向量即可以看作行向量也可以看作列向量
		- 在两种语言中，向量与矩阵相乘时，如果向量在矩阵的左边则为行向量，在矩阵右边为列向量
		- 有时为了计算正交矩阵的逆矩阵(等于转置)与向量的乘积会将向量从矩阵的左边移动到矩阵的右边相乘或者相反，因为{{<math>}}M^T*\vec v= v^T*M{{</math>}}，这种用法常用于法线变换或法线贴图的TBN矩阵变换
	- Unity的矩阵与Shader
		- 在应用侧,`Matrix4x4`的内存布局以列为主序，下标索引的语言与HLSL一致，例如m[a][b] 表示矩阵m的第a行b列
		- Shader Lab使用的是CG/HLSL语言，在编译到不同平台的shader时，所有的矩阵相乘会全部展开为向量相乘或相加
1. 左右手手坐标系[^6]：通常情况下，在设计或使用不同的图形API时我们需要考虑两种不同的笛卡尔坐标系，即左手和右手坐标系。在两种坐标系中，x的正方向都指向右，y的正方向指向上。区分他们的方法比较简单，z正方向指向屏幕里的是左手坐标系，而z正方向指向屏幕外的是右手坐标系。它们之所以叫左手或右手坐标系的原因这些坐标系满足左手或右手定则，即当我们往x方向伸出手指，然后让手指弯向y方向，拇指所指向的方向为z的正方向，如下图：
![左右手坐标系](/img/games101/part1/left_right_hand.jpg)
	- 在图形API中左右手坐标系是一种约定，或者是默认的选择，并不是强制规范。比如D3D默认是左手坐标系，但也可以使用右手坐标系；OpenGL默认是右手坐标系，但也可以使用左手坐标系。D3D还专门提供了不同坐标系下的API，例如[LookAtRH](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/bb281711(v=vs.85))和[LookAtLH](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/bb281710(v=vs.85))分别代表获取右手和左手坐标系下的观察矩阵
	- 左右手坐标系的影响面：
		- 旋转：右手坐标系下旋转是逆时针为正，顺时针为负，左手坐标系刚才相反
		- 相机的观察矩阵View，左手坐标系是往z正方向看，右手坐标系往z负方向看，具体区别请参考MVP中的[观察变换](#view)
		- 相机的投影矩阵，在左手坐标系中相机往z正方向看，near和far为正值，所以推导出来的矩阵为：{{<math>}}\left( \begin{array}{lcr}
\frac{1}{tan(\frac {fov}{2})*asp}&0&0&0\\
0&\frac {1}{tan(\frac {fov}{2})}&0&0\\
0&0&\frac{f+n}{f-n}&\frac {-2*f*n}{f-n}\\
0&0&1&0
\end{array} \right){{</math>}} 请注意该矩阵与MVP中的[投影变换](#projection)的差别
		- 法线向量，相机观察与投影

1. 法线向量坐标变换：如果直接对模型的法线进行与顶点相似的变换，当各个方向的缩放不相同时，可能会出现错误，[如下图所示](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/transforming-normals)，我们对 a) 的三角形进行缩放(1,2)的变换，如果法线也采用相同的变换，会得到如 b) 所示的结果，很显示这个错误的，正确的结果应该如 c) 所示
![非统一缩放会导致法线方向错误](/img/games101/part1/normaltrans.jpeg)
当我们对模型顶点变换时，对应的法线该怎么变换呢？对于模型的某一平面经过{{<math>}}p_0{{</math>}}，法线为{{<math>}}\vec n{{</math>}},可以写出平面的方程为{{<math>}}\vec n \cdot (p-p_0) = 0{{</math>}}，假设对模型的变换矩阵为 M 则{{<math>}}p-p_0{{</math>}}对应的变换为{{<math>}}M(p-p_0){{</math>}}，则平面方程对应的变换为：
	- {{<math>}}\vec n M^{-1}M (p-p_0) = 0{{</math>}}  {{<rawhtml>}}<font color=red>(注意，这里的{{<math>}}\vec n{{</math>}}为行向量，{{<math>}}p-p_0{{</math>}}为列向量)</font>{{</rawhtml>}}
	- 上式之所以成立是因为矩阵相乘具有结合律，并且{{<math>}} M^{-1}M {{</math>}}为单位矩阵
	- 如果将{{<math>}}\vec n{{</math>}}看作列向量，则对应的变换为{{<math>}} (M^{-1})^T \vec n{{</math>}}
	- 在HLSL、GLSL或Unity的Shader中，向量与矩阵相乘时如果被放到矩阵的左边会被当作行向量，所以我们一般在代码中看到对法线的变换如此： {{<math>}}\vec n M^{-1}{{</math>}}

[^5]:(https://en.wikibooks.org/wiki/Cg_Programming/Vector_and_Matrix_Operations)
[^6]:(https://docs.microsoft.com/en-us/previous-versions/windows/desktop/bb324490(v=vs.85))

---
### 五、作业一


>本次作业的任务是填写一个旋转矩阵和一个透视投影矩阵，需要在 main.cpp 中修改的函数
>1. get_model_matrix(float rotation_angle): 逐个元素地构建模型变换矩 阵并返回该矩阵。在此函数中，你只需要实现三维中绕 z 轴旋转的变换矩阵， 而不用处理平移与缩放。
>1. get_projection_matrix(float eye_fov, float aspect_ratio, float zNear, float zFar): 使用给定的参数逐个元素地构建透视投影矩阵并返回 该矩阵。
>1. 提高项 get_rotation(Vector3f axis, float angle):得到绕任意 过原点的轴的旋转变换矩阵。

1. 环境搭建,本次作业需要使用第三方库OpenCV,如何在Xcode下配置OpenCV请参考这篇文章[^6]

1. 作业框架中源代码的一些bug：
	- `rasterizer`类的`set_pixel`函数的代码段`
	auto ind = (height-point.y())*width + point.x()`会让[frame_buf数组越界引起崩溃](http://games-cn.org/forums/topic/%e4%bd%9c%e4%b8%9a1%e4%bb%a3%e7%a0%81%e6%a1%86%e6%9e%b6%e6%9c%89%e4%b8%80%e5%a4%84crash-bug/)
	- `main.cpp`中`get_view_matrix`函数的view矩阵计算有误，应该为`view = view * translate`而不是`view = translate * view`，不过这个bug对作业一无影响，因为源代码中的view为单位矩阵

1. 作业解析：
	1. 模型绕 z 轴旋转矩阵，矩阵实现细节请参考仿射变换的[旋转矩阵](#rotaion_z)，对应的代码如下：
	1. 构建透视投影矩阵,实现细节请参考MVP中的[投影变换](#projection)
	1. 提高项，实现细节请参考[Rodrigus旋转矩阵推导](#Rodrigus)
	1. 作业1、2、3部分最终实现代码如下：
	```c++
	//1. 模型绕 z 轴旋转矩阵
	Eigen::Matrix4f get_model_matrix(float rotation_angle)
	{
	    Eigen::Matrix4f model = Eigen::Matrix4f::Identity();
	    float a = rotation_angle/180.0f*PI;
	    float c = cosf(a),s = sinf(a);
	    model << c,-s,0,0,
	             s, c,0,0,
	             0, 0,1,0,
	             0, 0,0,1;
	    return model;
	}
	//2. 构建透视投影矩阵
	Eigen::Matrix4f get_projection_matrix(float eye_fov, float aspect_ratio,
	                                      float zNear, float zFar)
	{
	    Eigen::Matrix4f projection = Eigen::Matrix4f::Identity();
	    float cota = 0.5f * eye_fov / 180.0f * 3.1415926f ;
	    cota = 1.f/ tanf(cota);
	    //右手坐标系
	    float zD = (zFar-zNear);
	    projection <<   cota/aspect_ratio,0,0,0,
	                    0,cota,0,0,
	                    0,0,(zFar+zNear)/zD,-2.0f*zFar*zNear/zD,
	                    0,0,-1,0;
	    return projection;
	}
	//3. 得到绕任意 过原点的轴的旋转变换矩阵
	//矩阵的推导过程请参考第六部分 Rodrigus旋转矩阵推导
	Eigen::Matrix4f get_rotation(Vector3f axis, float angle)
	{
	    Eigen::Matrix3f I = Eigen::Matrix3f::Identity();
	    Eigen::Matrix3f N;
	    float a = angle/180.0f*PI;
	    float c = cosf(a),s = sinf(a);
	    Vector3f n = axis.normalized();
	    N << 0,    -n.z(), n.y(),
	         n.z(), 0,    -n.x(),
	        -n.y(), n.x(), 0;
	    //wikipedia的方法
	    return toMatrix4f(I + (N*N)*(1-c) + N*s);
	    //闫老师的方法 n*n^t
	    //return toMatrix4f(c*I + (1-c)*(n*n.transpose()) + s*N);
	}```
1. 三角形显示倒置：前面提到过，如果按闫老师课程中的推导过程来计算投影矩阵，会出现三角形倒置的情况,主要原因是虽然作业中与课程视频使用的都是右手坐标系，相机往z的负方向看，但作业中的near和far使用是正值。正确的做法是将矩阵的4行3列为的1改为-1，具体详情请参考MVP中的右手坐标系下的[投影变换](#projection)
1. 作业源代码[github](https://github.com/neoliang/games101/tree/master/pa1)

[^6]:(https://www.jianshu.com/p/8b4a1c5cf44b)
---

### 六、Rodrigus旋转矩阵推导 {{<rawhtml>}}<a name="Rodrigus"></a>{{</rawhtml>}}
在仿射变换章节中，我们已经推导出了绕x、y、z轴旋转的矩阵，对应绕任意轴旋转的矩阵，可以用欧拉角或四元数来表示，也可以用Rodrigues旋转公式来表示，Rodrigues旋转公式有两种表示方向，第一种是视频课程中表示方式，如下：
1. {{<math>}}R(\vec n,\alpha) = cos(\alpha)I+(1-cos(\alpha))\vec n \vec n ^T + sin(\alpha) N {{</math>}},其中I为3x3单位矩阵，N为{{<math>}} \left( \begin{array}{lcr}
0& -n_z&n_y\\
n_z& 0 &-n_x\\
-n_y&n_x&0\end{array} \right){{</math>}}，{{<math>}}\vec n \vec n ^T{{</math>}} 为 {{<math>}} \left( \begin{array}{lcr}
n_x^2& n_x*n_y&n_x*n_z\\
n_x*n_y& n_y^2 &n_y*nz\\
n_x*n_z&n_y*n_z&n_z^2\end{array} \right){{</math>}}

1. 第一种表示方式闫老师在补充材料里有证明，详细请参考[这里](https://sites.cs.ucsb.edu/~lingqi/teaching/resources/GAMES101_Lecture_04_supp.pdf)
1. 第二种表示方式来自于[wikipedia](https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula)，如下：
1. {{<math>}}R(n,\alpha) = I+sin(\alpha) N + (1-cos(\alpha)) N^2 {{</math>}}，其中I、N与1式中相同，wikipedia中的推导过程和示意图都相对复杂，看起来比较费劲。我将原来的三维示意图分成了两个部分比较简单的部分，并在示意图上备注各个步骤，简化了图形和推导过程，让其更加容易理解，具体如下：
1. 对于围绕单位向量 {{<math>}}\vec n {{</math>}}旋转 {{<math>}}\alpha {{</math>}}角度的向量 {{<math>}}\vec v {{</math>}} ,我们可以将其分解成两部分 
（1） {{<math>}} \vec v = \vec v_{\parallel}+\vec v_{\perp}  {{</math>}}，当{{<math>}}\vec v{{</math>}}旋转{{<math>}}\alpha{{</math>}}到{{<math>}}\vec v^{\prime}{{</math>}}时，{{<math>}}\vec v_{\parallel}{{</math>}}保持不变，{{<math>}}\vec v_{\perp}{{</math>}}旋转到{{<math>}}\vec v_{\perp}^{\prime}{{</math>}}，可得：（2） {{<math>}}\vec v^{\prime}= \vec v_{\parallel} + \vec v_{\perp}^{\prime}{{</math>}}
![Rodrigus示意图1](/img/games101/part1/rodrigues1.jpg)
这样我们只需要将 {{<math>}}\vec v_{\parallel}{{</math>}} {{<math>}}\vec v_{\perp}^{\prime}{{</math>}} 用 {{<math>}}\vec v{{</math>}} 和 {{<math>}}\vec n{{</math>}} 表示出来即可得到 {{<math>}}\vec v^{\prime}{{</math>}}，引入一个向量（3）{{<math>}}\vec w = \vec n \times \vec v{{</math>}}，沿{{<math>}}\vec n{{</math>}}的负方向观察，如下图：
![Rodrigus示意图2](/img/games101/part1/rodrigues2.jpg)
我们可以得知：（5）{{<math>}}\vec v_{\perp}= - \vec n \times (\vec n \times \vec v){{</math>}}，由于{{<math>}}\vec v_{\perp}{{</math>}}，{{<math>}}\vec w{{</math>}}和{{<math>}}\vec v_{\perp}^{\prime}{{</math>}}的长度相等，并且{{<math>}}\vec w{{</math>}}与{{<math>}}\vec v_{\perp}^{\prime}{{</math>}}垂直，可以得到（6）{{<math>}}\vec v_{\perp}^{\prime} = \vec v_{\perp} cos(\alpha) + \vec wsin(\alpha){{</math>}}，由示意图1我们知道（4）{{<math>}}\vec v_{\parallel} = \vec v - \vec v_{\perp} {{</math>}}，从而得到{{<math>}}\vec v_{\parallel} = \vec v + \vec n \times(\vec n \times \vec v){{</math>}}，由以上几式可以得到：
	- (7)    {{<math>}}\vec v_{\perp}^{\prime} = -(\vec n \times(\vec n \times \vec v))cos(\alpha) + (\vec n\times \vec v)sin(\alpha){{</math>}}
	
	- (8)    {{<math>}}\vec v^{\prime} = \vec v + (1-cos(\alpha))(\vec n \times(\vec n \times \vec v)) + sin(\alpha)(\vec n\times \vec v){{</math>}}，由于向量的叉乘可以写成矩阵相乘的形式，因此我们可以将该公式改写如下：
	
	- {{<math>}}R(\vec n,\alpha) = I + (1-cos(\alpha))N^2+sin(\alpha)N {{</math>}}

	- 其中N为{{<math>}} \left( \begin{array}{lcr}
0& -n_z&n_y\\
n_z& 0 &-n_x\\
-n_y&n_x&0\end{array} \right){{</math>}}

[//]:在不同的引擎或图形API中向量、矩阵是在实际实现或使用过程会有一些细微的差别，如果在编码时不注意，可会出现一些奇怪的Bug。比如作业一的投影矩阵，如果按闫老师课程中推导来实现，就会出现三角形倒置的情况。根据笔者的项目经验，在设计或使用图形API时需要注意以下三点：1.行列矩阵的表示与内存布局，左结合与右结合3.左右手坐标系的差异与影响4.法线向量的坐标变换
