import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取医生出诊时间
export async function getDoctorTime (params) {
    const url = `/m/doctor/`+params.doctor_id+`/visit_time`;
    return request(url,getOptions())
}

//预约排号
export async function appointment (params) {
    const url = `/m/user/order`;
    return request(url,postOptions(params))
}




