import request from 'umi-request';
interface ResultWrapperListResultPlaystationGamePrice {
    /**
    * @description
    **/
    code: number;
    /**
    * @description
    **/
    data: undefined;
    /**
    * @description
    **/
    message: string;
}
interface ListResultPlaystationGamePrice {
    /**
    * @description
    **/
    list: [];
    /**
    * @description
    **/
    size: number;
}
interface PlaystationGamePrice {
    /**
    * @description
    **/
    created_at: string;
    /**
    * @description
    **/
    id: string;
    /**
    * @description
    **/
    name: string;
    /**
    * @description
    **/
    non_plus_discount_percentage: number;
    /**
    * @description
    **/
    non_plus_user_price: number;
    /**
    * @description
    **/
    plus_discount_percentage: number;
    /**
    * @description
    **/
    plus_user_price: number;
    /**
    * @description
    **/
    region: string;
    /**
    * @description
    **/
    sku_id: string;
}
interface {id}GetQuery {
    /**
    * @description region
    **/
    region: string;
}


/**
 * @tags ["Playstation Controller"]
 * @summary 根据游戏Id获取游戏价格曲线
 * @description undefined
 * @param params {id}GetQuery
 */
export async function {id}Get(params?: {id}GetQuery): Promise<ResultWrapperListResultPlaystationGamePrice> {
    return request('/api/v1/games/price/{id}', {
    params
  });
}
