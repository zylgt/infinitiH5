import { getUserInfo } from '../../../services/my';
import router from 'umi/router';
export default {
    namespace: 'my',
    state: {
        userInfo:{}
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/my') {
                    console.log('models-my')
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
            console.log('response',response)
            if( response && response.data.code == 200){
                yield put({
                    type: 'setData',
                    payload: {
                        userInfo:response.data.data
                    }
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
