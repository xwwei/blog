# 常见的跨域解决方案

## 什么是跨域
在了解什么是跨域之前，我们需要先知道什么是同源策略：（来自百度百科）

同源策略：同源策略（Same origin policy）是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能都会受到影响。可以说Web是构建在同源策略基础之上的，浏览器只是针对同源策略的一种实现。源（origin）就是协议、域名和端口号，所谓同源（即指在同一个域）就是两个页面具有相同的协议（protocol），主机（host）和端口号（port）。
- 同源策略，它是由Netscape提出的一个著名的安全策略。
- 当一个浏览器的两个tab页中分别打开来 百度和谷歌的页面
- 当浏览器的百度tab页执行一个脚本的时候会检查这个脚本是属于哪个页面的，
- 即检查是否同源，只有和百度同源的脚本才会被执行。
- 如果非同源，那么在请求数据时，浏览器会在控制台中报一个异常，提示拒绝访问。
- 同源策略是浏览器的行为，是为了保护本地数据不被JavaScript代码获取回来的数据污染，因此拦截的是客户端发出的请求回来的数据接收，即请求发送了，服务器响应了，但是无法被浏览器接收。

由上，跨域就是指当一个请求url的协议、域名、端口三者之间任意一个与当前页面url不同即为跨域。

| 当前页面url | 被请求页面url | 是否跨域 | 原因 |
| :-----:| :----: | :----: | :----: |
| `http://www.test.com/` | `http://www.test.com/index.html`	| 否 | 同源（协议、域名、端口号相同）
| `http://www.test.com/` | `https://www.test.com/index.html` | 跨域	| 协议不同（http/https）
| `http://www.test.com/` | `http://www.baidu.com/` | 跨域	| 主域名不同（test/baidu）
| `http://www.test.com/` | `http://blog.test.com/` | 跨域	| 子域名不同（www/blog）
| `http://www.test.com:8080/`	| `http://www.test.com:7001/`	| 跨域 | 端口号不同（8080/7001）

## 常见跨域解决方案
- 通过jsonp跨域
- document.domain + iframe跨域
- `window.name` + iframe跨域
- location.hash + iframe
- postMessage跨域
- 跨域资源共享（CORS）
- nginx代理跨域
- nodejs中间件代理跨域
- WebSocket协议跨域

### 通过jsonp跨域
JSONP不是一门语言，也并不是什么特别开发的技术，它更像是一个BUG，一个开发者找出来可以用来作为跨域传输数据的”漏洞”。JSONP的原理非常简单，就是HTML标签中，很多带src属性的标签都可以跨域请求内容，比如我们熟悉的img图片标签。同理，script标签也可以，可以利用script标签来执行跨域的javascript代码。通过这些代码，我们就能实现前端跨域请求数据。（需要服务端配合）
缺点是只能实现get一种请求

```javascript
let script = document.createElement('script');
script.type = 'text/javascript';
// src 带上服务端返回的callback参数
script.src = '(domain)/login?user=admin&callback=handleCallback';
document.head.appendChild(script);

// 回调执行函数
function handleCallback(res) {
  alert(res);
}

// 需要服务端返回数据格式示例
handleCallback({"status": true, "user": "admin"})
```

### document.domain + iframe跨域
此方案仅限主域相同，子域不同的跨域应用场景。实现原理把两个页面的document.domain都指向主域就可以了，比如document.domain='test.com';。
设置好后父页面和子页面就可以像同一个域下两个页面之间访问了。父页面通过ifr.contentWindow就可以访问子页面的window，子页面通过parent.window或parent访问父页面的window，接下来可以进一步获取dom和js。

```javascript
// 父页面 http://www.domain.com/1.html
<iframe id="iframe" src="http://child.domain.com/2.html"></iframe>
<script>
  document.domain = 'domain.com';
  let user = 'admin';
  // 调用子页面方法
  let iframe = document.getElementById('iframe')
  iframe.onload = () => {
    let content = iframe.contentWindow
    console.log(content.demo)
  }
</script>

// 子页面 http://child.domain.com/2.html
<script>
  document.domain = 'domain.com''
	let demo = 'demo'
	alert('get js data from parent ---> ' + window.parent.user);
</script>
```

### `window.name` + iframe跨域
只要不关闭浏览器，window.name可以在不同页面加载后依然保持。尝试在浏览器打开百度baidu.com，然后在控制台输入window.name='aaa';回车，接着在地址栏输入qq.com转到腾讯首页，打开控制台输入window.name查看它的值，可以看到输出了"aaa"。window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

