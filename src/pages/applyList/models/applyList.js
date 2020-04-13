import { setPatientInfo } from '../../../services/applyList';

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
        // 完善就诊人信息
        *setPatientInfo({ payload, callback }, { call,select, put }){

            const response = yield call(setPatientInfo, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        doctorInfo: response.data.data
                    }
                });
            }
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
