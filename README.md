# milady

Generate the front-end code by parsing the interface document

## what

这是一个通过 swagger 的 url 自动化生成代码的项目。

## why

因为使用 umi 途中需要写很多重复的 service 文件和 mock 文件，故建立此项目来自动化这些重复的工作。

## how

### 通过引用使用

安装

```js
npm i milady
```

使用

```js
import milady from 'milady';
const config = {
  swaggerUrl: '', //必填，用于获取数据
  plugins: [
    {
      outPath: '', //输出目录路径
      handelData: params => {
        return [{ fileName: 'api.ts', fileStr: params }];
      }, //传入swagger数据，返回集合fileName是生成的文件名，fileStr是生成的文件内容
    },
  ], //可选的，用于自定义输出文件
};
milady(config); //传入配置参数，调用milady方法生成文件
```

### 通过命令行使用

安装

```js
npm i milady -D
```

使用：

- 执行命令`milady [swaggerUrl]`生成文件
- 可选择设置配置`.miladyrc.js`文件进行高级设置，配置文件如下：

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

当命令和配置文件 swaggerUrl 冲突时使用命令的 swaggerUrl
