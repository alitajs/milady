import fetch from 'node-fetch';
import { join } from 'path';
import { outputFileSync, readdirSync } from 'fs-extra';
import signale from 'signale';
import { isUrl } from './utils/common';

const loadPlugins: string[] = [];
export interface DefaultPluginsConfig {
  enabled: boolean;
}
export interface DefaultPlugins {
  [index: string]: DefaultPluginsConfig;
}

// eslint-disable-next-line space-before-function-paren
export default async function({
  dataSource,
  plugins = [],
  defaultPlugins = {
    mock: { enabled: true },
    serviceJs: { enabled: false },
    serviceTs: { enabled: true },
    serviceT: { enabled: false },
  },
}: {
  dataSource: string;
  plugins: any[];
  defaultPlugins: DefaultPlugins;
}) {
  signale.time('milady');
  if (!dataSource) {
    signale.log('必须携带URL地址，如milady https://xx.x.x/abc/v2/api-docs#/');
    return;
  }
  /*  获取数据 */
  let data: any;
  if (isUrl(dataSource)) {
    data = await getData(dataSource);
  } else {
    const str = join(process.cwd(), dataSource);
    // eslint-disable-next-line global-require,import/no-dynamic-require
    data = require(str);
  }
  /*  处理数据 */
  const files = handleData(data, defaultPlugins, plugins);
  /*  生成代码 */
  codeGen(files);
  signale.timeEnd('milady');
}
async function getData(dataSource: string) {
  const res = await fetch(dataSource);
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
  const defaultPluginsName = readdirSync(join(__dirname, '/plugins'));
  defaultPluginsName.forEach((item: any) => {
    const defaultPlugin = defaultPlugins[item];
    const str: string = join(__dirname, '/plugins', item);
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
        if (element.hasOwnProperty('url')) {
          const str: string = join(process.cwd(), element.url);
          // eslint-disable-next-line global-require,import/no-dynamic-require
          const pluginsFile = require(str).default;
          directory.push({
            outPath: pluginsFile.outPath,
            file: pluginsFile.handelData(SwaggerData),
          });
          loadPlugins.push(element.url.split('/').pop());
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
