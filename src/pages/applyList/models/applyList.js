import { getDoctorInfo } from '../../../services/doctorinfo';

export default {
    namespace: 'applyList',
    state: {
        illData:[],
        step:1
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/applyList' ) {

                }
            });
        },

    },
    effects: {
        //获取今日出诊医生
        // *getDoctorInfo({ payload, callback }, { call,select, put }){
        //
        //     const response = yield call(getDoctorInfo, payload);
        //     console.log('response',response)
        //
        //     if(response && response.data.code == 200 ){
        //         yield put({
        //             type: 'setData',
        //             payload: {
        //                 doctorInfo: response.data.data
        //             }
        //         });
        //     }
        // }
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
