/**
 * 把$ref字段处理成definitions里面的键
 * @param params
 */
export function handelRef(params: string) {
  let str = params.replace('#/definitions/', '');
  str = strToKey(str);
  return str;
}

/**
 * @dec 将字符串转成js合法变量
 * @param params 需要转成合法变量的字符串
 */
export function strToKey(params: string) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/; // 匹配中文、字母、数字
  if (reg.test(params)) {
    return params;
  }
  if (params) {
    return params.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
  }
  console.log('strToKey执行异常，参数为空');
  return params;
}

export function apiToName(api: string, method?: string) {
  const name = strToKey(wordToHump(api, '/'));
  return method ? name + method.toLocaleUpperCase() : name;
}

export function wordToHump(params: string, delimiter: string) {
  return `${params
    .split(delimiter)
    .map((item, index) => {
      if (item) {
        if (index > 1) {
          const arr = item.split('');
          arr[0] = arr[0].toLocaleUpperCase();
          return arr.join('');
        }
      }
      return item;
    })
    .join('')}`;
}
