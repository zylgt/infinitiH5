

//请求url
let defaultBaseURL = 'http://api.nethospital.yutanglabs.com';
//静态资源
let defaultStaticURL = 'http://static.nethospital.yutanglabs.com';
//socket
let defaultHostURL = 'ws://api.nethospital.yutanglabs.com';

console.log('apiType', process.env.apiType)

//代谢线上
if(process.env.apiType === 'prod'){
//请求url
    defaultBaseURL = 'https://api.nethospital.tjdxb.com';
//静态资源
    defaultStaticURL = 'https://static.nethospital.tjdxb.com';
//socket
    defaultHostURL = 'wss://api.nethospital.tjdxb.com';
}


export const baseURL = defaultBaseURL;

export const staticURL = defaultStaticURL;

export const hostURL = defaultHostURL;




