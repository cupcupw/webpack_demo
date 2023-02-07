if (process.env.NODE_ENV === 'development') {
    (() => {
        // 引入调试能力
        const script = document.createElement('script')
        script.src = 'https://cdn.bootcss.com/eruda/1.5.2/eruda.min.js'
        document.body.appendChild(script)
        script.onload = () =>  window.eruda.init()
    }) ();
}
