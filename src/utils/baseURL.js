

//请求url
let defaultBaseURL = 'https://apitest-nethospital.yutanglabs.com';
//静态资源
let defaultStaticURL = 'https://statictest-nethospital.yutanglabs.com';
//socket
let defaultHostURL = 'wss://apitest-nethospital.yutanglabs.com';

console.log('apiType', process.env.apiType)

//代谢线上
if(process.env.apiType === 'prod'){
//请求url
    defaultBaseURL = 'https://api.nethospital.yutanglabs.com';
//静态资源
    defaultStaticURL = 'https://static.nethospital.yutanglabs.com';
//socket
    defaultHostURL = 'wss://api.nethospital.yutanglabs.com';
}


export const baseURL = defaultBaseURL;

export const staticURL = defaultStaticURL;

export const hostURL = defaultHostURL;




