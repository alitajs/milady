# milady

Generate the front-end code by parsing the interface document

## what

这是一个通过 swagger 的 url 自动化生成代码的项目。

## why

因为使用 umi 途中需要写很多重复的 service 文件和 mock 文件，故建立此项目来自动化这些重复的工作。

## how

### 命令行方案

1. 检查是否存在配置文件
2. 不存在则退出程序给出提示，存在则提取配置作为参数进入主函数。
3. 提示更新包

### 引用方案

1. 引用主函数方法，传入参数配置进入主函数。

### 主函数

- 获取数据：通过 node-fetch 和配置的 url 拿到 swagger 数据。

  - 配置：

  ```js
  exports.default = {
    swaggerUrl: '', //推荐的，优先加载命令行的url，命令行没有再加载配置的url
    plugins: [
      {
        outPath: '', //输出目录路径
        handelData: params => {
          return [{ fileName: 'api.ts', fileStr: params }];
        }, //传入swagger数据，返回集合fileName是生成的文件名，fileStr是生成的文件内容
      },
    ], //可选的
  };
  ```

- 处理数据：

  - 内置处理方式：
    - mock 数据：
    1. 支持 mockjs
    2. 支持配置数据外层，不配置则为默认值，如`{code:200,msg:'成功',data:''}`
    - service 数据：
    1. 支持 js、ts 配置

- 写入数据：配置文件获得输出文件夹路径，处理数据得到数组`[{ fileName: '', fileStr: '' }]`
