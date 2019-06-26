import { readFileSync, writeFile, existsSync, mkdir } from 'fs';
import { join } from 'path';
import axios from 'axios';
import { outputFileSync } from "fs-extra";
// import SwaggerData from './a.json';
const GetMethodString = "{\n    params\n  }";
const PostMethodString = "{\n    method: 'POST',\n    data: params\n  }";

function changeText(input: string) {
    if (input.includes('_')) {
        const texts = input.split('_');
        let str = texts.splice(0, 1)[0];
        texts.forEach(t => {
            str += toUpperCase(t)
        })
        return str;
    } else {
        return input;
    }
}
let additionalParameters = {} as any;
function changeApi(input: string) {
    const hasParams = input.includes('{')
    const nameArr = input.split('/');
    const newArr = nameArr.map(i => {
        if (i.includes("{")) {
            const param = i.replace(new RegExp('{', "g"), '').replace(new RegExp('}', "g"), '');
            additionalParameters[param] = param;
            i = `\${params.${param}\}'`
        }
        return i;
    })
    return hasParams ? `\`${newArr.join('/')}\`` : `'${newArr.join('/')}'`;
}
function changeParam(nameArr: any[]) {
    const newArr = nameArr.map(i => {
        if (i.includes("{")) {
            i = i.replace(new RegExp('{', "g"), '').replace(new RegExp('}', "g"), '');
        }
        return i;
    })
    return newArr
}
function generateName(api: string) {
    const nameArr = changeParam(api.split('/'));
    let name = nameArr![nameArr.length - 2] ? nameArr![nameArr.length - 2] + toUpperCase(nameArr![nameArr.length - 1]) : nameArr![nameArr.length - 1]
    name = name.replace(/\-/g, '_');
    return changeText(name);
}
function toUpperCase(str: string) {
    return str.replace(str[0], str[0].toUpperCase());
}
function generateType({ type, items, $ref }: any) {
    if (type === 'integer') {
        return 'number'
    }
    if (type === 'array') {
        if (type === 'array') {
            if (items['$ref']) {
                return generateInterfaceName(items['$ref']) + '[]'
            } else if (items.type) {
                return items.type + '[]'
            } else {
                return '[]'
            }
        }
    }
    if ($ref) {
        return generateInterfaceName($ref)
    }
    return type;
}
function generateHead(data: any) {
    return `
/**
 * This file is automatically generated using Alitajs/codegen
 * Host: ${data.host}
 * BasePath: ${data.basePath}
 * Version: ${data.info.version}
 * Description: 这个文件是使用脚本自动生成的，原则上来说，你不需要手动修改它
 * Others:
**/
import request from 'umi-request';\n
`
}
let hasChineseArr = {} as any;
let hasChineseCount = 0;
function generatePromise(resData: any) {
    let promise = ''
    if (!resData) {
        return 'any'
    }
    if (resData.$ref) {
        promise = resData.$ref.replace('#/definitions/', '').replace(new RegExp('«', "g"), '').replace(new RegExp('»', "g"), '');
    } else if (resData.item) {
        promise = resData.item['$ref'].replace('#/definitions/', '').replace(new RegExp('«', "g"), '').replace(new RegExp('»', "g"), '');
    } else if (resData.type) {
        promise = resData.type
    }
    const hasChinese = /[^\u4e00-\u9fa5]+/.test(promise);
    if (!hasChinese) {
        if (hasChineseArr[promise]) {
            promise = hasChineseArr[promise];
        } else {
            hasChineseArr[promise] = `TemporaryVariable${hasChineseCount}`;
            promise = `TemporaryVariable${hasChineseCount}`
            hasChineseCount++;
        }
    }
    if (resData.item) {
        promise += '[]'
    }
    return promise;
}
function generateInterfaceName(input: string) {
    input = input.replace('#/definitions/', '').replace(new RegExp('«', "g"), '').replace(new RegExp('»', "g"), '')
    const hasChinese = /[^\u4e00-\u9fa5]+/.test(input);
    if (!hasChinese) {
        if (hasChineseArr[input]) {
            input = hasChineseArr[input];
        } else {
            hasChineseArr[input] = `TemporaryVariable${hasChineseCount}`;
            input = `TemporaryVariable${hasChineseCount}`
            hasChineseCount++;
        }
    }
    return changeText(input);
}


