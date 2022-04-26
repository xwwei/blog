// 随机乱序数组
let arr = [1,2,3,4, 5]

function randomSort(arr) {
    return arr.sort(() => Math.random() - 0.5)
}
// console.log(randomSort(arr))
let times = [0, 0, 0, 0, 0];
// for (let i = 0; i < 100000; i++) {
//     let arr = [1, 2, 3, 4, 5];
//     arr.sort(() => Math.random() - 0.5);
//     times[arr[4]-1]++;
// }
// console.log(times)
// [ 24855, 6790, 21203, 19071, 28081] 2022-04-23测试结果，问题出在sort函数的原理，对于不同版本的浏览器，实现的原理有差异

// 产生指定范围的随机数
function getRandom(min, max) {
    return Math.random() * (max - min) + min
}

// 方法二
function randomSort2(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}
console.log(randomSort2(arr))
