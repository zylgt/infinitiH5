import { reg } from 'services/home';
import router from 'umi/router';
export default {
    namespace: 'class1',
    state: {
        'key':'',
        'name':''
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/home'||pathname == '/') {
                    // dispatch({
                    //     type: 'reg',
                    // });
                }
            });
        },
    },
    effects: {
        *reg({ payload, callback }, { call, put }) {
            const response = yield call(reg, payload);
            yield put({
                type: 'setData',
                payload: response.data
            });
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
