# JavaScript相关

## 1、try/catch 无法捕获 promise.reject 的问题
try..catch 结构，它只能是同步的，无法用于异步代码模式。

```javascript
// 回调只会在未来的事件循环中执行。
function f2() {
  try {
    Promise.reject('出错了').catch(err => {
      console.log('2', err)
    });
    console.log('1')
  } catch (e) {
    console.log(e)
  }
}
```

## 2、error 事件的事件处理程序
https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror

## 3、怎么用onerror去监听图片的错误？
```javascript
<img src="..." onerror="noFind();" />
function noFind(event){
    var img = event.srcElement;
    img.src = '...'  // 默认图片地址
    img.onerror = null;  // 控制不要循环展示错误
}
```

## 4、实现一个bind
```javascript
Function.prototype.myBind = function(context) {
  let fn = this
  let args = Array.prototype.slice.call(arguments, 1)
  let fNop = function() {}
  let result = function() {
    let _args = args.concat([...arguments])
    fn.apply(this instanceof result ? this : context, _args)
  }
  fNop.prototype = this.prototype
  result.prototype = new fNop()
  return result
}
```

## 5、实现一个new
```javascript
function myNew() {
  let obj = new Object()
  let cor = Array.prototype.shift.call(arguments)
  obj.__proto__ = cor.prototype
  let res = cor.apply(obj, arguments)
  return typeof res === 'object' ? res : obj
}
```

## 6、实现一个call
```javascript
Function.prototype.myCall = function(ctx, args) {
  let context = ctx || window
  let fn = this
  context._fn = fn
  let res = context._fn(...(args || []))
  delete context._fn
  return res
}
```

## 7、实现一个apply
```javascript
Function.prototype.myApply = function(ctx, args) {
  let context = ctx || window
  let fn = this
  let res
  if(!args) {
    res = context._fn()
  } else {
    context._fn = fn
    res = context._fn(args)
  }
  delete context._fn
  return res
}
```

## 8、排序算法
![avatar](/interview/sort.png)
### 冒泡排序
```javascript
function sort(array) {
  let result = array.slice(0)
  for(let i = 0; i < array.length; i++) {
    for(let j = result.length - 1; j > i; j--) {
      if(result[j] < result[j-1]){
        let temp = result[j-1]
        result[j-1] = result[j]
        result[j] = temp
      }
    }
  }
  return result
}

// 改进后的算法
function sort(array) {
  let result = array.slice(0)
  for(let i = 0; i < array.length; i++) {
    let flag = true
    for(let j = result.length - 1; j > i; j--) {
      if(result[j] < result[j-1]){
        let temp = result[j-1]
        result[j-1] = result[j]
        result[j] = temp
        flag = false
      }
    }
    if (flag) {
      return result
    }
  }
  return result
}
```

### 选择排序
```javascript
function sort(array) {
  let minIndex = 0
  for(let i = 0; i < array.length; i++) {
    for(let j = i + 1; j < array.length; j++) {
      if (array[minIndex] > array[j]) {
        minIndex = j
      }
    }
    let temp = array[i]
    array[i] = array[minIndex]
    array[minIndex] = temp
  }
  return array
}
```

### 插入排序
```javascript
function sort(array) {
  let preIndex, current
  let result = array.slice(0)
  for (let i = 1; i < array.length; i++) {
    preIndex = i - 1;
    current = result[i]
    while(preIndex >= 0 && current < result[preIndex]) {
      result[preIndex + 1] = result[preIndex]
      preIndex--
    }
    result[preIndex + 1] = current
  }
  return result
}
```

### 希尔排序
```javascript
function sort(array) {
  let len = array.length
  let gap = 1
  while(gap < len / 3) {
    gap = gap * 3 + 1
  }
  for (gap; gap > 0; gap = Math.floor(gap / 3)) {
    for (let i = gap; i < len; i++) {
      let temp = array[i]
      let j = i - gap
      for (j; j >= 0 && array[j] > temp; j -= gap) {
        array[j+gap] = array[j]
      }
      array[j+gap] = temp
    }
  }
  return array
}
```

