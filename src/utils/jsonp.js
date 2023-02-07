export default function jsonp(url) {
  return new Promise((resolve, reject) => {
    window.jsonCallBack = (res) => {
      if (res.success) {
        resolve(res)
      } else {
        reject('请求失败' || res.msg)
      }
    }
    const JSONP = document.createElement('script');
    JSONP.type = 'text/javascript';
    JSONP.src = url;
    document.getElementsByTagName('head')[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName('head')[0].removeChild(JSONP)
    }, 500)
  })
}
