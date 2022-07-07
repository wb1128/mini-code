const compose = require('../compose')


const middlewareList = []
middlewareList.push(async (context, next) => {
  console.log(1)
  await next()
  console.log(6)
})

middlewareList.push(async (context, next) => {
  console.log(2)
  await next()
  console.log(5)
})

middlewareList.push(async (context, next) => {
  console.log(3)
  await next()
  console.log(4)
})
compose(middlewareList)()
// 1 2 3 4 5 6