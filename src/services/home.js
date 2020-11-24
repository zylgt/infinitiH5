import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';


//获取验证码
export async function getCode (params) {
    const url = `/login/getSmsCode`;
    return request(url,postOptions(params))
}
//登录
export async function login (params) {
    const url = `/login/verifySmsCode`;
    return request(url,postOptions(params))
}
//获取中奖名单
export async function getWinList (params) {
    const url = `/poster/getCurrentRewarder`;
    return request(url,postOptions(params))
}
//获取appid
export async function getAppid (params) {
    const url = `/login/getJsConfig`;
    return request(url,postOptions(params))
}


