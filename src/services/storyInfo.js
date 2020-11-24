import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取故事详情
export async function getStory (params) {
    const url = `poster/findById?${qs.stringify(params)}`;
    return request(url,getOptions())
}
//获取评论列表
export async function getComment (params) {
    const url = `/poster/api/getCommentsByPosterId`;
    return request(url,postOptions(params))
}
//点赞
export async function setPoint (params) {
    const url = `/poster/api/vote`;
    return request(url,postOptions(params))
}
//评论
export async function setComment (params) {
    const url = `/poster/api/comment`;
    return request(url,postOptions(params))
}
//分享
export async function setShare (params) {
    const url = `/poster/api/share`;
    return request(url,postOptions(params))
}




