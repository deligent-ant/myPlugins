#个人插件
写一些平时自己用到的一些组件，主要基于 vue #具体插件

1.  jsonArray 导出 excel


```js
  props: {
  params: {
    type: Object,
    default: () => {} //{jsonData:[],keyMap:{name:'名字'}}
  }
},
```

这个组件输入，一个是待转化的对象数组，字段会是表格的表头，然后 keyMap，传入可将对应的英文字段 在 excel 用中文展示，以及表头的顺序。没传入 keyMap，默认使用 Object.key(jsonData)
