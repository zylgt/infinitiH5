import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';


//获取banne轮播图
export async function getBanneImg (params) {
    const url = `/m/common/banner?${qs.stringify(params)}`;
    return request(url,getOptions())
}

//获取科室信息
export async function getOfficeData (params) {
    const url = `/m/depts?${qs.stringify(params)}`;
    return request(url,getOptions())
}

//获取常见疾病
export async function getIllnessData (params) {
    const url = `/m/diseases?${qs.stringify(params)}`;
    return request(url,getOptions())
}

//获取今日出诊医生
export async function getDoctorData (params) {
    const url = `/m/doctors/today?${qs.stringify(params)}`;
    return request(url,getOptions())
}




