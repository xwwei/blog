# html相关面试题
## 1、为什么利用多个域名来存储网站资源会更有效 ？
- 优化页面响应速度，确保用户在不同地区能用最快的速度打开网站，其中某个域名崩溃用户也能通过其他域名访问网站。
- CDN 缓存更方便。简单来说，CDN主要用来使用户就近获取资源。
- 突破浏览器并发限制。同一时间针对同一域名下的请求有一定数量限制，超过限制数目的请求会被阻塞。大多数浏览器的并发数量都控制在6以内。有些资源的请求时间很长，因而会阻塞其他资源的请求。因此，对于一些静态资源，如果放到不同的域名下面就能实现与其他资源的并发请求。
- Cookieless, 节省带宽，尤其是上行带宽 一般比下行要慢。
- 对于 UGC 的内容和主站隔离，防止不必要的安全问题，例如cookie的隔离 客户端对服务器进行请求时，发送数据到达的地址会用一个第三方的域名。防止上传恶意数据对cookie进行窃取。。
- 数据做了划分，甚至切到了不同的物理集群，通过子域名来分流比较省事. 这个可能被用的不多。

## 2、querySelector和getElementById方法的区别
- querySelector()是用于接收一个CSS选择符，返回与该模式匹配的第一个元素；querySelectorAll()用于选择匹配到的所有元素。按文档顺序返回指定元素节点的子树中匹配选择器的元素集合（NodeList），如果没有匹配返回空集合。
- getElementsByTagName()该方法返回一个对象数组（是HTMLCollection集合），返回元素的顺序是它们在文档中的顺序,传递给 getElementsByTagName() 方法的字符串可以不区分大小写。
- getElementsByClassName()该方法来获取指定class名的元素,该方法返回文档中所有指定类名的元素集合，作为 NodeList 对象。NodeList 对象代表一个有顺序的节点列表。NodeList 对象 我们可通过节点列表中的节点索引号来访问列表中的节点(索引号由0开始), 所以有时使用时要指定下标。

### 区别
一般说的都是getElement(s)Byxxxx获取的是动态集合，querySelector获取的是静态集合。看下面示例就明白了；

```html
<ul>
  <li>111</li>
  <li>222</li>
  <li>333</li>
</ul>
```
```javascript
// 采用querySelectorAll
var ul = document.querySelector('ul');
var list = ul.querySelectorAll('li');
for(var i=0;i<list.length;i++){
    ul.appendChild(document.createElement('li'));
}
//这个时候就创建了3个新的li，添加在ul列表上。
console.log(list.length) //输出的结果仍然是3，不是此时li的数量6

// 采用getElementsByTagName
var ul=document.getElementsByTagName('ul')[0];
var list=ul.getElementsByTagName('li');
for(var i=0;i<5;i++){
    ul.appendChild(document.createElement('li'));
}
console.log(list.length)//此时输出的结果就是3+5=8
```
## 3、HTML中src和href的区别
- src(Source)是指向物件的来源地址，是引入，在 img、script、iframe 等元素上使用； href(Hypertext Reference)是超文本引用，指向需要连结的地方，是与该页面有关联的，是引用，在link和a等元素上使用。src通常用作“拿取”（引入），href 用作 "连结前往"（引用）。
- 可替换的元素上使用src，src属性仅仅嵌入当前资源到当前文档元素定义的位置。href用于在涉及的文档和外部资源之间建立一个关系。 href指定网络资源的位置，从而在当前元素或者当前文档和由当前属性定义的需要的锚点或资源之间定义一个链接或者关系。
- 在请求src资源时会将其指向的资源下载并应用到文档内，例如js脚本，img图片和frame等元素。当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js脚本放在底部而不是头部。但是当浏览器解析到href资源时，会识别该文档为css文件，会下载并且不会停止对当前文档的处理

## 4、讲述你对 reflow 和 repaint 的理解
通常（页面）都需要至少一次layout（回流）和一次重绘（除非，你的页面是空的：））。之后，改变渲染树都会导致以下一种或两种事情发生：
- 需要重新验证渲染树（部分或整个）以及重新计算节点尺寸。这就是回流。注意一定会有一次回流发生-页面的初始布局
- 页面的部分需要更新，一个节点的几何属性发生变化，又或是样式的变化（比如更改了background color），这个更新就叫做重绘。

### Repaint（重绘）
顾名思义，重绘只不过是屏幕上重新绘制元素，因为元素更改的外观会影响元素的可见性，但不会影响布局。 比如下面几个将会触发重绘：
- 更改元素的可见性（visibility，opacity应该也算 ）
- 更改元素的边框
- 更改元素的背景

