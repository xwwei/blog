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
- WebSocket协议跨域
- nginx代理跨域
- nodejs中间件代理跨域

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

### 跨域资源共享（CORS）
CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。

CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。IE8+：IE8/9需要使用XDomainRequest对象来支持CORS。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。
因此，实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。

#### 两种请求
分为两种请求，一种是简单请求，另一种是非简单请求。为什么要分为简单请求和非简单请求，因为浏览器对这两种请求方式的处理方式是不同的。只要满足下面条件就是简单请求
- 请求方式为HEAD、POST 或者 GET
- http头信息不超出以下字段：Accept、Accept-Language 、 Content-Language、 Last-Event-ID、 Content-Type(限于三个值：application/x-www-form-urlencoded、multipart/form-data、text/plain)

##### 简单请求
对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个Origin字段。 下面是一个例子，浏览器发现这次跨源AJAX请求是简单请求，就自动在头信息之中，添加一个Origin字段。
```
GET /cors HTTP/1.1
Origin: http://xxx.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
...
```
Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求.如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段（详见下文），就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。

但是，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。

如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```
Access-Control-Allow-Origin: http://xxx.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

- Access-Control-Allow-Origin :该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求
- Access-Control-Allow-Credentials: 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。
- Access-Control-Expose-Headers:该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。

withCredentials 属性
CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发到服务器，一方面要服务器同意，指定Access-Control-Allow-Credentials字段。
另一方面，开发者必须在AJAX请求中打开withCredentials属性。

但是，如果省略withCredentials设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭withCredentials。

```javascript
var xhr = new XMLHttpRequest(); // IE8/9需用window.XDomainRequest兼容

// 前端设置是否带cookie
xhr.withCredentials = true;

xhr.open('post', 'http://www.domain2.com:8080/login', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('user=admin');

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
};

// jquery
$.ajax({
    ...
   xhrFields: {
       withCredentials: true    // 前端设置是否带cookie
   },
   crossDomain: true,   // 会让请求头中包含跨域的额外信息，但不会含cookie
    ...
})
```
需要注意的是，如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的document.cookie也无法读取服务器域名下的Cookie。

##### 非简单请求
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。例：
```javascript
var url = 'http://xxx.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```
浏览器发现，这是一个非简单请求，就自动发出一个"预检"请求，要求服务器确认可以这样请求。下面是这个"预检"请求的HTTP头信息。
```
OPTIONS /cors HTTP/1.1
Origin: http://xxx.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```
"预检"请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是Origin，表示请求来自哪个源。除了Origin字段，"预检"请求的头信息包括两个特殊字段。
- Access-Control-Request-Method：该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是PUT。
- Access-Control-Request-Headers：该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是X-Custom-Header

预检请求的回应

服务器收到"预检"请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://xxx.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```
上面的HTTP回应中，关键的是Access-Control-Allow-Origin字段，表示`http://xxx.com`可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。如果浏览器否定了"预检"请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被XMLHttpRequest对象的onerror回调函数捕获。控制台会打印出如下的报错信息。
- Access-Control-Allow-Methods：该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
- Access-Control-Allow-Headers：如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
- Access-Control-Allow-Credentials： 该字段与简单请求时的含义相同。
- Access-Control-Max-Age： 该字段可选，用来指定本次预检请求的有效期，单位为秒。

一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个Origin头信息字段。服务器的回应，也都会有一个Access-Control-Allow-Origin头信息字段。

### WebSocket协议跨域
WebSocket protocol是HTML5一种新的协议。它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是server push技术的一种很好的实现。

（待补充示例）

- nginx代理跨域（待补充）
- nodejs中间件代理跨域（待补充)


参考

[常见跨域解决方案](https://segmentfault.com/a/1190000011145364)

[正确面对跨域，别慌](https://juejin.cn/post/6844903521163182088#comment)