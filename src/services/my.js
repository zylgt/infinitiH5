import request from '../utils/request';
import qs from 'qs';
//获取图片验证码
export async function getDoctorValue (params) {
    const url = `/m/common/captcha_id?${qs.stringify(params)}`;
    return request(url)
}