### Reflow（回流）
回流是重新计算文档中元素的位置和几何形状，以便重新显示文档的部分或全部。因为回流会阻止用户操作，所以开发者有必要知道怎样优化回流时间，了解各种文档属性（DOM深度，CSS效率，不同类型的样式更改）对回流时间的影响。有时候回流单个元素可能会导致它的父元素们以及它其后的所有元素的回流

在性能优先的前提下，性能消耗 reflow 大于 repaint。

如何避免：

- 尽可能在 DOM 末梢通过改变 class 来修改元素的 style 属性：尽可能的减少受影响的 DOM 元素。
- 避免设置多项内联样式：使用常用的 class 的方式进行设置样式，以避免设置样式时访问 DOM 的低效率。
- 设置动画元素 position 属性为 fixed 或者 absolute：由于当前元素从 DOM 流中独立出来，因此受影响的只有当前元素，元素 repaint。
- 牺牲平滑度满足性能：动画精度太强，会造成更多次的 repaint/reflow，牺牲精度，能满足性能的损耗，获取性能和平滑度的平衡。
- 避免使用 table 进行布局：table 的每个元素的大小以及内容的改动，都会导致整个 table 进行重新计算，造成大幅度的 repaint 或者 reflow。改用 div 则可以进行针对性的 repaint 和避免不必要的 reflow。
- 避免在 CSS 中使用运算式：学习 CSS 的时候就知道，这个应该避免，不应该加深到这一层再去了解，因为这个的后果确实非常严重，一旦存在动画性的 repaint/reflow，那么每一帧动画都会进行计算，性能消耗不容小觑。

## 5、Doctype 作用 ？标准模式与兼容模式各有什么区别 ?

声明位于位于 HTML 文档中的第一行，处于 标签之前。告知浏览器的解析器用什么文档标准解析这个文档。DOCTYPE 不存在或格式不正确会导致文档以兼容模式呈现。

标准模式的排版和 JS 运作模式都是以该浏览器支持的最高标准运行。在兼容模式中，页面以宽松的向后兼容的方式显示，模拟老式浏览器的行为以防止站点无法工作。

HTML4.01的doctype

在HTML4.01中，<!DOCTYPE>声明引用DTD，因为HTML4.01基于SGML。DTD规定了标记语言的规则，这样浏览器才能正确的呈现内容。在HTML4.01中有三种<!DOCTYPE>声明。
```html
<!-- 严格模式 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"  "http://www.w3.org/TR/html4/strict.dtd">
<!-- 过渡模式 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"  "http://www.w3.org/TR/html4/loose.dtd">
<!-- 框架模式 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN"  "http://www.w3.org/TR/html4/frameset.dtd">
```
HTML5的doctype

HTML5不基于SGML，所以不需要引用DTD。在HTML5中<!DOCTYPE>只有一种
```html
<！DOCTYPE html>
```

## 6、HTML5 有哪些新特性、移除了那些元素 ？如何处理 HTML5 新标签的浏览器兼容问题 ？如何区分 HTML 和 HTML5 ？
HTML5 现在已经不是 SGML（标准通用标记语言）的子集，主要是关于图像，位置，存储，多任务等功能的增加。
新特性
- 绘画 canvas;
- 用于媒介回放的 video 和 audio 元素;
- 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失;
- sessionStorage 的数据在浏览器关闭后自动删除;
- 语意化更好的内容元素，比如 article、footer、header、nav、section;
- 表单控件：calendar、date、time、email、url、search;
- 新的技术：webworker, websocket, Geolocation;

移除的元素
- 纯表现的元素：basefont，big，center，font, s，strike，tt，u;
- 对可用性产生负面影响的元素：frame，frameset，noframes；

支持 HTML5 新标签

- IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签，可以利用这一特性让这些浏览器支持 HTML5 新标签，浏览器支持新标签后，还需要添加标签默认的样式。
- 当然也可以直接使用成熟的框架、比如 html5shim;
```html
<!--[if lt IE 9]>
<script> src="http://html5shim.googlecode.com/svn/trunk/html5.js"</script>
<![endif]-->
```

## 7、简述一下你对 HTML 语义化的理解 ？
- html 语义化让页面的内容结构化，结构更清晰，
- 便于对浏览器、搜索引擎解析;
- 搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，利于 SEO;
- 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

## 8、HTML5-离线缓存（Application Cache）

manifest.appcache文件配置:
- CACHE MANIFEST放在第一行2)
- CACHE:表示需要离线存储的资源列表,由于包含manifest文件的页面将被自动离线存储,所以不需要列出来3)
- NETWORK:表示在线才能访问的资源列表,如果CACHE列表里也存在,则CACHE优先级更高4)
- FALLBACK:表示如果访问第一个资源是吧,那么使用第二个资源来替换它。
```
CACHE MANIFEST
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
//offline.html
```
该标准已经废弃!!!该标准已经废弃!!!该标准已经废弃!!!

