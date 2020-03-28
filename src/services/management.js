import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取就诊人
export async function getPatient (params) {
    const url = `/m/user/patient?${qs.stringify(params)}`;
    return request(url,getOptions())
}
//保存就诊人
export async function savePatient (params) {
    const url = `/m/patient`;
    return request(url,postOptions(params))
}


