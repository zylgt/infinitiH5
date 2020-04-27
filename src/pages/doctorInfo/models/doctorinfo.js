import { getDoctorInfo, getAskVerify } from '../../../services/doctorinfo';

export default {
    namespace: 'doctorInfo',
    state: {
        doctorInfo:{}
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/doctorInfo' ) {
                    dispatch({
                        type: 'setData',
                        payload: {
                            doctorInfo: {}
                        }
                    });
                }
            });
        },

    },
    effects: {
        //获取今日出诊医生
        *getDoctorInfo({ payload, callback }, { call,select, put }){

            const response = yield call(getDoctorInfo, payload);
            // console.log('response',response)

            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        doctorInfo: response.data.data
                    }
                });
            }
        },
        //问诊验证
        *getAskVerify({ payload, callback }, { call,select, put }){

            const response = yield call(getAskVerify, payload);
            // console.log('response',response)

            if(response){
                callback && callback(response)
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
