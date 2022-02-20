---
title: 深度学习测试
date: "2020-10-29"
url: "/posts/deep_learnning_test"
description: "展示tensorflow深度学习"
classes:
- feature-figcaption
- feature-figcaption-hidden
- feature-ace
- feature-ui
- feature-math
categories:
- AI
- Deep Learnning
---
展示tensorflow深度学习
<!--more-->

{{<rawhtml>}}
	 <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
  <!-- Import tfjs-vis -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js"></script>

  <!-- Import the main script file -->
 <script >

 async function getData() {
  const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');  
  const carsData = await carsDataResponse.json();  
  const cleaned = carsData.map(car => ({
    mpg: car.Miles_per_Gallon,
    horsepower: car.Horsepower,
  }))
  .filter(car => (car.mpg != null && car.horsepower != null));
  
  return cleaned;
}

var a = tf.scalar(Math.random()).variable()
var b = tf.scalar(Math.random()).variable()
var c = tf.scalar(Math.random()).variable()

function predict(X) {
  return a.mul(X.square()).add(b.mul(X)).add(c);
}
function loss(X,Y) {
  return X.sub(Y).square().mean()
}
const learningRate = 0.01
const learningCount =  500

async function run() {
  // Load and plot the original input data that we are going to train on.
  const data = await getData();
  const values = data.map(d => ({
  x: d.horsepower,
  y: d.mpg,
  }));

  tfvis.render.scatterplot(
  {name: 'Horsepower v MPG'},
  {values}, 
  {
    xLabel: 'Horsepower',
    yLabel: 'MPG',
    height: 300
  }
  );
  const xs = tf.tensor1d(values.map(v=>v.x))
  const ys = tf.tensor1d(values.map(v=>v.y))
  const xmin = xs.min()
  const xmax = xs.max()
  const ymin = ys.min()
  const ymax = ys.max()
  const nxs = xs.sub(xmin).div(xmax.sub(xmin))
  const nys = ys.sub(ymin).div(ymax.sub(ymin))


  const optimizer = tf.train.adam(learningRate)
  for (var i = learningCount - 1; i >= 0; i--) {
    optimizer.minimize(()=>loss(predict(nxs),nys))
    console.log(i)
  }
  var px = tf.linspace(0,1,100)
  var py = predict(px)
  const npx = px.mul(xmax.sub(xmin)).add(xmin).dataSync()
  const npy = py.mul(ymax.sub(ymin)).add(ymin).dataSync()


  const predictedPoints = Array.from(npx).map((val, i) => {
    return {x: val, y: npy[i]}
  });

  tfvis.render.scatterplot(
    {name: 'Model Predictions vs Original Data'}, 
    {values: [values, predictedPoints], series: ['original', 'predicted']}, 
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  );

}


document.addEventListener('DOMContentLoaded', run);

 </script>
{{</rawhtml>}}