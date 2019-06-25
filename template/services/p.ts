
// "/api/forms": {
//     "post": {
//       "tags": ["表单接口"],
//       "summary": "表单接口 ",
//       "description": "表单：不知道是啥，这就是一个描述",
//       "operationId": "apiFormsPOST",
//       "consumes": ["application/json"],
//       "produces": ["*/*"],
//       "parameters": [
//         { "name": "token", "in": "header", "description": "token", "required": false, "type": "string" },
//         { "name": "type", "in": "query", "description": "类型", "required": true, "type": "string" }
//       ],
//       "responses": { "200": { "description": "OK", "schema": { "$ref": "#/definitions/AnalysisData" } } }
//     }
//   }
// "definitions": {
//     "AnalysisData": {
//       "visitData": {
//         "x": { "type": "string", "description": "横轴值" },
//         "y": { "type": "string", "description": "纵轴值" }
//       }
//     }
//   }
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

interface ApiFormsResponse {
    visitData: VisitData;
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
