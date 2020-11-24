'use strict';

//微信获取签名随机串
import wx from "weixin-js-sdk";

export const nonceStr = 'wx_hlwyy';
// cookie 工具
export const cookieUtils = {
    get(name) {
        const cookieName=encodeURIComponent(name) + "=";
        const cookieStart = document.cookie.indexOf(cookieName);
        let cookieValue = null;

        if (cookieStart > -1) {
            const cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd > -1) {
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
            } else {
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, document.cookie.length));
            }
        }

        return cookieValue;
    },

    set(name, val, options) {
        if (!name) {
            throw new Error("coolie must have name");
        }
        const enc = encodeURIComponent;
        let parts = [];

        val = (val !== null && val !== undefined) ? val.toString() : "";
        options = options || {};
        parts.push(enc(name) + "=" + enc(val));
        if (options.domain) {
            parts.push("domain=" + options.domain);
        }
        if (options.path) {
            parts.push("path=" + options.path);
        }
        if (options.expires) {
            // 支持毫秒
            if(typeof(options.expires) === 'number') {
                let date = new Date(Date.now() + options.expires);
                parts.push("expires=" + date.toGMTString());
            } else {
                parts.push("expires=" + options.expires.toGMTString());
            }
        }
        if (options.maxAge && typeof options.maxAge === "number") {
            parts.push("max-age=" + options.maxAge);
        }
        if (options.httpOnly) {
            parts.push("HTTPOnly");
        }
        if (options.secure) {
            parts.push("secure");
        }

        document.cookie = parts.join(";");
    },
    delete(name, options) {
        options.expires = new Date(0);
        this.set(name, null, options);
    }
};

//获取url参数
export const getQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let search = decodeURIComponent(window.location.search);
    let r = search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

export const getOptions = () => {
    return {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

export const postOptions = (params) => {
    return {
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/json',
        }
    }
};

export const putOptions = (params) => {
    return {
        method: 'PUT',
        data: params,
        headers: {
            'Content-Type': 'application/json',
        }
    }
};

export const deleteOptions = (params) => {
    return {
        method: 'DELETE',
        ata: params,
        headers: {
            'Content-Type': 'application/json',
        }
    }
};

export const isIOS = () => {
    let isIphone = navigator.userAgent.includes('iPhone')
    let isIpad = navigator.userAgent.includes('iPad')
    return isIphone || isIpad
}

export const isIPhoneX = () => {
    if (window.screen.height >= 812 && window.screen.width >= 375){
        //是iphoneX及以上
        return true
    }else{
        //不是iphoneX及以上
        return false
    }
}
export const isWchat = () => {
    let ua = navigator.userAgent.toLowerCase();
    let isWeixin = ua.indexOf('micromessenger') != -1;
    if (isWeixin) {
        return true;
    }else{
        return false;
    }
}
export const wechatShare = (dispatch,a) =>{
    wx.ready(function(){
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.updateAppMessageShareData({
            title: '『背后的力量』故事无限公司', // 分享标题
            desc: '英菲尼迪倾情创立，更有超多福利等你拿', // 分享描述
            link: 'https://power.vermao.com/q4', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://infiniti-1302663429.cos.ap-beijing.myqcloud.com/share2.png', // 分享图标
            success: function () {
                // 设置成功
            }
        })
        wx.updateTimelineShareData({
            title: '『背后的力量』故事无限公司', // 分享标题
            link: 'https://power.vermao.com/q4', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://infiniti-1302663429.cos.ap-beijing.myqcloud.com/share2.png', // 分享图标
            success: function () {
                // 设置成功
            }
        })
        //开启播放
        if(window.location.pathname === '/q4/welcome' || window.location.pathname === '/q4/storyInfo'){
            dispatch({
                type:'layout/setData',
                payload:{
                    playStatus:'PLAYING',
                }
            })
        }
    });

    wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('error',res)
    });
}



