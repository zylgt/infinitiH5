import {cookieUtils} from "../utils/tools";
import router from 'umi/router';
import { getCode, login, getAppid } from '../services/home';
import { Toast } from 'antd-mobile';

export default {
    namespace: 'layout',
    state: {
        sendMsg:[],
        historyMsg:[],
        isSocket:false,
        orderNo:'',
        playStatus:'STOPPED',
        showLogin: false,
        token:'',
        isLoginSuccess: false
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {

            });
        },
    },
    effects: {
        //获取验证码
        *getCode({ payload, callback }, { call, put }) {
            const getCodeInfo = yield call(getCode, payload);
            console.log('getCodeInfo',getCodeInfo)
            if( getCodeInfo && getCodeInfo.data.code === '1'){
                Toast.info('发送成功', 1);
            }
        },
        //登录
        *login({ payload, callback }, { call, put }) {

            const loginInfo = yield call(login, payload);
            console.log('loginInfo',loginInfo)
            if( loginInfo && loginInfo.data.code === '1'){
               let token = loginInfo.data.msg.token
                cookieUtils.set('token',token)
                yield put({
                    type: 'setData',
                    payload: {
                        token: token,
                        showLogin: false,
                        isLoginSuccess: true
                    }
                });
                yield put({
                    type:'home/setData',
                    payload:{
                        isShowVideo: true
                    }
                })
                yield put({
                    type:'my/getUser',
                    payload:{
                        token: token
                    }
                })
                yield put({
                    type:'my/getUserStory',
                    payload:{
                        token: token
                    }
                })
                // router.push('./upload')
            }
            if(loginInfo && loginInfo.data.code === '1011'){
                callback && callback()
            }
        },
        //获取appid和签名
        *getAppid({payload, callback}, { call,select, put }){

            const response = yield call(getAppid, payload);
            // console.log('response',response)

            if(response && response.data.code === '1' ){
                callback && callback(response.data.msg)
            }
        }

    },
    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    },

};
