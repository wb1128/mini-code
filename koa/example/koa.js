const Koa = require('../index')

const app = new Koa()

app.use(async (ctx, next) => {
  console.time("花费时间");
  await next()
  console.timeEnd('花费时间')
})


app.use(async (ctx, next) => {
  console.log('处理请求，返回结果')

  await new Promise((resolve) => {
    setTimeout(() => {
      ctx.body = 'hello world'
      resolve()
    }, 3000)
  })
  await next()
})



app.listen(4000, () => {
  console.log("server is running, port is 4000");
})