import request from '../utils/request';
import qs from 'qs';
import { getOptions } from '../utils/tools';
//微信是否已经绑定
export async function isBind (params) {
    const url = `/m/user/check?${qs.stringify(params)}`;
    return request(url,getOptions())
}
