function P(x,y){
  return {x:x,y:y};
}

function DrawFunc(p5,f,c,xa=0, xb=null)
{
    if(xb === null) xb = p5.width
    let x = xa, y = f(x)
    let N = 200;
    p5.stroke(c);
    for (let t = 1/N; t <= 1; t+=1.0/N)
    {
        let x1 = xa*(1-t)+t*xb;
        let y1 = f(x1);       
        p5.line(x,y,x1,y1);
        x = x1,y = y1;
    }
}
function distance(a,b)
{
  return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function createInterpolation(p5,points,radius,onPointsChanged){

    let selectedIdx = -1;
    //double click to delete 
    p5.doubleClicked = ()=>{
      let mP = P(p5.mouseX,p5.mouseY);
      let clickedIdx = points.findIndex(p=> distance(p,mP) <= radius)
      if(clickedIdx >=0){
        points[clickedIdx] = points[points.length-1];
        console.log("doubleClicked",selectedIdx)
        points.pop();
        onPointsChanged()
      }

    }
    p5.mousePressed =()=>{
      let mP = P(p5.mouseX,p5.mouseY);
      selectedIdx = points.findIndex(p=> distance(p,mP) <= radius)
      
      if(selectedIdx == -1)
      {
        selectedIdx = points.length
        points.push(P(p5.mouseX,p5.mouseY))
        onPointsChanged()
      }
    }
    p5.mouseReleased = ()=>{
      selectedIdx = -1;
    }
    p5.mouseDragged =()=>{
      if(selectedIdx >=0)
      {
        points[selectedIdx]=P(p5.mouseX,p5.mouseY);
        onPointsChanged()
      }
    }

}