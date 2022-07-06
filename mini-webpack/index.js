const wp = require('./lib/index')

// 测试普通的3层依赖
wp.webpack({
  entry: './example/entry.js'
})

// 测试运行时缓存内容 installedModules 是否生效
// wp.webpack({
//   entry: './example/entryCache.js'
// })

// 测试commonjs语法
// wp.webpack({
//   entry: './example/entryCommonSyntax.js'
// })

// 测试loader
// wp.webpack({
//   entry: './example/entryLoader.js'
// })

