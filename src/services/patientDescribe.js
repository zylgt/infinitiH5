import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//问诊申请
export async function askVisit (params) {
    const url = `/m/visit`;
    return request(url,postOptions(params))
}
//上传图片
export async function uploadImg (params) {
    const url = `/m/common/download_wx_file`;
    return request(url,postOptions(params))
}
//获取appid
export async function getAppid (params) {
    const url = `/m/common/signature?${qs.stringify(params)}`;
    return request(url,getOptions())
}