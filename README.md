# codegen

Generate the front-end code by parsing the interface document

## 实现相关

### 命令行方案

1. 检查是否存在配置文件
2. 不存在则退出程序给出提示，存在则提取配置作为参数进入主函数。
3. 提示更新包

### 引用方案

1. 引用主函数方法，传入参数配置进入主函数。

### 主函数

获取数据：通过 node-fetch 和配置的 url 拿到 swagger 数据。

处理数据：内置处理方式： mock 数据： 1、支持 mockjs 2、支持配置数据外层，不配置则为默认值，如`{code:200,msg:'成功',data:''}` service 数据： 1、支持 js、ts 配置

写入数据：配置文件获得输出文件夹路径，处理数据得到数组`[{ fileName: '', fileStr: '' }]`
