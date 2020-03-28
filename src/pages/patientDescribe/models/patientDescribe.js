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
            const response = yield call(askVisit, payload.payload.orderInfo);
            console.log('askVisit-response',response)
            callback && callback(response)
            if(response && response.data.code == 200 ){

                if(payload.payload.imgInfo.media.length <= 0){
                    router.push('./applySubmit')
                }else{
                    const response = yield call(uploadImg, payload.payload.imgInfo);
                    console.log('uploadImg-response',response)
                    if(response && response.data.code == 200 ){
                        console.log('response',response)
                        router.push('./applySubmit')
                    }
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
