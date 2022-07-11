
/**
 * Watcher 即依赖（供需关系中的需求者）
 * 初始化时触发data中getter，将依赖（Watcher）收集起来（收集到Dep）
 */
export default class Watcher {
  constructor(vm, expOrFn, cb) {
    // vm，vue组件实例
    this.vm = vm
    // getter 获取依赖值的函数
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  // 触发依赖收集
  get() {
    window.target = this
    // 触发observer的getter
    let value = this.getter.call(this.vm, this.vm)
    window.target = undefined
    return value
  }
  // 数据变化时的调用
  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}

const bailRE = /[^\w.$]/
/**
 * 解析对象索引字符
 * @param {*} path a.b.c
 * @returns function
 */
function parsePath(path) {
  if(bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  // 返回函数（需要触发getter或者要用到值时，再调用）
  return function(obj) {
    for (let i = 0; i < segments.length; i++) {
      if(!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}