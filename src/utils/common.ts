export function isUrl(params: string) {
  const routeReg = /^https?:\/\/[^/:]+(:\d*)?(\/#)?([^?]*)/;
  return routeReg.test(params);
}
