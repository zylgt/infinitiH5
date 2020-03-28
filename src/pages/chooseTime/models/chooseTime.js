import { getDoctorTime, appointment } from '../../../services/chooseTime';

export default {
    namespace: 'chooseTime',
    state: {
        timeData:{},
        selectTime:{},
        uid:''
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/chooseTime' ) {

                }
            });
        },

    },
    effects: {
        //获取今日医生出诊时间
        *getDoctorTime({ payload, callback }, { call,select, put }){
            const stateChooseDoctor = yield select(state => state.chooseDoctor)

            const response = yield call(getDoctorTime, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        timeData: response.data.data
                    }
                });
            }
        },
        //预约排号
        *appointment({ payload, callback }, { call,select, put }){
            console.log('payload',payload)

            const response = yield call(appointment, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        uid: response.data.data.uid
                    }
                });
            }
            if(response){
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
