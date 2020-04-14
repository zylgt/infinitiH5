import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//设置疫情调查
export async function setPatientSurvey (params) {
    const url = `/m/patient/epidemic`;
    return request(url,postOptions(params))
}




