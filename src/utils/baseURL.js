

//请求url
let defaultBaseURL = 'https://power.vermao.com/infiniti';
// let defaultBaseURL = 'https://power.vermao.com/infiniti';
// let defaultBaseURL = 'https://tech.10k.xyz/infiniti';
// let defaultBaseURL = 'https://wechat.natapp4.cc/infiniti';

console.log('apiType', process.env.apiType)

//线上
if(process.env.apiType === 'prod'){
//请求url
    defaultBaseURL = 'https://power.vermao.com/infiniti';
}


export const baseURL = defaultBaseURL;





