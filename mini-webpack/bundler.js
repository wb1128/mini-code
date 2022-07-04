const fs = require('fs')
const path = require('path')
// 生成抽象语法树。参考https://astexplorer.net/
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')


function getAST(filename) {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  return ast
}

function getImports(ast) {
  const importList = []
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      importList.push(node.source.value)
    }
  })
  return importList
}

let ID = 0
function getAsset(filename) {
  const ast = getAST(filename)
  const dependencies = getImports(ast)
  const id = ID++
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/env']
  })
  return {
    id,
    filename,
    dependencies,
    code
  }
}

function createGraph(entry) {
  // 使用文件绝对路径
  // entry = path.join(__dirname, entry)
  const mainAsset = getAsset(entry)
  const queue = [mainAsset]
  for(const asset of queue) {
    const dirname = path.dirname(asset.filename)
    asset.mapping = {}
    asset.dependencies.forEach((relPath, index) => {
      let absPath = path.join(dirname, relPath).split(path.sep).join('/')
      // 添加默认后缀js
      if(!path.extname(absPath)) {
        absPath += '.js'
      }
      const child = getAsset(absPath)
      asset.mapping[relPath] = child.id
      queue.push(child)
    })
  }
  return queue
}

function bundle(graph) {
  let modules = ''
  graph.forEach(module => {
    modules += `${module.id}: [
      function (require, module, exports) { ${ module.code } },
      ${JSON.stringify(module.mapping)}
    ],`
  })

  const bundledCode = `
    (function(modules){
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(relPath) {
          return require(mapping[relPath]);
        }
        const localModule = { exports: {} };
        fn(localRequire, localModule, localModule.exports);
        return localModule.exports;
      }
      require(0);
    })({${ modules }})
  `
  fs.writeFileSync('./dist/main.js', bundledCode)
}

// const ast = getAST('./example/todo.js')
// const importList = getImports(ast)
// console.log(importList)
// const mainAsset = getAsset('./example/entry.js')
// console.log(mainAsset)
const graph = createGraph('./example/entry.js')
// console.log(graph)
console.log(bundle(graph))