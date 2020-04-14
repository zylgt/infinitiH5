import { setPatientSurvey } from '../../../services/survey';
import router from 'umi/router';
import { Toast } from 'antd-mobile';

export default {
    namespace: 'survey',
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
        *setPatientSurvey({ payload, callback }, { call,select, put }){
            Toast.loading('Loading...', 30, () => {
                console.log('Load complete !!!');
            },true);
            const response = yield call(setPatientSurvey, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
                Toast.hide()
                router.push('./patientDescribe')
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
