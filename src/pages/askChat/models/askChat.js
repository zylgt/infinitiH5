import { sendMsg } from '../../../services/askChat';

export default {
    namespace: 'askChat',
    state: {
        sendMsg:[],
        historyMsg:[]
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/askChat' ) {

                }
            });
        },

    },
    effects: {
        //获取问诊列表
        *sendMsg({ payload, callback }, { call,select, put }){

            const response = yield call(sendMsg, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
                // yield put({
                //     type: 'setData',
                //     payload: {
                //
                //     }
                // });
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