## 9、请描述一下 cookies，sessionStorage 和 localStorage 的区别 ？
- cookie 是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）。
- cookie 数据始终在同源的 http 请求中携带（即使不需要），也会在浏览器和服务器间来回传递。
- sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。

存储大小
- cookie 数据大小不能超过 4k。
- sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。

有期时间
- localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
- sessionStorage 数据在当前浏览器窗口关闭后自动删除。
- cookie设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。

HttpOnly设置了后，JavaScript就无法读取到这个Cookie。
[关于cookie的详解](https://segmentfault.com/a/1190000004556040)

## 10、iframe 内嵌框架有那些缺点 ？

内联框架 iframe一般用来包含别的页面，例如 我们可以在我们自己的网站页面加载别人网站的内容，为了更好的效果，可能需要使 iframe 透明效果；
- iframe 会阻塞主页面的 onload 事件；
- 搜索引擎的检索程序无法解读这种页面，不利于 SEO 搜索引擎优化（Search Engine Optimization）
- iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。

如果需要使用 iframe，最好是通过 javascript 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题。

## 11、Label 的作用是什么？是怎么用的 ？
label 标签用来定义表单控制间的关系，当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。
```html
<label for="Name">Number:</label>
<input type=“text“ name="Name"  id="Name"/>
<label>Date:<input type="text" name="B"/></label>
```

## 12、HTML5 的 form 如何关闭自动完成功能 ？
给不想要提示的 form 或某个 input 设置为 autocomplete=off。

## 13、实现浏览器内多个标签页之间的通信
### 第一种方式：websocket协议
全双工的通信协议，不多介绍；

### 第二种方式：localstorage
localstorage是浏览器多个标签共用的存储空间，所以可以用来实现多标签之间的通信

这里补充一点其他的：session是会话级的存储空间，每个标签页都是单独的

使用方式：直接在window对象上添加监听，以下为例子：

标签页一：
```javascript
<input id="name">
<input type="button" id="btn" value="提交">
<script type="text/javascript">
  document.getElementByTagName('button)[0].click = () = >{
    localStorage.setItem("name", 'test');
  }
</script>
```

标签页二
```javascript
window.addEventListener("storage", function(event){
  console.log(event.key + "=" + event.newValue);
});
```
### 第三种方式：html5浏览器的新特性SharedWorker
首先在服务器上要有一个js，处理需要通信的数据。比如一个worker.js
```javascript
let data = ''
onconnect = function (e) {
  let port = e.ports[0]
  port.onmessage = function (e) {
    if (e.data === 'get') {       // 如果是get 则返回数据给客户端
      port.postMessage(data)
    } else {                      // 否则把数据保存
      data = e.data
    }
  }
}
```

A页面负责传递数据
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<button>点击</button>

<body>
  <script>
    if (typeof Worker === "undefined") {
      alert('当前浏览器不支持webworker')
    } else {
      let worker = new SharedWorker('worker.js')
      window.worker = worker
      let i = 0;
      document.querySelector('button').onclick = function() {
        window.worker.port.postMessage('发送信息给worker' + i++)
      }
    }
  </script>
</body>
</html>
```

B页面负责接收收据
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<button>获取</button>

<body>
  <script>
    if (typeof Worker === "undefined") {
      alert('当前浏览器不支持webworker')
    } else {
      let worker = new SharedWorker('worker.js')
      worker.port.addEventListener('message', (e) => {
          console.log('来自worker的数据：', e.data)
      }, false)
      worker.port.start()
      window.worker = worker
    }
    // 获取和发送消息都是调用postMessage方法，我这里约定的是传递'get'表示获取数据。
    document.querySelector('button').onclick = function() {
      window.worker.port.postMessage('get')
    }
  </script>
</body>
</html>
```

## 14、webworker与shareWorker的区别
WebWorker只属于某个页面，不会和其他页面的Render进程（浏览器内核进程）共享，所以Chrome在Render进程中（每一个Tab页就是一个render进程）创建一个新的线程来运行Worker中的JavaScript程序。

SharedWorker是浏览器所有页面共享的，不能采用与Worker同样的方式实现，因为它不隶属于某个Render进程，可以为多个Render进程共享使用，所以Chrome浏览器为SharedWorker单独创建一个进程来运行JavaScript程序，在浏览器中每个相同的JavaScript只存在一个SharedWorker进程，不管它被创建多少次。

看到这里，应该就很容易明白了，本质上就是进程和线程的区别。SharedWorker由独立的进程管理，WebWorker只是属于render进程下的一个线程

## 15、webSocket 如何兼容低浏览器 ？
- Adobe Flash Socket 、
- ActiveX HTMLFile (IE) 、
- 基于 multipart 编码发送 XHR 、
- 基于长轮询的 XHR。

## 16、页面可见性（Page Visibility API） 可以有哪些用途 ？
通过 visibilityState 的值检测页面当前是否可见，以及打开网页的时间等;

在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放；

Document.visibilityState （只读属性）, 返回document的可见性, 即当前可见元素的上下文环境. 由此可以知道当前文档(即为页面)是在背后, 或是不可见的隐藏的标签页，或者(正在)预渲染.可用的值如下：
- 'visible' : 此时页面内容至少是部分可见. 即此页面在前景标签页中，并且窗口没有最小化.
- 'hidden' : 此时页面对用户不可见. 即文档处于背景标签页或者窗口处于最小化状态，或者操作系统正处于 '锁屏状态' .
- 'prerender' : 页面此时正在渲染中, 因此是不可见的，文档只能从此状态开始，永远不能从其他值变为此状态.注意: 浏览器支持是可选的.

```javascript
document.addEventListener("visibilitychange", function() {
  console.log( document.visibilityState );.
});
```

## 17、谈谈以前端的角度出发，做好 SEO ，需要考虑什么 ？
- 了解搜索引擎如何抓取网页和如何索引网页。 你需要知道一些搜索引擎的基本工作原理，各个搜索引擎之间的区别，搜索机器人（SE robot 或叫 web cra何进行工作，搜索引擎如何对搜索结果进行排序等等。
- Meta 标签优化 主要包括主题（Title)，网站描述(Description)，和关键词（Keywords）。还有一些其它的隐藏文字比如 Au 者），Category（目录），Language（编码语种）等。
- 如何选取关键词并在网页中放置关键词。 搜索就得用关键词。关键词分析和选择是 SEO 最重要的工作之一。首先要给网站确定主关键词（一般在 5 个上后针对这些关键词进行优化，包括关键词密度（Density），相关度（Relavancy），突出性（Prominency）等等。
- 了解主要的搜索引擎。 虽然搜索引擎有很多，但是对网站流量起决定作用的就那么几个。比如英文的主要有 Google，Yahoo，Bing 等有百度，搜狗，有道等。 不同的搜索引擎对页面的抓取和索引、排序的规则都不一样。 还要了解各搜索门户和搜索的关系，比如 AOL 网页搜索用的是 Google 的搜索技术，MSN 用的是 Bing 的技术。
- 主要的互联网目录。 Open Directory 自身不是搜索引擎，而是一个大型的网站目录，他和搜索引擎的主要区别是网站内容的收集方目录是人工编辑的，主要收录网站主页；搜索引擎是自动收集的，除了主页外还抓取大量的内容页面。
- 按点击付费的搜索引擎。 搜索引擎也需要生存，随着互联网商务的越来越成熟，收费的搜索引擎也开始大行其道。最典型的有 Overture 当然也包括 Google 的广告项目 Google Adwords。越来越多的人通过搜索引擎的点击广告来定位商业网站，这里面化和排名的学问，你得学会用最少的广告投入获得最多的点击。
- 搜索引擎登录。 网站做完了以后，别躺在那里等着客人从天而降。要让别人找到你，最简单的办法就是将网站提交（submit）擎。如果你的是商业网站，主要的搜索引擎和目录都会要求你付费来获得收录（比如 Yahoo 要 299 美元），但是好消少到目前为止）最大的搜索引擎 Google 目前还是免费，而且它主宰着 60％ 以上的搜索市场。
- 链接交换和链接广泛度（Link Popularity）。 网页内容都是以超文本（Hypertext）的方式来互相链接的，网站之间也是如此。除了搜索引擎以外，人们也不同网站之间的链接来 Surfing（“冲浪”）。其它网站到你的网站的链接越多，你也就会获得更多的访问量。更重你的网站的外部链接数越多，会被搜索引擎认为它的重要性越大，从而给你更高的排名。
- 标签的合理使用

## 18、前端页面有哪三层构成，分别是什么？作用是什么？
网页分成三个层次，即：结构层、表示层、行为层。

- 网页的结构层（structurallayer）由 HTML 或 XHTML 之类的标记语言负责创建。 标签，也就是那些出现在尖括号里的单词，对网页内容的语义含义做出这些标签不包含任何关于如何显示有关内容的信息。例如，P 标签表达了这样一种语义：“这是一个文本段。”
- 网页的表示层（presentationlayer）由 CSS 负责创建。CSS 对“如何显示有关内容”的问题做出了回答。
- 网页的行为层（behaviorlayer）负责回答 “内容应该如何对事件做出反应” 这一问题。 这是 Javascript 语言和 DOM 主宰的领域。
