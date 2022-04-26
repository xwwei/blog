// 数组扁平化
let arr = [1, 2, 3, [2, 5, [7, 8]]]
// es6
arr.flat()

console.log(arr.flat(Infinity))

// 方法二
function flat2(arr) {
    let result = []
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'object') {
            result = result.concat(flat2(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result
}

console.log(flat2(arr))

// 方法三，仅仅适合数组元素是number类型
let r = arr.toString().split(',').map(r => +r)
console.log(r)

// 方法四
function flat4(arr) {
    return arr.reduce((pre, current) => {
        return pre.concat(Array.isArray(current) ? flat4(current) : current)
    }, [])
}
console.log(flat4(arr))

// 方法五
function flat5(arr) {
    while(arr.some(el => Array.isArray(el))) {
        arr = [].concat(...arr)
    }
    return arr
}

console.log(flat5(arr))