```javascript
// a.html (http://www.domain1.com/a.html)
let proxy = function(url, callback) {
    let state = 0;
    let iframe = document.createElement('iframe');
    // 加载跨域页面
    iframe.src = url;
    // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
    iframe.onload = function() {
      if (state === 1) {
        // 第2次onload(同域proxy页)成功后，读取同域window.name中数据
        callback(iframe.contentWindow.name);
        destoryFrame();

      } else if (state === 0) {
        // 第1次onload(跨域页)成功后，切换到同域代理页面
        iframe.contentWindow.location = 'http://www.domain1.com/proxy.html';
        state = 1;
      }
    };
    document.body.appendChild(iframe);
    function destoryFrame() {
      iframe.contentWindow.document.write('');
      iframe.contentWindow.close();
      document.body.removeChild(iframe);
    }
};

// 请求跨域b页面数据
proxy('http://www.domain2.com/b.html', function(data){
  alert(data);
});

// proxy.html：(http://www.domain1.com/proxy.html 中间代理页，与a.html同域，内容为空即可。

// b.html：(http://www.domain2.com/b.html)
window.name = 'This is domain2 data!';
```

### `location.hash` + iframe
location.hash其实就是url的锚点。比如http://www.test.cn#test的网址打开后，在控制台输入location.hash就会返回#test的字段
ocation.hash和window.name都是差不多的，都是利用全局对象属性的方法，然后这两种方法和jsonp也是一样的，就是只能够实现get请求

```javascript
// a.html a和c页面同域
<iframe id="iframe" src="http://localhost:9001/b.html"></iframe>
<script>
  let iframe = document.getElementById('iframe');

  // 向b.html传hash值
  setTimeout(function() {
    iframe.src = iframe.src + '#user=admin';
  }, 1000);

  // 开放给同域c.html的回调方法
  function onCallback(res) {
    alert('data from c.html ---> ' + res);
  }
</script>

// b.html
<iframe id="iframe" src="http://localhost:9000/c.html"></iframe>
<script>
  let iframe = document.getElementById('iframe');

  // 监听a.html传来的hash值，再传给c.html
  window.onhashchange = function () {
    iframe.src = iframe.src + location.hash;
  }
</script>

// c.html
<script>
  // 监听b.html传来的hash值
  window.onhashchange = function () {
    console.log(location.hash, window.parent.parent)
    // 再通过操作同域a.html的js回调，将结果传回
    window.parent.parent.onCallback('hello: ' + location.hash.replace('#user=', ''));
  }
</script>
```

### postMessage跨域
postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：
a.）页面和其打开的新窗口的数据传递
b.）多窗口之间消息传递
c.）页面与嵌套的iframe消息传递
d.）上面三个场景的跨域数据传递

发送信息的postMessage方法是向外界窗口发送信息
```javascript
otherWindow.postMessage(message,targetOrigin);
// otherWindow: 其他窗口的一个引用，比如iframe的contentWindow属性、执行window.open返回的窗口对象、或者是命名过或数值索引的window.frames。
```

postMessage(message, origin, transfer?)

message html5规范支持任意基本类型或可复制的对象，但部分浏览器只支持字符串，所以传参时最好用JSON.stringify()序列化。

origin：限定消息接受范围，不限制就用星号 *，协议+主机+端口号，表示可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。

transfer 可选  是一串和message 同时传递的 [Transferable](https://developer.mozilla.org/zh-CN/docs/Web/API/Transferable) 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权

接受信息的message事件
```javascript
let onmessage = function(event) {
  let data = event.data;
  let origin = event.origin;
}

if(typeof window.addEventListener != 'undefined'){
  window.addEventListener('message',onmessage,false);
}else if(typeof window.attachEvent != 'undefined'){
  window.attachEvent('onmessage', onmessage);
}
```

举个例子
```javascript
// a.html
<iframe id="iframe" src="http://localhost:9001/index.html" ></iframe>
<script type="text/javascript">
  let iframe = document.getElementById('iframe')
  iframe.onload = () =>{
    let data = {
      name: 'aym'
    }

    iframe.contentWindow.postMessage(JSON.stringify(data), 'http://localhost:9001')
  }

  window.addEventListener('message', function(e) {
    console.log("------------")
  })
</script>

// b.html
window.addEventListener('message', function(e) {
  alert('data from nealyang ---> ' + e.data);
  let data = JSON.parse(e.data);
  if (data) {
      data.number = ;

      // 处理后再发回a.html
      window.parent.postMessage(JSON.stringify(data), 'http://localhost:9000');
  }
}, false);
```

### 待补充

参考

[常见跨域解决方案](https://segmentfault.com/a/1190000011145364)

[正确面对跨域，别慌](https://juejin.cn/post/6844903521163182088#comment)