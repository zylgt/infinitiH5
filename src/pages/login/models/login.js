import { getImgCode, getPhoneCode,verifyImgCode } from '../../../services/login';
import router from 'umi/router';
import { Toast } from 'antd-mobile';


export default {
    namespace: 'login',
    state: {
        imgCodeId:'',
        imgCodeError:false
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/login') {
                    console.log('models-login')
                }
            });
        },
    },
    effects: {
        //获取图片验证码
        *getImgCode({ payload, callback }, { call, put }) {
            const response = yield call(getImgCode, payload);

            if(response && response.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        imgCodeId:response.data
                    }
                });
            }
        },
        //校验图片验证码
        *verifyImgCode({payload, callback},{call, put }) {
            const response = yield call(verifyImgCode, payload);

            if(response && response.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        imgCodeError:false
                    }
                });
            }else{
                yield put({
                    type: 'setData',
                    payload: {
                        imgCodeError:true
                    }
                });
            }
        },
        //获取手机验证码
        *getPhoneCode({ payload, callback }, { call, put }) {
            // const response = yield call(getPhoneCode, payload);
            console.log('callback',callback)
            let response = {
                code:200
            }
            if(response && response.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        isSendPhoneCode:true
                    }
                });
                Toast.success('验证码发送成功', 1.5);
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
