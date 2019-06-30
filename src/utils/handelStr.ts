export function handelRef(params: string) {
  let str = params.replace('#/definitions/', '');
  str = strToKey(str);
  return str;
}
export function strToKey(params: string) {
  return params
    .replace(new RegExp('«', 'g'), '')
    .replace(new RegExp('»', 'g'), '')
    .replace(new RegExp('-', 'g'), '')
    .replace(new RegExp('（', 'g'), '')
    .replace(new RegExp('）', 'g'), '')
    .replace(new RegExp(' ', 'g'), '')
    .replace(new RegExp('，', 'g'), '')
    .replace(new RegExp(',', 'g'), '')
    .replace(/\(/g, '')
    .replace(/\)/g, '');
}
