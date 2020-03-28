import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取医生列表
export async function getDoctor (params) {
    const url = `/m/doctors?${qs.stringify(params)}`;
    return request(url,getOptions())
}




