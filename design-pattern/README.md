# js设计模式
本仓库的内容大部分基于曾探大佬的《JavaScript设计模式与开发实践》，本仓库更像是笔记内容；

## 1、单例模式
单例模式是一种十分常用但却相对而言比较简单的模式。它是指在一个类只能有一个实例，即使多次实例化该类，也只返回第一次实例化后的实例对象。单例模式不仅能减少不必要的内存开销, 并且在减少全局的函数和变量冲突也具有重要的意义。

### 简单的单例模式
```
let tool = {
  name: '工具类',
  sleep: function() {},
  uuid: function() {}
}
```

### 惰性单例模式
惰性单例指的是在需要的时候才创建对象实例
```
let inertiaTool = (function() {
  let _instance = null
  function init () {
    this.name = '工具类',
    this.sleep = () => {
      //...
    }
    this.uuid = () => {
      // ...
    }
    return function() {
      if (!_instance) {
        _instance = new init()
      }
      return _instance
    }
  }
})()
```

es6创建单例模式的一种方式
```
class es6Tool {
  constructor(name) {
    this.name = name
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new es6Tool(name)
    }
    return this.instance
  }

  sleep() {
    // ...
  }

  uuid() {
    // ...
  }
}
```

## 2、策略模式
定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换。在实际开发中，我们通常把算法的含义扩散开来，是策略模式也可以用来封装一系列的”业务规则“。只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式来封装它们。
```
let fnA = function(val) {
    return val * 1
}

let fnB = function(val) {
    return val * 2
}

let fnC = function (val) {
    return val * 3
}


let calculate = function(fn, val) {
    return fn(val)
}

console.log(calculate(fnA, 100)) // 100
console.log(calculate(fnB, 100)) // 200
console.log(calculate(fnC, 100)) // 300
```

## 3、代理模式
代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。
```
let flower = function() {}
let A = {
  sendFlower = function(target){
    let f = new flower()
    target.receiveFlower( f )
  }
}

let B = {
  receiveFlower: function(flower) {
    C.receiveFlower(flower)
  }
}

let C = {
  receiveFlower: function(flower) {
    console.log('收到花', flower)
  }
}
```
#### 名词解释：保护代理和虚拟代理
保护代理用户控制不同权限的对象对目标对象的访问.
```
let flower = function() {}
let A = {
  sendFlower = function(target){
    let f = new flower()
    target.receiveFlower( f )
  }
}

let B = {
  // ... 在这里做一些保护代理的操作，例如判断条件
  receiveFlower: function(flower) {
    C.receiveFlower(flower)
  }
}

let C = {
  receiveFlower: function(flower) {
    console.log('收到花', flower)
  }
}
```
但在JavaScript中并不容易实现保护代理，因为我们无法判断谁访问了某个对象。而虚拟代理是最常用的一种的代理模式，虚拟代理是代理模式的另一种形式。

场景：图片预加载，如果直接给某个img标签节点设置src属性，由于图片过大或者网络不佳，图片的位置会有一段时间是空白，常见的做法是用loading图片占位，然后用异步的方式加载图片，等图片加载好后在填充到img节点中，这种场景就很适合使用虚拟代理。
```
class MyImage {
  constructor() {
    this.img = new Image()
    document.body.appendChild(this.img)
  }
  setSrc(src) {
    this.img.src = src
  }
}

class ProxyImage {
  constructor() {
    this.proxyImage = new Image()
  }

  setSrc(src) {
    let myImageObj = new MyImage()
    myImageObj.img.src = 'file://xxx.png'  //为本地图片url
    this.proxyImage.src = src
    this.proxyImage.onload = function() {
      myImageObj.img.src = src
    }
  }
}

let proxyImage = new ProxyImage()
proxyImage.setSrc('http://xxx.png') //服务器资源url
```

#### 名词解释：缓存代理
缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的数跟之前的一致，则可以直接返回前面存储的运算结果。
例如在vue中的缓存函数
```
function cached(fn) {
  let cache = Object.create(null)
  return (function cachedFn(str) {
    let hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}

// 横线-的转换成驼峰写法
let camelizeRE = /-(\w)/g;
let camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : ''
  })
})
```

## 4、迭代器模式
迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露改对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按照顺序访问其中的每个元素。目前大部分语言已经有了内置的迭代器的实现。

迭代器的实现可参考[https://github.com/mqyqingfeng/Blog/issues/40]

## 5、发布-订阅模式
发布-订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知。在JavaScript开发中，我们一般用事件模型来替代传统的发布-订阅模式。Dom事件就是一个发布订阅模式的例子。

一个简单通用的发布-订阅模式
```
class Event {
  handlers = {}

  addEventListener(type, handler) {
    if (!(type in this.handlers)) {
      this.handlers[type] = []
    }
    this.handlers[type].push(handler)
  }

  dispatchEvent(type, ...params) {
    if (!(type in this.handlers)) {
      return new Error('未注册该事件')
    }
    this.handlers[type].forEach(fn => {
      fn.apply(this, ...params)
    })
  }

  removeEvent(type, handler) {
    if (!(type in this.handlers)) {
      return new Error('无效事件')
    }
    if (!handler) {
      return delete this.handlers[type]
    }
    const idx = this.handlers[type].findIndex(r = r === handler)
    if (idx === -1) {
      return new Error('无该绑定事件')
    }
    this.handlers[type].splice(idx, 1)
    if (this.handlers[type].length === 0) {
      delete this.handlers[type]
    }
  }
}
```

## 命令模式
命令模式（Command Pattern）是一种数据驱动的设计模式，它属于行为型模式。请求以命令的形式包裹在对象中，并传给调用对象。调用对象寻找可以处理该命令的合适的对象，并把该命令传给相应的对象，该对象执行命令。命令模式的由来其实是回调函数的一个面向对象的替代品。

在命令的发布者和接收者之间，定义一个命令对象，命令对象暴露出一个统一的接口给命令的发布者，而命令的发布者不用去管接收者是如何执行命令的，做到命令发布者和接收者的解耦。

```
<button id="btn1"></button>
<button id="btn2"></button>
<button id="btn3"></button>

<script>
  let btn1 = document.getElementById('btn1')
  let btn2 = document.getElementById('btn2')
  let btn3 = document.getElementById('btn3')

  // 定义一个命令发布者（执行者）的类
  class Executor {
    setCommand(btn, command) {
      btn.onclick = function() {
        command.execute()
      }
    }
  }

  // 定义一个命令接受者
  class Menu {
    refesh() {
      console.log('刷新')
    }
  }

  // 定义一个刷新菜单的命令对象类
  class RefreshMenu {
    constructor(receiver) {
      this.receiver = receiver
    }

    execute() {
      this.receiver.refresh()
    }
  }

  let executor = new Executor()
  let menu = new Menu()
  let refreshMenu = new RefreshMenu(menu)

  executor.setCommand(btn1, refreshMenu)
</script>
```