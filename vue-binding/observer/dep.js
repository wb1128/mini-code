/**
 * Dep 管理依赖（即watcher）
 * 收集依赖、向依赖发送消息
 */
export default class Dep {
  constructor() {
    // 例如
    // 0: Watcher
    //     cb: ƒ message(newVal, oldVal)
    //     getter: ƒ (obj)
    //     vm: Vue {$options: {…}, _data: {…}}
    //     [[Prototype]]: Object
    //                    constructor: class Watcher
    //                    get: ƒ get()
    //                    update: ƒ update()
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  // 收集依赖
  depend() {
    if(window.target) {
      this.addSub(window.target)
    }
  }
  // 向依赖发送消息
  notify() {
    const subs = this.subs.slice()
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}
