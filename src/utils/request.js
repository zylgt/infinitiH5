import axios from 'axios'
import Token from './token'
import { notification, Button } from 'antd'
import { Toast } from 'antd-mobile';

// console.log('API_ENV',process.env.API_ENV)

let baseURL = 'https://api.nethospital.yutanglabs.com';
// if(process.env.API_ENV === 'dev'){
//     baseURL = 'http://39.107.76.157';
// }else if(process.env.API_ENV === 'online'){
//     baseURL = 'https://glucose.yutanglabs.com';
// }else if(process.env.API_ENV === 'gray'){
//     baseURL = 'https://gray.glucose.yutanglabs.com'
// }else{
//     baseURL = 'http://39.107.76.157';
// }

axios.defaults.timeout = 2000000;
axios.defaults.baseURL = baseURL;
const codeMessage = {
    400: '参数错误',
    401: '权限错误',
    402: '手机号不合法',
    403: '身份证号不合法',
    404: '图形验证码错误',
    405: '手机验证码错误',
    406: '手机验证码过期',
    407: '账户不存在',
    408: '密码错误',
    409: '微信未绑定',
    410: '账号已存在',
    411: '操作失败',
    412: '就诊人已存在',
    413: '就诊人不存在',
    414: '订单不存在',

    500: '网络不稳定，请稍后重试',

}
//验证状态
function checkStatus(response) {
    // alert(JSON.stringify(response) )
    console.log('response',response)
    if (response.data.code >= 200 && response.data.code < 300) {
        return response;
    }
    const errorText = codeMessage[response.data.code] || response.data.msg;

    Toast.info(errorText, 1.5, null, false);
    const error = new Error(errorText);
    error.name = response.data.code;
    error.response = response.data;
    throw error;
}

export default function request(url, options) {
    // const token = Token.getToken() || '';
    let obj = {
        baseURL: baseURL
    }

    // if (token) {
    //     obj = {
    //         baseURL: baseURL,
    //         headers: { 'x-access-token': token }
    //     }
    // }

    const httpProvider = axios.create(obj)

    //request拦截器
    // httpProvider.interceptors.response.use((response) => {
    //     // console.log('response',response)
    //     alert(JSON.stringify(response) )
    //     return response
    // }, (error) => {
    //     return Promise.reject(error)
    // })
    // alert(JSON.stringify(url) )
    return httpProvider({
        url: url,
        ...options
    })
    .then(checkStatus)
    .then((response) => {
        return response.data
    }).catch((error) => {
            alert(JSON.stringify(error) )
        return error
    })
}
