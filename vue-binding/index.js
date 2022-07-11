
import { Observer, initData } from "./observer/index.js"
import Watcher from './observer/watcher.js'


// 简单测试双向绑定
// // 字符串和对象，不涉及数组
// const data = {
//   message: 'hello world',
//   today: {
//     eat: 'apple',
//     drink: 'milk'
//   }
// }
// const obsData = new Observer(data)
// console.log('Observer对象', obsData)
// console.log('defineProperty后', data)
// data.message = data.today.eat



function Vue(options){
  this.$options = options
  if (options.data) {
    initData(this)
    new Observer(options.data)
  }
  this.watch = new Watcher(this, 'message', options.watch.message)
}


const vm = new Vue({
  // 字符串和对象，不涉及数组
  data: {
    message: 'hello world',
    today: {
      eat: 'apple',
      drink: 'milk'
    }
  },
  watch: {
    message(newVal, oldVal) {
      console.log('vue message 监听函数回调', newVal, oldVal)
    }
  },
  // computed: {
  //   reversedMsg() {
  //     return this.msg.split('').reverse().join('')
  //   }
  // }
})

console.log(vm)

console.log('修改vue message值')
// 触发数据变动
vm.message = 'changed'
console.log(vm)