### 归并排序
```javascript
function sort(array) {
  let len = array.length
  if (len < 2) return array
  let mid = Math.floor(len / 2)
  let left = sort(array.slice(0, mid))
  let right = sort(array.slice(mid))
  return merge(sort(left), sort(right))
}

function merge(left, right) {
  let result = []
  while(left.length && right.length) {
    if (left[0] > right[0]) {
      result.push(right.shift())
    } else {
      result.push(left.shift())
    }
  }
  while (left.length) {
    result.push(left.shift())
  }
  while(right.length) {
    result.push(right.shift())
  }
  return result
}
```

### 快速排序
```javascript
// 方式一
function quickSort(arr, left, right) {
  let len = arr.length,
      partitionIndex,
      left = typeof left !== 'number' ? 0 : left,
      right = typeof right !== 'number' ? len - 1 : right;

  if (left < right) {
    partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
}

function partition(arr, left ,right) {
  let pivot = left,
      index = pivot + 1;
  for (let i = index; i <= right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(arr, i, index);
      index++;
    }
  }
  swap(arr, pivot, index - 1);
  return index - 1;
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// 方式二
function sort(array) {
  let result = array.slice(0)
  let quickSort = (arr) => {
    if (arr.length <= 1) return arr
    let pivot = arr.splice(Math.floor(arr.length / 2), 1)[0]
    let left = []
    let right = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < pivot) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }
    return quickSort(left).concat([pivot], quickSort(right))
  }
  result = quickSort(result)
  return result
}
```

### 模拟实现for of
所谓迭代器，其实就是一个具有 next() 方法的对象，每次调用 next() 都会返回一个结果对象，该结果对象有两个属性，value 表示当前的值，done 表示遍历是否结束。

那什么才是可遍历的呢？

其实一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，一个数据结构只要具有 Symbol.iterator 属性，就可以认为是"可遍历的"（iterable）。

eg:
```javascript
const obj = {
    value: 1
};

for (value of obj) {
  console.log(value);
}

// TypeError: iterator is not iterable

function createIterator(items) {
  var i = 0;
  return {
    next: function() {
      let done = i >= item.length;
      let value = !done ? items[i++] : undefined;

      return {
        done: done,
        value: value
      };
    }
  };
}

const obj = {
  value: 1
};

obj[Symbol.iterator] = function() {
  return createIterator([1, 2, 3]);
};

for (value of obj) {
  console.log(value);
}

// 1
// 2
// 3

```
```javascript
// 模拟实现一个forof
function forof(obj, cb) {
  let result, iterable
  if (typeof obj[Symbol.iterator] !== 'function') {
    throw new TypeError('not iterable')
  }
  if (typeof cb !== 'function') {
    throw new TypeError('callback not a function')
  }
  iterable = obj[Symbol.iterator]
  result = iterable.next()

  while(!result.done) {
    cb(result.value)
    result = iterable.next()
  }
}
```

而且每个集合类型都有一个默认的迭代器，在 for-of 循环中，如果没有显式指定则使用默认的迭代器。数组和 Set 集合的默认迭代器是 values() 方法，Map 集合的默认迭代器是 entries() 方法。

### 如何中断一个请求

XMLHttpRequest.abort()方法将终止该请求，当一个请求被终止，它的readyState将被置为XMLHttpRequest.UNSENT(0)，并且请求的status置为0。

Fetch是H5新添加的功能，在低版本是不支持的，比如： ie。为了中断Fetch请求跟随出现了AbortController一个控制器对象，允许你根据需要中止一个或者多个web请求。

```javascript
// 1. 创建 abortController 对象
const abortControllerObj = new AbortController()
​
// 2. 创建信号源
const signal = abortControllerObj.signal
​
// 3. 使用
const request = async () => {
  try {
    const ret = await fetch('/api/task/list', { signal })
    return ret
  } catch (error) {
    console.log(error)
  }
}
```

### 惰性加载

```javascript
function query(selector) {
  return Array.from(document.querySelectorAll(selector))
}

var observer = new IntersectionObserver(
  function(changes) {
    changes.forEach(function(change) {
      var container = change.target
      var content = container.querySelector('template').content
      container.appendChild(content)
      observer.unobserve(container)
    });
  }
);

query('.lazy-loaded').forEach(function (item) {
  observer.observe(item)
});
```

### 无限滚动

```javascript
var intersectionObserver = new IntersectionObserver(
  function (entries) {
    // 如果不可见，就返回
    if (entries[0].intersectionRatio <= 0) return;
    loadItems(10);
    console.log('Loaded new items');
  });

// 开始观察
intersectionObserver.observe(
  document.querySelector('.scrollerFooter')
);
```