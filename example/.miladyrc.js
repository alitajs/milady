exports.default = {
  swaggerUrl: 'https://petstore.swagger.io/v2/swagger.json', //推荐的，优先加载命令行的url，命令行没有再加载配置的url
  plugins: [
    {
      outPath: '', //输出目录路径
      handelData: params => {
        return [{ fileName: 'api.ts', fileStr: params }];
      }, //传入swagger数据，返回集合fileName是生成的文件名，fileStr是生成的文件内容
    },
  ], //可选的
};
