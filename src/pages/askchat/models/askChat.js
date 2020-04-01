import { sendMsg, uploadImg, orderDetail } from '../../../services/askChat';

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
        //上传图片
        *uploadImg({ payload, callback }, { call,select, put }){
            const response = yield call(uploadImg, payload);
            console.log('response',response)
            if(response && response.data.code == 200 ){
                callback && callback(response)
            }
        },
        //订单详情
        *orderDetail({ payload, callback }, { call,select, put }){
            const response = yield call(orderDetail, payload);
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