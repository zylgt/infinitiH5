import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取用户登录信息
export async function getUserInfo (params) {
    const url = `/m/user?${qs.stringify(params)}`;
    return request(url,getOptions())
}

//设置用户声音
export async function setVoice (params) {
    const url = `/m/user/config`;
    return request(url,postOptions(params))
}

