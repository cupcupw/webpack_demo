export function formDatePhonex(val) {
    if (val.toString().indexOf('-') > 0) {
        val = val.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/') // 将 '-' 替换成 '/' 兼容ios时间格式问题
    }
    return val;
}
export function dataURLtoFile(dataUrl, filename) {
    // 获取到base64编码
    const arr = dataUrl.indexOf('data:image/png;base64,')?dataUrl.split(','):dataUrl
    // 将base64编码转为字符串
    const bstr = arr[1]?window.atob(arr[1]):window.atob(arr[0])
    let n = bstr.length
    const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {
        type: 'image/jpeg',
    })
}

