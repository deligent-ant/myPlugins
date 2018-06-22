##无限下拉或是上拉组件 ####依赖：

- 依赖 underscore 来编译模版字符串

* 用户使用插件前要在 html 中先进行引入：

```html
<script src="http://www.bootcss.com/p/underscore/underscore-min.js"></script>
```

- 在浏览器端使用
  ```js
  ;(function() {
    infiniteLoad({
      scollDirection: 'up', //滚动方向，‘up’||‘down’
      domString: '', //页尾栏  选择器,可以省略
      fatherString: '.content', //父亲元素 选择器
      childString: 'li', //标签名字
      template: '<p><%= date %></p><p><%= desc %></p><img src=<%= pic %> >', //模版字符underscore写法
      cb: async function({ limit, offset }) {
        let res = await axios.get('/json', {
          params: { limit, offset }
        })
        let { code, data } = res.data
        if (parseInt(code, 10) !== 0) return
        let mockData = Array.apply(null, { length: 50 }).map((item, index) => {
          return data[index % 2]
        })
        return mockData
      }, //页尾部栏可见时候，远程加载数据的函数，返回一个promise 数据是对象数组[{}]
      options: {
        //一开始的limit和offset限制
        limit: 2,
        offset: 0
      }
    })
  })()
  ```
