import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取医生列表
export async function sendMsg (params) {
    const url = `/m/order/`+ params.order_id +`/chat/send`;
    return request(url,postOptions(params.msg))
}




