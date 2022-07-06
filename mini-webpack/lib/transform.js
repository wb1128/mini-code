const fs = require('fs')
// 生成抽象语法树。参考https://astexplorer.net/
const parser = require('@babel/parser')
// 遍历抽象语法树
const traverse = require('@babel/traverse').default
// babel.transform等方法可以将抽象语法树转为代码
const babel = require('@babel/core')

/**
 * 获取抽象语法树
 * @param {*} filename 
 * @returns ast
 */
function getAST(filename) {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  return ast
}

/**
 * 获取依赖列表
 * @param {*} ast 抽象语法树
 * @returns 
 */
function getImports(ast) {
  // 依赖的文件列表
  const importList = []
  traverse(ast, {
    // 针对import
    ImportDeclaration: ({ node }) => {
      importList.push(node.source.value)
    },
    CallExpression: ({ node }) => {
      // 针对 require
      if(node.callee.name === 'require') {
        const argument = node.arguments[0]
        argument.type === 'StringLiteral' && importList.push(argument.value)
      }
    }
  })
  return importList
}

/** 依赖索引 */
let ID = 0

/**
 * 获取文件依赖信息
 * @param {*} filename 
 */
function getAsset(filename) {
  let dependencies = []
  let code = ''
  const id = ID++
  if(/\.css$/.test(filename)) {
    code = handleCssLoader(filename)
  } else {
    const ast = getAST(filename)
    dependencies = getImports(ast)
    code = babel.transformFromAstSync(ast, null, {
      // 只对modules进行转换，转成commonjs
      plugins: ["@babel/plugin-transform-modules-commonjs"]
    }).code
  }
  
  return {
    id,
    filename,
    dependencies,
    code
  }
}

/**
 * 模拟处理css 文件
 * @param {*} filename 
 * @returns 
 */
function handleCssLoader(filename) {
  const content = fs.readFileSync(filename, 'utf-8')
  const code = `
    var style = document.createElement('style'); 
    style.type = 'text/css'; 
    style.innerHTML=\`${content.toString()}\`; 
    document.getElementsByTagName('head').item(0).appendChild(style); 
  `
  return code
}

module.exports = {
  getAST,
  getImports,
  getAsset,
  ID
}