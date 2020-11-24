import { getBanneImg, getOfficeData, getIllnessData, getDoctorData } from '../../../services/home';
import {getWinList} from "../../../services/home";
import { Toast } from 'antd-mobile';

export default {
    namespace: 'home',
    state: {
        swipeData:[],
        officeData:[],
        illnessData:[],
        doctorData:[],
        offset:1,
        isPlay:false,
        winList:'',
        isFrist:true,
        isShowVideo: true
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if ( pathname == '/' || pathname == '/home' || pathname == 'q4/home' || pathname == '/hot' || pathname == 'q4/hot') {
                    dispatch({
                        type:'getWinList'
                    })
                }
            });
        },
    },
    effects: {
        //获取中奖列表
        *getWinList({ payload, callback }, { call, select, put }) {
            const getWinListInfo = yield call(getWinList, payload);
            console.log('getWinListInfo',getWinListInfo)
            if( getWinListInfo && getWinListInfo.data.code === '1'){
                Toast.hide()
                yield put({
                    type:'setData',
                    payload:{
                        winList: getWinListInfo.data.msg.img_url
                    }
                })
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
