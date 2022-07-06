
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
    })({0: [
      function (require, module, exports) { "use strict";

var _todo = _interopRequireDefault(require("./todo.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 测试3层依赖
console.log(_todo.default); },
      {"./todo.js":1}
    ],1: [
      function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _message = require("./message.js");

var _default = `today ${_message.message}`;
exports.default = _default; },
      {"./message.js":2}
    ],2: [
      function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.message = void 0;
const message = 'learn webpack';
exports.message = message; },
      {}
    ],})
  