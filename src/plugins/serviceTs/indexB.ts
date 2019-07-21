import { readFileSync } from 'fs';
import { join } from 'path';
import { handelRef, strToKey } from '../../utils/handelStr';

function main(SwaggerData: { paths: any; definitions: any }) {
  const { paths, definitions } = SwaggerData;
  const indexStr = generateIndex(paths);
  const dataStr = generateData(definitions);
  const str = indexStr + dataStr;
  const file = [{ fileName: 'api.ts', fileStr: str }];
  return file;
}

/* 生成接口文件 */
function generateIndex(paths: any) {
  let indexStr = '';
  Object.keys(paths).forEach(api => {
    Object.keys(paths[api]).forEach(method => {
      if (method === 'post' || method === 'get') {
        const { description, responses, summary, tags, parameters } = paths[api][method];
        const interfaceGet = '';
        const requestInterfaceName = '';
        const responseInterfaceName = '';
        const requestBody = '';
        const data = getIndexValue(responses);
        const tpl = join(__dirname, './http.ts.tpl');
        let tplContent = readFileSync(tpl, 'utf-8');
        tplContent = tplContent
          .replace('<%= InterfaceGet %>', interfaceGet)
          .replace('<%= FunctionTags %>', JSON.stringify(tags))
          .replace('<%= FunctionSummary %>', summary)
          .replace('<%= FunctionDescription %>', description)
          .replace(new RegExp('<%= FunctionParams %>', 'g'), strToKey(requestInterfaceName))
          .replace('<%= FunctionName %>', strToKey(api))
          .replace('<%= FunctionPromise %>', strToKey(responseInterfaceName))
          .replace('<%= FunctionUrl %>', api)
          .replace('<%= FunctionParamsMethod %>', requestBody);
        indexStr = indexStr.concat(tplContent);
      }
    });
  });
  indexStr = indexStr.concat('};\n');
  return indexStr;
} // 生成接口文件
function getIndexValue(responses: any) {
  let res;
  if (responses['200'] && responses['200'].schema) {
    if (responses['200'].schema.$ref) {
      res = `data.${handelRef(responses['200'].schema.$ref)}`;
    } else if (responses['200'].schema.items && responses['200'].schema.items.$ref) {
      res = `[data.${handelRef(responses['200'].schema.items.$ref)}]`;
    }
  } else {
    res = null;
  }
  return res;
}

/* 生成请求文件 */
let up = true; // 排序
function generateData(definitions: any) {
  let dataStr = '';
  dataStr = dataStr.concat(generateObjectStr(Object.keys(definitions)));
  dataStr = dataStr.concat(generateBody(definitions));
  dataStr = dataStr.concat('export default obj;\n');
  return dataStr;
} // 生成数据文件
function generateBody(definitions: any) {
  let dataStr = '';
  Object.keys(definitions).forEach(dataName => {
    const dataContents = definitions[dataName].properties;
    up = true;
    const str = generateDataStr(dataName, dataContents);
    if (up) {
      dataStr = str.concat(dataStr);
    } else {
      dataStr = dataStr.concat(str);
    }
  });
  return dataStr;
}
function generateDataStr(dataName: any, dataContents: any) {
  if (!dataContents) {
    console.log(dataContents);
    return '';
  }
  let str = `obj.${strToKey(dataName)} = {\n`;
  Object.keys(dataContents).forEach(propertiesName => {
    str = str.concat(
      `  ${propertiesName}: ${generateValueStr(dataContents[propertiesName])}, // ${
        dataContents[propertiesName].description
          ? dataContents[propertiesName].description.replace(/\n/g, '').replace(/\s/g, '')
          : '无'
      }\n`,
    );
  });
  str = str.concat('};\n');
  return str;
} // 生成数据
function generateValueStr(params: any) {
  let dataStr;
  let data = null;
  if (params.items && params.items.$ref) {
    data = handelRef(params.items.$ref);
  }
  switch (params.type) {
    case 'array':
      dataStr = `[obj.${data}]`;
      up = false;
      break;
    case 'object':
      dataStr = `obj.${data}`;
      up = false;
      break;
    case 'string':
      dataStr = '1';
      break;
    case 'integer':
      dataStr = 1;
      break;
    case 'boolean':
      dataStr = true;
      break;
    case 'number':
      dataStr = 1;
      break;
    case 'undefined':
      dataStr = undefined;
      break;
    default:
      dataStr = "'没有type值'";
      break;
  }
  return dataStr;
} // 生成数据值
function generateObjectStr(params: any[]) {
  let str = 'const obj = {\n';
  params.forEach(element => {
    str = str.concat(`  ${strToKey(element)}: null,\n`);
  });
  str = str.concat('};\n');
  return str;
} // 生成定义导出数据对象
export default {
  outPath: 'mock/',
  handelData: main,
};
