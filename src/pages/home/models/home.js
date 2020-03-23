import { getBanneImg } from '../../../services/home';
import router from 'umi/router';

export default {
    namespace: 'home',
    state: {

    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/home'||pathname == '/') {
                    dispatch({
                        type: 'getBanneImg',
                    });
                }
            });
        },
    },
    effects: {
        //获取banne轮播图
        *getBanneImg({ payload, callback }, { call, put }) {
            const response = yield call(getBanneImg, payload);

            if(response && response.code == 200 ){
                yield put({
                    type: 'setData',
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
        }
    },

};
