


// 分析中间层可以发现
// 第一个参数context，是中间层传递的变量，多为对象（引用传递） - 可以不用管
// 第二个参数next，是下一个中间层函数。 在当前中间层调用
// async (context, next) => {
//   console.log(1)
//   await next()
//   console.log(6)
// }




/**
 * 重点将传入的函数数组middlewareList，按顺序调用里面的函数。
 * 执行权需要交给中间层自行调用，所以我们需要将下一个中间层作为参数传进去。middleware(ctx, nextMiddleware)
 * @param { [fn1, fn2, ...] } middlewareList 中间层数组
 * middleware { fn } 中间层
 * @returns 
 */
function compose(middlewareList) {
  return function (ctx) {
    // 从第一个中间层开始执行
    return dispatch(0)

    function dispatch(i) {
      // 全部中间层执行完，结束
      if(i === middlewareList.length) {
        return Promise.resolve()
      }
      // 当前需执行的中间层函数
      const middleware = middlewareList[i]
      try {
        // 执行中间层，
        // dispatch.bind(null, i + 1) 也就是 next函数（下一个中间层）
        // 这里不用担心Promise.resolve马上执行，因为执行中间层是调用栈，需等到中间层执行完毕才会回到这里
        return Promise.resolve(middleware(ctx, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

module.exports = compose
