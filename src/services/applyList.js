import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取医生列表
export async function setPatientInfo (params) {
    const url = `/m/patient/past`;
    return request(url,postOptions(params))
}




