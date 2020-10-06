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
1. 视图变换：在世界空间中放置相机，即以相机为原点建立观察坐标系；
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


1. 投影变换：相机按下快门，各个三维模型在相机的底片上形成二维图形。即将观察坐标系中的三维图形投影到二维的视图窗口上，视频中的投影矩阵推导讲得比较透彻，从正交到透视，层层递进，正交是透视的基础，而透视只需要处理将Frustum挤压到Cuboid的过程即可以，非常容易理解，具体推导过程可以参考这篇文章[^3]；
	- 正交投影矩阵为：[to do]
	- 透视投影矩阵为：{{<math>}}\left( \begin{array}{lcr}
\frac{1}{tan(\frac {fov}{2})*asp}&0&0&0\\
0&tan(\frac {fov}{2})&0&0\\
0&0&\frac{f+n}{f-n}&\frac {-2*f*n}{f-n}\\
0&0&1&0
\end{array} \right){{</math>}}
		- 其中n、f分别为近裁剪面和远裁剪面
	{{<rawhtml>}}<a name="projection"></a>{{</rawhtml>}}
		- ***{{<rawhtml>}}<font color=red>注意：在右手坐标系中，如果相机往z负方向看，则矩阵的4行3列为-1</font>{{</rawhtml>}}***
		- 因为在实际使用投影API时我们传入的near和far都是正值，所以和推导过程会和课程视频中有一些差异，公式中的n应该变成-n,即 {{<math>}}y^{\prime} = \frac {-n}{z} y{{</math>}} 这样对应的矩阵如下：
		- {{<math>}}\left( \begin{array}{lcr}
\frac{1}{tan(\frac {fov}{2})*asp}&0&0&0\\
0&tan(\frac {fov}{2})&0&0\\
0&0&\frac{f+n}{f-n}&\frac {-2*f*n}{f-n}\\
0&0&-1&0
\end{array} \right){{</math>}}

1. 视口变换 [to do]
[^3]:(https://zhuanlan.zhihu.com/p/122411512)

    
---
  
### 四、线性代数实践与应用

>水煮蛋该从“小端“剥开还是从“大端“剥开，这是个值得考虑的问题，执着任何一个选择都有可能会让国家引起叛乱，让皇帝丢了王位、甚至送了性命[^4]。

[^4]:(https://zh.wikipedia.org/wiki/%E5%AD%97%E8%8A%82%E5%BA%8F)


和水煮蛋该从“小端“剥开还是从“大端“剥开一样，图形学中也面临着一些这样值得考虑的问题，比如矩阵该使用行为主序还是列为主序？比如向量该看作是1xn的矩阵还是nx1的的矩阵？比如坐标系该使用左手还是右手？在编码实践中，我们需要题解这些差异，注意不同的引擎或图形API的这些差别，如果不注意，可能会出现一些奇怪的Bug。比如GAMES101的作业一，如果按闫老师课程中的推导过程来计算投影矩阵，会出现三角形倒置的情况。

下面列举出三个比较典型的实例：
1. 行矩阵与列矩阵：一般来说，一个以行为主序的矩阵{{<math>}}M_{a,b}{{</math>}}具有a行b列，而以列为主序的矩阵{{<math>}}M_{a,b}{{</math>}}具有a列b行,行矩阵与列矩阵的差别：
	- 内存布局：对于{{<math>}}M_{a,b}{{</math>}}不管是表示行矩阵还是列矩阵都保存在二维(或一维)数组{{<math>}}A_{a,b}{{</math>}}中，行矩阵的访问下标与与数组访问下标一致，即{{<math>}}M_{i,j}=A_{i,j}{{</math>}} 而列矩阵刚好相反，即 {{<math>}}M_{i,j}=A_{j,i}{{</math>}}
	- 构造函数，一般来说行矩阵的构造函数使用的是行向量，而列矩阵的构造函数使用的是列向量
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
		mat3 n = mat3(col0, col1, col2); // sets columns of matrix n
	- 与向量相乘
		- 在HLSL和GLSL中向量即可以看作行向量也可以看作列向量
		- 在两种语言中，向量与矩阵相乘时，如果向量在矩阵的左边则为行向量，在矩阵右边为列向量
		- 有时为了计算正交矩阵的逆矩阵(等于转置)与向量的乘积会将向量从矩阵的左边移动到矩阵的右边相乘或者相反，因为{{<math>}}M^T*\vec v= v^T*M{{</math>}}，这种用法常用于法线变换或法线贴图的TBN矩阵变换
1. 左右手手坐标系

1. 法线向量坐标变换

[^5]:(https://en.wikibooks.org/wiki/Cg_Programming/Vector_and_Matrix_Operations)

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
	1. 提高项，实现细节请参考[Roderigus旋转矩阵推导](#Roderigus)
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
	}```
1. 三角形显示倒置：前面提到过，如果按闫老师课程中的推导过程来计算投影矩阵，会出现三角形倒置的情况,主要原因是虽然作业中与课程视频使用的都是右手坐标系，相机往z的负方向看，但作业中的near和far使用是正值。正确的做法是将矩阵的4行3列为的1改为-1，具体详情请参考MVP中的右手坐标系下的[投影变换](#projection)

[^6]:(https://www.jianshu.com/p/8b4a1c5cf44b)
### 六、Roderigus旋转矩阵推导 {{<rawhtml>}}<a name="Roderigus"></a>{{</rawhtml>}}

在不同的引擎或图形API中向量、矩阵是在实际实现或使用过程会有一些细微的差别，如果在编码时不注意，可会出现一些奇怪的Bug。比如作业一的投影矩阵，如果按闫老师课程中推导来实现，就会出现三角形倒置的情况。根据笔者的项目经验，在设计或使用图形API时需要注意以下三点：
1. 行列矩阵的表示与内存布局，左结合与右结合
3. 左右手坐标系的差异与影响
4. 法线向量的坐标变换