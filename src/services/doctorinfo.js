import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取医生列表
export async function getDoctorInfo (params) {
    const url = `/m/doctor/${params.doctor_id}`;
    return request(url,getOptions())
}

//问诊验证
export async function getAskVerify (params) {
    const url = `/m/visit/check?${qs.stringify(params)}`;
    return request(url,getOptions())
}



