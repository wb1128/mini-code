const compose = require('./compose')
const http = require('http')

/**
 * Application封装的koa
 */
class Application {
  constructor() {
    // 中间层
    this.middleware = []
  }

  // 启动服务
  listen(...args) {
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }

  // 收集中间层
  use(fn) {
    this.middleware.push(fn)
  }

  callback() {
    // 构造洋葱结构
    const fn = compose(this.middleware)
    // 有请求时的回调
    return (request, response) => {
      // 获得封装的ctx
      const ctx = this.handleCtx(request, response)
      const responseHelper = () => this.handleResponse(ctx)
      // 执行洋葱模型
      return fn(ctx).then(responseHelper)
    }
    
  }

  /**
   * 返回上下文
   * 在这里将封装一些方法
   * @param {*} request 
   * @param {*} response 
   * @returns ctx
   */
  handleCtx(request, response) {
    return {
      request,
      response
    }
  }

  /**
   * 对结果进行处理
   * 执行时机：最后一个中间层执行完后
   * @param {*} ctx 
   * @returns 
   */
  handleResponse(ctx) {
    return ctx.response.end(ctx.body)
  }
}

module.exports = Application