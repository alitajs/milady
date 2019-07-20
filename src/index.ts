import fetch from 'node-fetch';
import { join } from 'path';
import { outputFileSync, readdirSync } from 'fs-extra';
import signale from 'signale';

const loadPlugins: string[] = [];
export interface DefaultPluginsConfig {
  enabled: boolean;
}
export interface DefaultPlugins {
  [index: string]: DefaultPluginsConfig;
}

// eslint-disable-next-line space-before-function-paren
export default async function({
  swaggerUrl,
  plugins = [],
  defaultPlugins = {
    mock: { enabled: true },
    serviceJs: { enabled: false },
    serviceTs: { enabled: true },
  },
}: {
  swaggerUrl: string;
  plugins: any[];
  defaultPlugins: DefaultPlugins;
}) {
  signale.time('milady');
  if (!swaggerUrl) {
    signale.log('必须携带URL地址，如milady https://xx.x.x/abc/v2/api-docs#/');
    return;
  }
  /*  获取数据 */
  const data: any = await getData(swaggerUrl);
  /*  处理数据 */
  const files = handleData(data, defaultPlugins, plugins);
  /*  生成代码 */
  codeGen(files);
  signale.timeEnd('milady');
}
async function getData(swaggerUrl: string) {
  const res = await fetch(swaggerUrl);
  const data = await res.json();
  const error = await data.catch;
  if (error) {
    signale.error(error);
  }
  return data;
}
function handleData(
  SwaggerData: { tags?: never[] | undefined; paths: any; definitions: any },
  defaultPlugins: DefaultPlugins,
  plugins: any[],
) {
  const directory: any = [];
  /* 加载默认插件 */
  // const a = require('./plugins/mock');
  const defaultPluginsName = readdirSync('../lib/plugins');
  defaultPluginsName.forEach(item => {
    const defaultPlugin = defaultPlugins[item];
    const str: string = join('../lib/plugins', item);
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const defaultPluginFile = require(str).default;
    if (defaultPlugin.enabled) {
      directory.push({
        outPath: defaultPluginFile.outPath,
        file: defaultPluginFile.handelData(SwaggerData),
      });
      loadPlugins.push(item);
    }
  });
  /* 加载配置插件 */
  if (Object.prototype.toString.call(plugins) === '[object Array]') {
    if (plugins.length !== 0) {
      plugins.forEach(element => {
        if (element.hasOwnProperty('outPath') && element.hasOwnProperty('handelData')) {
          if (
            Object.prototype.toString.call(element.outPath) === '[object String]' &&
            Object.prototype.toString.call(element.handelData) === '[object Function]'
          ) {
            directory.push({
              outPath: element.outPath,
              file: element.handelData(),
            });
          } else {
            signale.error('返回值错误');
          }
        } else {
          signale.error('插件字段类型有误！');
        }
      });
    }
  } else {
    signale.error('请检查插件格式是否为数组！');
  } // 检查插件类型

  return directory;
}
function generate(outPath: string, fileArr: { fileName: string; fileStr: string }[]) {
  fileArr.forEach(element => {
    let paths = outPath || 'out/';
    paths = join(paths, element.fileName);
    outputFileSync(paths, element.fileStr, 'utf-8');
  });
}
function codeGen(files: any[]) {
  files.forEach(element => {
    generate(element.outPath, element.file);
  });
  signale.complete('文件创建完成');
  signale.complete(`加载插件列表：${loadPlugins.join('、')}`);
}
