export function stripHttp(object) {
  return JSON.parse(JSON.stringify(object).replace(/http:/gi, ''));
}
