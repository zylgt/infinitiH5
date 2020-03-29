import { getDoctor } from '../../../services/chooseDoctor';

export default {
    namespace: 'chooseDoctor',
    state: {
        offset:1,
        doctorData:[]
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/chooseDoctor' ) {
                    dispatch({
                        type: 'setData',
                        payload: {
                            offset: 1,
                            doctorData:[]
                        }
                    });
                }
            });
        },

    },
    effects: {
        //获取今日出诊医生
        *getDoctor({ payload, callback }, { call,select, put }){
            const stateChooseDoctor = yield select(state => state.chooseDoctor)

            const response = yield call(getDoctor, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
                let list = response.data.data.list;
                let doctorData = stateChooseDoctor.doctorData;
                let newDoctorData = [...doctorData,...list]
                yield put({
                    type: 'setData',
                    payload: {
                        doctorData: newDoctorData
                    }
                });
                if(list.length > 0){
                    yield put({
                        type: 'setData',
                        payload: {
                            offset: stateChooseDoctor.offset + 1
                        }
                    });
                }
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