export default function (swaggerUrl: any, args: { out: any; }) {
    if (!swaggerUrl) {
        console.log('必须携带URL地址，如alita-codegen https://xx.x.x/abc/v2/api-docs#/')
        return;
    }
    axios
        .get(swaggerUrl)
        .then(function ({ data }) {
            main(data, {
                outPath: args.out || ''
            })
        })
        .catch(function (error) {
            console.log(error);
        });
}

function main(SwaggerData: { tags?: never[] | undefined; paths: any; definitions: any; }, options: { outPath: any; }) {
    const { tags = [], paths, definitions } = SwaggerData;
    let outPutStr = generateHead(SwaggerData);
    Object.keys(definitions).forEach(defItem => {
        outPutStr += `interface ${generateInterfaceName(defItem)} {\n`;
        const properties = definitions[defItem].properties || {};
        Object.keys(properties).forEach(subDefItem => {
            let defItemStr = "   /**\n";
            defItemStr += `    * @description ${properties[subDefItem].description || ''}\n`
            defItemStr += "    **/\n";
            defItemStr += `    ${subDefItem}: ${generateType(properties[subDefItem])};\n`
            outPutStr += defItemStr;
        })
        outPutStr += '}\n';
    })

    Object.keys(paths).forEach(item => {
        const itemData = paths[item];
        Object.keys(itemData).forEach(subItem => {
            additionalParameters = {};
            const subItemData = itemData[subItem];
            const { summary, description, tags: subTags, responses, parameters = [] } = subItemData;
            const resData = responses['200'].schema;
            const url = changeApi(item);
            const name = generateName(item) + toUpperCase(subItem);
            const params = toUpperCase(name) + 'Query';
            const paramsMethod = subItem === 'get' ? GetMethodString : PostMethodString;
            let itemTargs = subTags || [];
            itemTargs = itemTargs.map((t: string) => {
                tags.forEach((tag: { name: string; description: string; }) => {
                    if (tag.name === t) {
                        t = tag.description;
                    }
                })
                return t;
            })
            const promise = generatePromise(resData);

            let definition = `interface ${params} {\n`
            parameters.map((p: { in: string; description: any; name: any; type: any; }) => {
                if (p.in === 'query') {
                    let pStr = "   /**\n";
                    pStr += `    * @description ${p.description || ''}\n`
                    pStr += "    **/\n";
                    pStr += `    ${p.name}: ${generateType(p)};\n`
                    definition += pStr;
                    Object.keys(additionalParameters).map(ap => {
                        let apStr = "   /**\n";
                        apStr += `    * @description 请求地址中追加的参数\n`
                        apStr += "    **/\n";
                        apStr += `    ${ap}: string;\n`
                        definition += apStr;
                    })
                }
            })
            definition += '}\n';
            const tpl = join(__dirname, '../template/services/http.ts.tpl');
            let tplContent = readFileSync(tpl, 'utf-8');
            tplContent = tplContent
                .replace('<%= InterfaceDefinition %>', definition)
                .replace('<%= FunctionTags %>', JSON.stringify(itemTargs))
                .replace('<%= FunctionSummary %>', summary)
                .replace('<%= FunctionDescription %>', description)
                .replace(new RegExp('<%= FunctionParams %>', "g"), params)
                .replace('<%= FunctionName %>', name)
                .replace('<%= FunctionPromise %>', promise)
                .replace('<%= FunctionUrl %>', url)
                .replace('<%= FunctionParamsMethod %>', paramsMethod)
            outPutStr += tplContent;
        })
    })
    const outPath = options.outPath ? options.outPath : 'out/api.ts';
    outputFileSync(outPath, outPutStr, "utf-8");
    console.log('文件创建完成')
}
