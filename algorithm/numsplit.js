function numsplit(num) {
    let numlist = (num + '').split('.')
    let str = numlist[0]
    let len = str.length
    let prov = len % 3
    let result = str.substr(0, prov)
    while(prov < len) {
        const temp = str.substr(prov, 3)
        if (!result) {
            result = temp
        } else {
            result += ',' + temp
        }
        prov += 3
    }
    return numlist[1] ? result + '.' + numlist[1] : result
}

console.log(numsplit(1100000))