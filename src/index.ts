import fetch from 'node-fetch';
import { join } from 'path';
import { outputFileSync } from 'fs-extra';
// eslint-disable-next-line sort-imports
import serviceTs from './plugins/serviceTs';
// eslint-disable-next-line sort-imports
import mock from './plugins/mock';
// eslint-disable-next-line sort-imports
import serviceJs from './plugins/serviceJs';

// eslint-disable-next-line space-before-function-paren
export default async function({ swaggerUrl, plugins }: { swaggerUrl: string; plugins: any[] }) {
  if (!swaggerUrl) {
    console.log('必须携带URL地址，如milady https://xx.x.x/abc/v2/api-docs#/');
    return;
  }
  // 获取数据
  const data: any = await getData(swaggerUrl);
  // 处理数据
  const files = handleData(data, plugins);
  // 生成代码
  codeGen(files);
}
async function getData(swaggerUrl: string) {
  const res = await fetch(swaggerUrl);
  const data = await res.json();
  const error = await data.catch;
  if (error) {
    console.log(error);
  }
  return data;
}
function handleData(
  SwaggerData: { tags?: never[] | undefined; paths: any; definitions: any },
  plugins: any[],
) {
  const directory = [];
  // 加载默认插件
  directory.push({
    outPath: serviceTs.outPath,
    file: serviceTs.handelData(SwaggerData),
  });
  directory.push({
    outPath: serviceJs.outPath,
    file: serviceJs.handelData(SwaggerData),
  });
  directory.push({
    outPath: mock.outPath,
    file: mock.handelData(SwaggerData),
  });
  // 加载配置插件
  if (plugins.length !== 0) {
    console.log('加载插件');
  }
  return directory;
}
function generate(outPath: string, fileArr: { fileName: string; fileStr: string }[]) {
  fileArr.forEach(element => {
    let paths = outPath || 'out/';
    paths = join(paths, element.fileName);
    outputFileSync(paths, element.fileStr, 'utf-8');
  });
  console.log('文件创建完成');
}
function codeGen(files: any[]) {
  files.forEach(element => {
    generate(element.outPath, element.file);
  });
}
