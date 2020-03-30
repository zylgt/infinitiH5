import { uploadImg, getAppid, askVisit } from '../../../services/patientDescribe';
import router from 'umi/router';

export default {
    namespace: 'patientDescribe',
    state: {
        val:'',
        patientImg:[],
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
        //问诊申请
        *askVisit({ payload, callback }, { call,select, put }){
            console.log('payload',payload)



            const response = yield call(uploadImg, payload.payload.imgInfo);
            console.log('uploadImg-response',response)
            if(response && response.data.code == 200 ){
                let orderInfo = payload.payload.orderInfo;
                orderInfo.images = response.data.data;

                const askVisitResponse = yield call(askVisit, orderInfo );
                console.log('askVisit-response',askVisitResponse)

                callback && callback(askVisitResponse)
                if(askVisitResponse && askVisitResponse.data.code == 200 ){
                    router.push('./applySubmit')
                }
            }


        },
        //获取appid和签名
        *getAppid({payload, callback}, { call,select, put }){

            const response = yield call(getAppid, payload);
            console.log('response',response)

            if(response && response.data.code == 200 ){
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
