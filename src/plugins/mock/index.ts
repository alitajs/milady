import { handelRef, strToKey } from '../../utils/handelStr';

function main(SwaggerData: { paths: any; definitions: any }) {
  const { paths, definitions } = SwaggerData;
  const indexStr = generateIndex(paths);
  const dataStr = generateData(definitions);
  const file = [
    { fileName: 'index.js', fileStr: indexStr },
    { fileName: 'data.js', fileStr: dataStr },
  ];
  return file;
}

/* 生成接口文件 */
function generateIndex(paths: any) {
  let indexStr = "import data from './data';\n\nexport default {\n";
  Object.keys(paths).forEach(api => {
    Object.keys(paths[api]).forEach(method => {
      if (method === 'post' || method === 'get') {
        const { description, responses } = paths[api][method];
        const data = getIndexValue(responses);

        indexStr = indexStr.concat(
          `  '${method.toUpperCase()} ${api}': {\n    code: 0,\n    message: '成功',\n    data: ${data},\n  }, // ${description &&
            description.replace(/\n/g, '')}\n`,
        );
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

/* 生成数据文件 */
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
