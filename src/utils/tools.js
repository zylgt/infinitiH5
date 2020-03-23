'use strict';

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

/**
 * 获取剃度颜色方法
 * @param  {[type]} num        [范围在 0～100 的颜色剃度数]
 * @param  {String} startColor [默认开始颜色]
 * @param  {String} endColor   [默认结束颜色]
 * @return {[type]}            [rbg颜色值]
 */
export function getGradientColor (num, startColor='rgb(94, 195, 149)', endColor='rgb(24, 99, 147)') {
    let startNum = 0;
    let endNum = 100;
    let s = startColor.replace(/rgb\((.*)\)/, '$1').split(',');
    let ss = [].concat(s);
    let e = endColor.replace(/rgb\((.*)\)/, '$1').split(',');
    let b = [1, 1, 1];

    for(let i=0; i<3; i++) {
        e[i] = parseInt(e[i].trim(),0)
        s[i] = parseInt(s[i].trim(),0)
        ss[i] = parseInt(ss[i].trim(),0)
        if(e[i] < s[i]) {
            b[i] = -1;
            let temp = e[i];
            e[i] = s[i];
            s[i] = temp;
        }
    }
    let step = endNum - startNum;
    let rr = (ss[0] + b[0] * (e[0] - s[0]) / step * num).toFixed(0);
    let gg = (ss[1] + b[1] * (e[1] - s[1]) / step * num).toFixed(0);
    let bb = (ss[2] + b[2] * (e[2] - s[2]) / step * num).toFixed(0);
    return 'rgb('+rr+', '+gg+', '+bb+')';
}

// 将数字用逗号分隔，返回一个字符串。注：对小数支持不好
export function getSplitNum (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

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



