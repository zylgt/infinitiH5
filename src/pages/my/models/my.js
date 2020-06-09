import { getUserInfo, setVoice } from '../../../services/my';
import { Toast } from 'antd-mobile';

export default {
    namespace: 'my',
    state: {
        userInfo:{}
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/my') {
                    dispatch({
                        type:'getUserInfo'
                    })
                }
            });
        },
    },
    effects: {
        *getUserInfo({ payload, callback }, { call, put }) {
            const response = yield call(getUserInfo, payload);
            // console.log('response',response)
            if( response && response.data.code == 200){
                yield put({
                    type: 'setData',
                    payload: {
                        userInfo:response.data.data
                    }
                });
            }
        },
        *setVoice({ payload, callback }, { call, put }) {
            const response = yield call(setVoice, payload);
            // console.log('response',response)
            if( response && response.data.code == 200){
                yield put({
                    type: 'getUserInfo'
                });
            }else{
                if( payload.voice ){
                    Toast.info('开启声音失败！')
                }else{
                    Toast.info('关闭声音失败！')
                }
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
