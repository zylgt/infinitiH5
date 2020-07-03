

//请求url
let defaultBaseURL = 'https://apitest-nethospital.yutanglabs.com';
//静态资源
let defaultStaticURL = 'https://statictest-nethospital.yutanglabs.com';
//socket
let defaultHostURL = 'wss://apitest-nethospital.yutanglabs.com';
//接听url 三一照护
let defaultPhoneURL = 'http://mp.weixin.qq.com/s?__biz=MzI1NTQxNDc0NQ==&mid=100002449&idx=1&sn=0376c27c235e040526b65b064fbc4199&chksm=6a3712275d409b3174669e1f7e74ec461841a2f7b201a573de3e8264da01abbf24f5d1b08167#rd';

console.log('apiType', process.env.apiType)

//代谢线上
if(process.env.apiType === 'prod'){
//请求url
    defaultBaseURL = 'https://api.nethospital.yutanglabs.com/v2';
//静态资源
    defaultStaticURL = 'https://static.nethospital.yutanglabs.com';
//socket
    defaultHostURL = 'wss://api.nethospital.yutanglabs.com/v2';
    //接听url 代谢
    defaultPhoneURL = 'http://mp.weixin.qq.com/s?__biz=MzU5Nzg4ODU4Mg==&mid=100000002&idx=1&sn=13045828db81425834bc378d036dea3e&chksm=7e4dda2b493a533daf2c6700dadf79f33fb84479a9bb3efa0e765c84332ea3f1263f72027d96#rd';
}


export const baseURL = defaultBaseURL;

export const staticURL = defaultStaticURL;

export const hostURL = defaultHostURL;

export const phoneURL = defaultPhoneURL;




