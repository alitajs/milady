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
};
```

### 配置说明

### swaggerUrl

字段类型：string

说明：swagger 数据源的 url

例子：

```js
exports.default = {
  swaggerUrl: '',
};
```

### defaultPlugins

字段类型：object

说明：控制 milady 内置插件开启或关闭，目前支持 umi 的 mock 数据文件和 service 文件 js 版生成。enabled 为 false 则不会加载插件。

例子：

```js
exports.default = {
  swaggerUrl: '',
  defaultPlugins: {
    serviceJs: { enabled: true },
    mock: { enabled: false },
  },
};
```

### plugins

字段类型：array

说明：用于设置自己写的外部插件，url 为相对于根目录的插件目录。

例子：

```js
exports.default = {
  swaggerUrl: '',
  plugins: [{ url: './plugin/detail.js' }],
};
```

### 插件开发

说明：

1. 插件文件需要返回一个默认值对象，outPath 为输出到相对于根目录位置，handelData 为处理数据的方法。
2. handelData 有一个参数，是 swagger 数据源的值。handelData 必须返回一个固定格式集合，数组里面一个对象代表一个会生成的文件，fileName 是生成文件的名字（需要后缀），fileStr 是文件内容。
3. 你可以根据 swagger 数据处理出你喜欢的字符串来生成文件，也可以用这个方法作为生成文件的方法。

插件文件格式：

```js
function handelData(params) {
  return [
    {
      fileName: 'check.txt',
      fileStr: '测试字符串',
    },
  ];
}
exports.default = {
  outPath: './out', // 输出目录路径
  handelData,
};
```
