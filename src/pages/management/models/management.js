import { getPatient, savePatient } from '../../../services/management';

export default {
    namespace: 'management',
    state: {
        uid: '', //就诊人ID
        name: '', //姓名
        card_id: '' //身份证号
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/management' ) {
                    dispatch({
                        type:'getPatient'
                    })
                }
            });
        },

    },
    effects: {
        //获取就诊人
        *getPatient({ payload, callback }, { call,select, put }){

            const response = yield call(getPatient, payload);
            console.log('response',response)

            if( response && response.data.code == 200 ){
                yield put({
                    type:'setData',
                    payload:{
                        uid: response.data.data.uid, //就诊人ID
                        name: response.data.data.name, //姓名
                        card_id: response.data.data.card_id //身份证号
                    }
                })
            }
        },
        //保存就诊人
        *savePatient({ payload, callback }, { call,select, put }){

            const response = yield call(savePatient, payload);
            console.log('response',response)

            if( response && response.data.code == 200 ){
                yield put({
                    type:'setData',
                    payload:{
                        uid: response.data.data.uid, //就诊人ID
                        name: response.data.data.name, //姓名
                        card_id: response.data.data.card_id //身份证号
                    }
                })
            }
            if( response && response.data.code >= 200){
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