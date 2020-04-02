import { getImgCode, getPhoneCode,verifyImgCode,sublit } from '../../../services/login';
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import 'babel-polyfill'
import { cookieUtils } from '../../../utils/tools'

export default {
    namespace: 'login',
    state: {
        imgCodeId:'',
        imgCode:'',
        imgCodeError:false,
        phoneCodeError:false, // 短信验证码是否错误
        uid:'',
        phone:'',

    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/login') {
                    console.log('models-login')
                    dispatch({
                        type: 'setData',
                        payload: {
                            imgCode:''
                        }
                    });
                }
            });
        },
    },
    effects: {
        //获取图片验证码
        *getImgCode({ payload, callback }, { call, put }) {
            const response = yield call(getImgCode, payload);
            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        imgCodeId:response.data.data
                    }
                });
                // yield put({
                //     type: 'setData',
                //     payload: {
                //         imgCode:''
                //     }
                // });
            }
        },
        //校验图片验证码
        *verifyImgCode({payload, callback},{call, put }) {
            const response = yield call(verifyImgCode, payload);
            callback && callback(response)
            // if(response && response.data.code == 200 ){
            //     yield put({
            //         type: 'setData',
            //         payload: {
            //             imgCodeError:false
            //         }
            //     });
            // }else{
            //     yield put({
            //         type: 'setData',
            //         payload: {
            //             imgCodeError:true
            //         }
            //     });
            //     yield put({
            //         type: 'getImgCode',
            //         payload: {}
            //     });
            // }
        },
        //获取手机验证码
        *getPhoneCode({ payload, callback }, { call, put }) {
            const response = yield call(getPhoneCode, payload);
            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        isSendPhoneCode:true
                    }
                });
                Toast.success('验证码发送成功', 1.5);
            }
        },
        //登录
        *sublit({ payload, callback }, { call, put }) {
            console.log('payload',payload)
            const response = yield call(sublit, payload);
            if(response && response.data.code == 200 ){
                const token = response.headers['x-access-token'] || '' ;
                cookieUtils.set('token',token)
                yield put({
                    type: 'setData',
                    payload: {
                        uid:response.data.data.uid,
                        phone:response.data.data.phone,
                    }
                });
                router.replace('./home')
            }else{
                yield put({
                    type: 'setData',
                    payload: {
                        phoneCodeError:true
                    }
                });
                yield put({
                    type: 'getImgCode',
                    payload: {}
                });
            }
        },
    },
    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },
    }
};
