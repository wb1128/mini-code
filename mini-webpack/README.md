# 实现简易webpack

## 纲要

- 添加运行时的installedModules功能
- 添加commonjs和es module的支持
- 模拟style-loader


依赖关系数据结构如下：

```
[
  {
    id: 0,
    filename: "A.js",
    dependencies: [
      "B.js",
    ],
    code: "",
    mapping: {
      "B.js": 1,
    }
  }
]
```

## 参考

[从零实现简易版Webpack](https://github.com/MudOnTire/build-your-own-webpack)
[Webpack 是怎样运行的?（一）](https://zhuanlan.zhihu.com/p/52826586)
