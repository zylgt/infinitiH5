import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';


//获取作品列表
export async function getWorksList (params) {
    const url = `/poster/list`;
    return request(url,postOptions(params))
}



