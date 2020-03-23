import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';


//获取banne轮播图
export async function getBanneImg (params) {
    const url = `/m/common/banner?${qs.stringify(params)}`;
    return request(url,getOptions())
}


