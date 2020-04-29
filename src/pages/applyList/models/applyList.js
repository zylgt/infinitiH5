import { setPatientInfo } from '../../../services/applyList';
import router from 'umi/router';
import { Toast } from 'antd-mobile';

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
            Toast.loading('正在保存...', 30, () => {
                console.log('正在保存...');
            },true);
            const response = yield call(setPatientInfo, payload);
            // console.log('response',response)

            if(response && response.data.code == 200 ){
                yield put({
                    type:'management/setData',
                    payload:{
                        past:true,
                    }
                })
                Toast.hide()
                router.push('./survey')
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
