import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';
//获取图片验证码
export async function getImgCode (params) {
    const url = `/m/common/captcha_id?${qs.stringify(params)}`;
    return request(url,getOptions())
}

//校验图片验证码
export async function verifyImgCode (params) {
    const url = `/m/common/captcha/check`;
    return request(url,postOptions(params))
}

//获取手机验证码
export async function getPhoneCode (params) {
    const url = `/m/common/verification?${qs.stringify(params)}`;
    return request(url,getOptions())
}


