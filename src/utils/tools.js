'use strict';

//微信获取签名随机串
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
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
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



