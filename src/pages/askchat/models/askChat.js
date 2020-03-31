import { sendMsg, uploadImg } from '../../../services/askChat';

export default {
    namespace: 'askchat',
    state: {
        sendMsg:[],
        patientImg:[]
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/askchat' ) {

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
        *uploadImg({ payload, callback }, { call,select, put }){

            const response = yield call(uploadImg, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
                callback && callback(response)
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
