import request from '../utils/request';
import qs from 'qs';
import { getOptions, postOptions } from '../utils/tools';

//获取用户信息
export async function getUser (params) {
    const url = `/poster/api/getI`;
    return request(url,postOptions(params))
}
//获取用户故事
export async function getUserStory (params) {
    const url = `/poster/api/getMine`;
    return request(url,postOptions(params))
}
//删除用户故事
export async function deleteStory (params) {
    const url = `/poster/api/delete`;
    return request(url,postOptions(params))
}
//修改用户昵称
export async function setUser (params) {
    const url = `/login/api/updateUsername`;
    return request(url,postOptions(params))
}
//提交中奖用户信息
export async function addWin (params) {
    const url = `/poster/api/saveRewardInfo`;
    return request(url,postOptions(params))
}





