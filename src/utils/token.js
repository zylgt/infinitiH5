/**
 * Copyright(c) 2016 iHealth, All Rights Reserved.
 * Author: xuzw
 */

import { cookieUtils } from './tools';

export default {
    getToken() {
        let token;
        const user = cookieUtils.get('userData');
        const user_obj = JSON.parse(user);
        if(user_obj && user_obj.token) {
            token = user_obj.token;
        }
        return token;
    }
}
