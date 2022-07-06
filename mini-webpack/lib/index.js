const { createGraph, generate } = require('./graph')


function webpack(config) {
  const graph = createGraph(config)
  generate(graph)
}

module.exports = {
  webpack
}
