import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';


//上传图片
export async function uploadImg (params) {
    const url = `/fileup/uploadBase64`;
    return request(url,postOptions(params))
}
//提交故事
export async function submitStory (params) {
    const url = `/poster/api/create`;
    return request(url,postOptions(params))
}
//提交信件
export async function submitSend (params) {
    const url = `/poster/api/saveMaterial`;
    return request(url,postOptions(params))
}
