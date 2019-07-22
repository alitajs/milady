/* 示例文件作为插件参考 */
import request from 'umi-request';

interface VisitData {
  /**
   * @description 横轴值
   */
  x: string;
  /**
   * @description 纵轴值
   */
  y: string;
}

interface ApiFormsQuery {
  /**
   * @description token
   */
  type: string;
}

/**
 * @tags 表单接口
 * @summary 表单接口
 * @description 表单：不知道是啥，这就是一个描述
 * @param params ApiFormsQuery
 * @returns {visitData:VisitData}
 */
export async function apiForms(params?: ApiFormsQuery): Promise<VisitData> {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

/**
 * @tags 表单接口
 * @summary 表单接口
 * @description 表单：不知道是啥，这就是一个描述
 * @param params ApiFormsQuery
 * @returns {visitData:VisitData}
 */
export async function menu(params?: ApiFormsQuery): Promise<VisitData> {
  return request('/api/menu', { params });
}
