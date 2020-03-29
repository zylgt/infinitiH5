import { isBind } from '../../../services/empty';
import router from 'umi/router';
import 'babel-polyfill'
import { cookieUtils } from '../../../utils/tools'

export default {
    namespace: 'empty',
    state: {
        unionid:'oIguq1ftOPg2ycOClXgtQmDOL2jg',
        uid:'1242032963428814848',
        token:''
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/empty') {
                    console.log('models-empty')
                }
            });
        },
    },
    effects: {
        //判断是否已经注册过
        *isBind({ payload, callback }, { call, put }) {
            const response = yield call(isBind, payload);
            if(response && response.data.code == 200 ){
                const token = response.headers['x-access-token'] || '' ;
                yield put({
                    type: 'setData',
                    payload: {
                        unionid: token
                    }
                });
                cookieUtils.set('token',token)
                let data = response.data.data;
                if(data.bind){
                    yield put({
                        type: 'setData',
                        payload: {
                            unionid:data.unionid
                        }
                    });
                    router.replace('./home')
                }else{
                    yield put({
                        type: 'setData',
                        payload: {
                            unionid:data.unionid
                        }
                    });
                    router.replace('./login')
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
