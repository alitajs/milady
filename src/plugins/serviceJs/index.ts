import { apiToName } from '../../utils/handelStr';

function main(SwaggerData: { paths: any }) {
  const { paths } = SwaggerData;
  let str = "import { stringify } from 'qs';\nimport request from '@/utils/request';\n";
  Object.keys(paths).forEach(api => {
    Object.keys(paths[api]).forEach(method => {
      if (api !== '/') {
        const { description } = paths[api][method];
        str = str.concat(
          services(
            apiToName(api, method),
            api,
            description && description.replace(/\n/g, ''),
            method,
          ),
        );
      }
    });
  });
  const file = [{ fileName: 'api.js', fileStr: str }];
  return file;
}

function services(name: string, api: string, desc: string, method: string) {
  if (method === 'post') {
    return `\nexport async function ${name}(params) {\n  return request('${api}', {\n    method: 'POST',\n    body: params,\n  });\n} // ${desc}\n`;
  }
  return `\nexport async function ${name}(params) {\n  return request(\`${api}?\${stringify(params)}\`);\n} // ${desc}\n`;
}

export default {
  outPath: 'src/services',
  handelData: main,
};
