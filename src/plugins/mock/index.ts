import { handelRef, strToKey } from '../../utils/handelStr';

function main(SwaggerData: { paths: any; definitions: any }) {
  const { paths, definitions } = SwaggerData;
  let dataStr = '';
  let indexStr = "import data from './data';\n\nexport default {\n";
  // 生成接口文件
  Object.keys(paths).forEach(api => {
    Object.keys(paths[api]).forEach(method => {
      const { description, responses } = paths[api][method];
      const data =
        responses['200'].schema && responses['200'].schema.$ref
          ? `data.${handelRef(responses['200'].schema.$ref)}`
          : null;
      indexStr = indexStr.concat(
        `  '${method.toUpperCase()} ${api}': ${data}, // ${description &&
          description.replace(/\n/g, '')}\n`,
      );
    });
  });
  indexStr = indexStr.concat('};');
  // 生成数据文件
  Object.keys(definitions).forEach(dataName => {
    const dataContents = definitions[dataName].properties;
    dataStr = dataStr.concat(generateDataStr(dataName, dataContents));
  });
  dataStr = dataStr.concat(generateExportStr(Object.keys(definitions)));
  dataStr = dataStr.concat('};');
  const file = [
    { fileName: 'index.js', fileStr: indexStr },
    { fileName: 'data.js', fileStr: dataStr },
  ];
  return file;
}

function generateDataStr(dataName: any, dataContents: any) {
  if (!dataContents) {
    console.log(dataContents);
    return '';
  }
  let str = `const ${strToKey(dataName)} = {\n`;
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
}
function generateValueStr(params: any) {
  let str;
  let data = null;
  if (params.items && params.items.$ref) {
    data = handelRef(params.items.$ref);
  }
  switch (params.type) {
    case 'array':
      str = `${data}`;
      break;
    case 'object':
      str = `${data}`;
      break;
    case 'string':
      str = '1';
      break;
    case 'integer':
      str = 1;
      break;
    case 'boolean':
      str = true;
      break;
    case 'number':
      str = 1;
      break;
    case 'undefined':
      str = undefined;
      break;
    default:
      str = "'没有type值'";
      break;
  }
  return str;
}
function generateExportStr(params: any[]) {
  let str = 'export default {\n';
  params.forEach(element => {
    str = str.concat(`  ${strToKey(element)},\n`);
  });
  return str;
}
export default {
  outPath: 'mock/',
  handelData: main,
};
