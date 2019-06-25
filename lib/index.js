"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = require("fs");

var _path = require("path");

var _a = _interopRequireDefault(require("./a.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GetMethodString = "{\n    params\n  }";
const PostMethodString = "{\n    method: 'POST',\n    body: params\n  }";

function generateName(api) {
  let name = api.match(`[^/]+(?!.*/)`)[0];
  name = name.replace(/\-/g, '_');

  switch (name) {
    case 'delete':
      name = 'del';
      break;

    case 'import':
      name = 'imports';
      break;

    default:
      break;
  }

  return name;
}

function toUpperCase(str) {
  return str.replace(str[0], str[0].toUpperCase());
}

function generateType(type) {
  if (type === 'integer') {
    return 'number';
  }

  if (type === 'array') {
    return '[]';
  }

  return type;
}

function _default() {
  const _SwaggerData$tags = _a.default.tags,
        tags = _SwaggerData$tags === void 0 ? [] : _SwaggerData$tags,
        paths = _a.default.paths,
        definitions = _a.default.definitions;
  let outPutStr = "import request from 'umi-request';\n";
  Object.keys(definitions).forEach(defItem => {
    outPutStr += `interface ${defItem} {\n`;
    const properties = definitions[defItem].properties;
    Object.keys(properties).forEach(subDefItem => {
      let defItemStr = "    /**\n";
      defItemStr += `    * @description ${properties[subDefItem].description || ''}\n`;
      defItemStr += "    **/\n";
      defItemStr += `    ${subDefItem}: ${generateType(properties[subDefItem].type)};\n`;
      outPutStr += defItemStr;
    });
    outPutStr += '}\n';
  });
  Object.keys(paths).forEach(item => {
    const itemData = paths[item];
    Object.keys(itemData).forEach(subItem => {
      const subItemData = itemData[subItem];
      const summary = subItemData.summary,
            description = subItemData.description,
            subTags = subItemData.tags,
            responses = subItemData.responses,
            _subItemData$paramete = subItemData.parameters,
            parameters = _subItemData$paramete === void 0 ? [] : _subItemData$paramete;
      const resData = responses['200'].schema;
      const url = item;
      const name = generateName(item) + toUpperCase(subItem);
      const params = toUpperCase(name) + 'Query';
      const paramsMethod = subItem === 'get' ? GetMethodString : PostMethodString;
      let itemTargs = subTags || [];
      itemTargs = itemTargs.map(t => {
        tags.forEach(tag => {
          if (tag.name === t) {
            t = tag.description;
          }
        });
        return t;
      });
      let promise = '';

      if (resData.$ref) {
        promise = resData.$ref.replace('#/definitions/', '');
      } else if (resData.item) {
        promise = resData.item['$ref'].replace('#/definitions/', '') + '[]';
      }

      let definition = `interface ${params} {\n`;
      parameters.map(p => {
        if (p.in === 'query') {
          let pStr = "    /**\n";
          pStr += `    * @description ${p.description || ''}\n`;
          pStr += "    **/\n";
          pStr += `    ${p.name}: ${generateType(p.type)};\n`;
          definition += pStr;
        }
      });
      definition += '}\n';
      const tpl = (0, _path.join)(__dirname, '../template/services/http.ts.tpl');
      let tplContent = (0, _fs.readFileSync)(tpl, 'utf-8');
      tplContent = tplContent.replace('<%= InterfaceDefinition %>', definition).replace('<%= FunctionTags %>', JSON.stringify(itemTargs)).replace('<%= FunctionSummary %>', summary).replace('<%= FunctionDescription %>', description).replace(new RegExp('<%= FunctionParams %>', "g"), params).replace('<%= FunctionName %>', name).replace('<%= FunctionPromise %>', promise).replace('<%= FunctionUrl %>', url).replace('<%= FunctionParamsMethod %>', paramsMethod);
      outPutStr += tplContent;
    });
  });
  (0, _fs.writeFile)('out/api.ts', outPutStr, function (err) {
    if (err) {
      console.log('error', err);
    } else {
      console.log('success');
    }
  });
}