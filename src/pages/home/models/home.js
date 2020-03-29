import { getBanneImg, getOfficeData, getIllnessData, getDoctorData } from '../../../services/home';

export default {
    namespace: 'home',
    state: {
        swipeData:[],
        officeData:[],
        illnessData:[],
        doctorData:[],
        offset:1,

    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/' || pathname == '/home' ) {

                    dispatch({
                        type: 'setData',
                        payload:{
                            doctorData:[],
                            offset:1
                        }
                    });

                    dispatch({
                        type: 'getBanneImg',
                    });
                    dispatch({
                        type: 'getOfficeData',
                    });
                    dispatch({
                        type: 'getIllnessData',
                    });
                    dispatch({
                        type: 'getDoctorData',
                        payload:{
                            offset:1,
                            limit:20
                        }
                    });

                }
            });
        },
    },
    effects: {
        //获取banne轮播图
        *getBanneImg({ payload, callback }, { call, put }) {
            const response = yield call(getBanneImg, payload);
            // console.log('response',response)
            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        swipeData:response.data.data
                    }
                });
            }
        },
        //获取科室信息
        *getOfficeData({ payload, callback }, { call, put }){
            const response = yield call(getOfficeData, payload);
            // console.log('response',response)
            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        officeData:response.data.data
                    }
                });
            }
        },
        //获取常见疾病信息
        *getIllnessData({ payload, callback }, { call, put }){
            const response = yield call(getIllnessData, payload);
            // console.log('response',response)
            if(response && response.data.code == 200 ){
                yield put({
                    type: 'setData',
                    payload: {
                        illnessData:response.data.data
                    }
                });
            }
        },
        //获取今日出诊医生
        *getDoctorData({ payload, callback }, { call,select, put }){
            const stateHome = yield select(state => state.home)

            const response = yield call(getDoctorData, payload);
            // console.log('response',response)

            if(response && response.data.code == 200 ){
                let list = response.data.data.list;
                let doctorData = stateHome.doctorData;
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
                            offset: stateHome.offset + 1
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
