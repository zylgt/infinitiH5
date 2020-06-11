import { getAskList } from '../../../services/ask';

export default {
    namespace: 'ask',
    state: {
        askList:[],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/ask' ) {
                    //获取用户信息，判断声音用
                    dispatch({
                        type:'my/getUserInfo'
                    })
                }
            });
        },

    },
    effects: {
        //获取问诊列表
        *getAskList({ payload, callback }, { call,select, put }){

            const response = yield call(getAskList, payload);
            // console.log('response',response)

            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        askList: response.data.data
                    }
                });
                if(callback){
                    callback(response)
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
        }
    },

};
