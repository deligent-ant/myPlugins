let _ = require('underscore')
//需要用到的变量声明:
let contentCache = [] //缓存每个li的数据
let newData = [] //缓存每一次新加载的数据
let page = 0 //加载的次数
let liObserver = new IntersectionObserver(visiableCallBack) //插入的子元素的监视
let inputParams = {} //外面输入的参数

//通用函数
function queryAll(string) {
  return Array.from(document.querySelectorAll(string))
}

//函数
function visiableCallBack(entries) {
  let index = 0 //可见时候li在所有li中的index
  let content = '' //li对应的数据
  entries.forEach(item => {
    index = item.target.dataset.index
    if (item.intersectionRatio <= 0) {
      item.target.innerHtml = ''
      item.target.style.visibility = 'hidden'
    } else {
      item.target.style.visibility = 'visible'
      content = contentCache[index]
      let compiled = _.template(inputParams.template)
      let innerHtml = compiled(content)
      item.target.innerHTML = innerHtml
    }
  })
}

//页尾栏可见触发的函数
async function load() {
  let newData = await inputParams.cb.call(window, {
    limit: inputParams.options.limit,
    offset: inputParams.options.offset
  })
  inputParams.options.limit++
  inputParams.options.offset = page * inputParams.options.limit
  page++
  updateUI(newData)
}

//渲染函数
function updateUI(data) {
  let lastIndex = contentCache.length
  contentCache = contentCache.concat(data)
  let contentDom = queryAll(inputParams.fatherString)[0]
  data.forEach(item => {
    let li = document.createElement(inputParams.childString || 'li')
    li.dataset.index = lastIndex++
    contentDom.appendChild(li)
    liObserver.observe(li)
  })
}

//生成一个函数
function infiniteLoad({
  domString,
  fatherString,
  childString,
  template,
  options,
  cb
}) {
  inputParams = {
    domString,
    childString,
    template,
    options,
    fatherString,
    cb
  }
  //解决触发观察函数的dom
  let observerDom = undefined
  if (!domString) {
    //生成观察的dom
    observerDom = document.createElement('footer')
    observerDom.setAttribute('id', 'XYHSentinels')
    observerDom.innerHTML = '加载中......'
    observerDom.cssText = 'text-align:center;color:red;border: 1px solid green;'
    document.body.appendChild(observerDom)
  } else {
    observerDom = queryAll(domString)[0]
  }

  let intersectionObserver = new IntersectionObserver(function(entries) {
    // 如果不可见，就返回
    if (entries[0].intersectionRatio <= 0) return
    load()
  })

  // 开始观察
  intersectionObserver.observe(observerDom)
  return this
}
if (!window.infiniteLoad) window.infiniteLoad = infiniteLoad

module.exports = infiniteLoad
