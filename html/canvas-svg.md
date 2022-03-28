# canvas 和 svg

Canvas 和 SVG 都允许您在浏览器中创建图形，但是它们在根本上是不同的。

## canvas

Canvas 通过 JavaScript 来绘制 2D 图形。

Canvas 是逐像素进行渲染的，Canvas绘制的图片输出是是位图（标量图）。

在 canvas 中，一旦图形被绘制完成，它就不会继续得到浏览器的关注。如果其位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被图形覆盖的对象。

## svg

SVG 是一种使用 XML 描述 2D 图形的语言。

SVG 基于 XML，这意味着 SVG DOM 中的每个元素都是可用的。您可以为某个元素附加 JavaScript 事件处理器。

在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。

SVG绘制的图形是一种矢量图。

## canvas VS svg

1、svg绘制的图片矢量图，而canvas绘制的图片是标量图，所以canvas依赖分辨率， 而svg不依赖分辨率。

要搞明白这一点的区别，需要知道设么是位图（标量图），什么是矢量图。
- 什么是位图（标量图）

- 什么是矢量图
矢量图最大的特点是可以随意缩放，不论您如何改变矢量图像的大小，矢量图的质量是不会变的，因为矢量图完全由数学公式构成，图像大小不影响数学公式的表达。

eg：如果您画一个1cm * 1cm的图形，然后把它按比例放大100，您就会得到一个100cm * 100cm的图像，它看起来会完全一样，图片的质量是不会损失的。您只是告诉计算机在不同的点之间画一条线，这就形成了构成矢量图的数学公式。

位图（标量图）指一个特定大小的图像。如果您放大一个位图，它会变得“像素化”并且失去之前的清晰度。这是因为位图本质上是由一组组正方形组成的。

2、不支持事件处理器。canvas里的每个图形是不支持原生的时间处理器；而svg实际上基于XML的，意味着 SVG DOM 中的每个元素都是可用的，所以svg是支持原生的事件处理。

3、canvas能够以 .png 或 .jpg 格式保存结果图像。

4、canvas适合图像密集型的游戏，其中的许多对象会被频繁重绘。svg适合带有大型渲染区域的应用程序（比如谷歌地图），但不适合游戏应用，由于svg每个图形实际上是一个个的XML标签，所以复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）。

这里我们用一个示例来测试svg和canvas的性能（设备不同，结果会有所差异）

我们在页面中增加500个动态的svg图片，通过stats.js来监控页面的fps

```javascript
// 添加监控stats
import './index.less'
import Stats from 'stats.js'

let stats = new Stats()
stats.showPanel( 0 ) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom )
function animate() {
	stats.begin()
	stats.end()
	requestAnimationFrame( animate )

}
requestAnimationFrame(animate)

// 添加500个动态svg
let  svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 24 24" style="enable-background:new 0 0 50 50" xml:space="preserve">
<rect x="0" y="0" width="4" height="7" fill="#FF6700" transform="scale(1 1.94336)">
    <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0s" dur="0.6s" repeatCount="indefinite"></animateTransform>
</rect>
<rect x="10" y="0" width="4" height="7" fill="#FF6700" transform="scale(1 2.72331)">
    <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animateTransform>
</rect>
<rect x="20" y="0" width="4" height="7" fill="#FF6700" transform="scale(1 1.38997)">
    <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animateTransform>
</rect>
</svg>`

let svgs = ''
for (let i = 0; i < 1000; i++) {
  svgs += svg
}

let div = document.createElement('div')
div.innerHTML = svgs

document.body.appendChild(div)
```

![avatar](/html/image/svg.png)

通过观测，可以看到添加1000个动态svg，此时页面的fps为12fps左右

此时让我们在canvas中创建1000个图形动画

```javascript
const canvas = document.createElement('canvas')
canvas.width = 1000
canvas.height = 3000

let context = canvas.getContext('2d'), speed = 0.1;

//绘制白色外圈
function whiteCircle(centerX, centerY){
  context.save();
  context.beginPath();
  context.strokeStyle = "#A5DEF1";
  context.lineWidth = 12;
  context.arc(centerX, centerY, 30 , 0, Math.PI*2, false);
  context.stroke();
  context.closePath();
  context.restore();
}

//百分比文字绘制
function text(n, centerX, centerY){
  context.save();
  context.fillStyle = "#F47C7C";
  context.font = "20px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(n.toFixed(0)+"%", centerX, centerY);
  context.restore();
}

//动画循环
(function drawFrame(){
  window.requestAnimationFrame(drawFrame, canvas);
  context.clearRect(0, 0, canvas.width, canvas.height);

  for(let i = 0; i < 1000; i++) {
    let clientX = i % 10 * 100
    let clientY = Math.floor((i + 10) / 10 * 60)
    whiteCircle(clientX, clientY);
    text(speed, clientX, clientY)
  }

  if(speed > 100) speed = 0;
  speed += 0.1;
}());


document.body.appendChild(canvas)
```
![avatar](/html/image/canvas.png)

通过观测，可以看到在canvas中添加1000个动态图形，此时页面的fps为37fps左右

[完整代码]](https://github.com/xwwei/canvas-svg)

下面是别人测试的结果，我在测试的过程中，fps要比这个结果差挺多，可能与我测试方法和设备有问题：
![avatar](/html/image/test-canvas.png)
![avatar](/html/image/test-svg.png)


怎么去优化canvas的渲染（待写测试示例）：

1、优化canvas 指令
- 根据顶点来绘制图形，顶点多，绘制指令也会多，可以通过减少顶点（切换图形方法）来优化指令

2、使用缓存
- 离屏canvas：offscreen canvas，绘制时将绘图指令直接通过drawImage 来绘制，也不需要fill() 方法来填充图形

- 局限性：绘制图形状态非常多的话，需要创建大量的离屏canvas，内存消耗大，反而降低性能。适用于图形状态本身不变的图形元素，若经常发生改变，缓存就要一直更新，缓存更新本身也是绘图过程，并不能减少绘制指令，反而会因为增加 drawImage 指令而产生更大开销。通过缓存 drawImage 绘制的是位图，直接绘制的是矢量图，所以缓存绘制图形清晰度不是太好（fillText 渲染文字/绘制图形有较大缩放scale）

3、分层渲染（多个canvas）

- 局限性：大量静态图形不需要重新绘制，动态和静态元素绘制顺序是固定的

4、局部重绘

- canvas content clearReact 控制刷新动态区域

5、优化滤镜

6、多线程渲染
