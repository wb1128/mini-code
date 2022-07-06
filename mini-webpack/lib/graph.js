const fs = require('fs')
const path = require('path')
const { getAsset } = require('./transform')


/**
 * 构造出依赖关系数据结构
 * @param {*} config 配置文件
 * @returns 依赖关系数组
 */
function createGraph(config) {
  // 入口文件依赖信息
  const mainAsset = getAsset(config.entry)
  const queue = [mainAsset]
  for(const asset of queue) {
    const dirname = path.dirname(asset.filename)
    // mapping 映射位置和ID。用于打包好的文件运行时找ID
    asset.mapping = {}
    asset.dependencies.forEach(relPath => {
      const absPath = getAbsPath(dirname, relPath)
      const child = getAsset(absPath)
      asset.mapping[relPath] = child.id
      // 如果模块相互依赖，会导致不停的遍历
      queue.push(child)
    })
  }
  return queue
}

/**
 * 获取文件路径
 * @param {*} dirname 当前目录
 * @param {*} relPath 相对位置
 * @returns 绝对路径
 */
function getAbsPath(dirname, relPath) {
  // 处理window的路径 'example\\todo.js' -> 'example/todo.js'
  let absPath = path.join(dirname, relPath).split(path.sep).join('/')
  // 添加默认后缀js
  if(!path.extname(absPath)) {
    absPath += '.js'
  }
  return absPath
}

/**
 * 生成可运行代码
 * @param {*} graph 依赖关系数组
 */
function generate(graph) {
  let modules = ''
  graph.forEach(module => {
    modules += `${module.id}: [
      function (require, module, exports) { ${ module.code } },
      ${JSON.stringify(module.mapping)}
    ],`
  })

  const bundledCode = `
    (function(modules){
      // 缓存加载过的模块
      var installedModules = {};

      function require(id) {
        // 查找模块执行函数，依赖索引
        const [fn, mapping] = modules[id];

        // 执行模块，获取导出的内容
        function localRequire(relPath) {
          return installedModules[mapping[relPath]] || require(mapping[relPath]);
        }

        // 定义模块属性
        const module = { exports: {} };
        // 执行模块
        fn(localRequire, module, module.exports);
        // 缓存
        installedModules[id] = module
        return module.exports;
      }
      require(0);
    })({${ modules }})
  `
  fs.writeFileSync('./dist/main.js', bundledCode)
}

module.exports = {
  createGraph,
  generate
}