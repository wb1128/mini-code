import Dep from './dep.js'

/**
 * 侦测所有数据，将数据内所有属性转换成getter/setter的形式
 * 这样就可以知道数据发生变化的时机
 * 供需关系中的提供者
 */
export class Observer {
  constructor(value) {
    this.walk(value)
  }
  // 遍历对象的属性添加getter/setter
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

/**
 * 将对象的属性添加getter/setter
 * @param {*} obj 对象
 * @param {*} key 属性
 * @param {*} val 值
 */
export function defineReactive(obj, key, val) {
  if(Object.prototype.toString.call(val) === '[object Object]') {
    // 对象递归
    new Observer(val)
  }
  // 声明当前属性的 依赖收集器
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      // 收集依赖
      dep.depend()
      console.log('获取', key, val)
      return val
    },
    set: function(newVal) {
      console.log('设置', key, newVal)
      if(val === newVal) {
        return
      }
      val = newVal
      // 通知依赖（watcher）
      dep.notify()
    }
  })
}




// 空函数
function noop(a, b, c) {}
      
// Object.defineProperty的属性描述符
// value——当试图获取属性时所返回的值。
// writable——该属性是否可写。
// enumerable——该属性在for in循环中是否会被枚举。
// configurable——该属性是否可被删除。
// set()——该属性的更新操作所调用的函数。
// get()——获取属性值时所调用的函数。
const sharedPropertyDefinition = {
  enumerable: true,
  configurable:  true,
  get: noop,
  set: noop
}
// proxy函数将target对象中的sourceKey的key属性代理到target中
function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/**
 * 初始化vm环境的data
 * 将data代理到vm对象上
 * this.message 而不用 this.data.message 的原理
 * @param {*} vm 
 */
export function initData(vm) {
  // 赋值一份data数据
  const data = vm._data = vm.$options.data
  const keys = Object.keys(data)
  let i = keys.length
  // 遍历data
  while(i--) {
    const key = keys[i]
    // 将vm对象中的_data的key属性代理到vm中
    proxy(vm, '_data', key)
  }
}