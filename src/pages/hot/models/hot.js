import { getWorksList } from '../../../services/hot';
import { Toast } from 'antd-mobile';
import {setPoint, setComment} from "../../../services/storyInfo";

export default {
    namespace: 'hot',
    state: {
        userInfo:{},
        url:'',
        videoUrl:'',
        side: 0,
        canvasUrl:'',
        codeUrl:'',
        uploadId:'',
        swiperItem:[{}],
        startSlide: 0,
        tabList: 1,
        isRefresh:true,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname == '/upload') {

                }
            });
        },
    },
    effects: {
        //获取作品列表
        *getWorksList({ payload, callback }, { call, select, put }) {
            const worksListInfo = yield call(getWorksList, payload);
            console.log('worksListInfo',worksListInfo)
            if( worksListInfo && worksListInfo.data.code === '1'){
                Toast.hide()
                const swiperItem = yield select(state => state.hot.swiperItem)
                let list = worksListInfo.data.msg.list;
                let newList = swiperItem.concat(list)
                yield put({
                    type:'setData',
                    payload:{
                        swiperItem: newList
                    }
                })
            }
        },
        // 点赞
        *setPoint({ payload, callback }, { call, select, put }) {
            const setPointInfo = yield call(setPoint, payload);
            // console.log('setPointInfo',setPointInfo)
            let swiperItem = yield select(state => state.hot.swiperItem)
            if( setPointInfo && setPointInfo.data.code === '1'){
                Toast.hide()
                callback && callback(1)
                for(let i=1;i<swiperItem.length;i++){
                    let vote_count = swiperItem[i].vote_count;
                    if(swiperItem[i].id == payload.poster_id){
                        swiperItem[i].vote_count = vote_count + 1;
                        break;
                    }
                }
                yield put({
                    type: 'setData',
                    payload: {
                        swiperItem: swiperItem
                    }
                });
                //第一次点赞
                if(setPointInfo.data.msg.first == 1){
                    callback && callback(9)
                }
            }
            //超过当天点赞数
            if( setPointInfo && setPointInfo.data.code === '3002'){
                Toast.hide()
                callback && callback(3002)
            }
        },
    //    评论
        *setComment({ payload, callback }, { call, select, put }) {
            const setCommentInfo = yield call(setComment, payload);
            console.log('setCommentInfo',setCommentInfo)
            let swiperItem = yield select(state => state.hot.swiperItem)
            if( setCommentInfo && setCommentInfo.data.code === '1'){
                Toast.hide()
                callback && callback()
                for(let i=1;i<swiperItem.length;i++){
                    let comment_count = swiperItem[i].comment_count;
                    if(swiperItem[i].id == payload.poster_id){
                        swiperItem[i].comment_count = comment_count + 1;
                        break;
                    }
                }
                yield put({
                    type: 'setData',
                    payload: {
                        swiperItem: swiperItem
                    }
                });
                //第一次评论
                if(setCommentInfo.data.msg.first == 1){
                    callback && callback(9)
                }
            }
            if(setCommentInfo && setCommentInfo.data.code === '3008'){
                Toast.hide()
                Toast.info('您提交的内容不符合法律法规，请修改后再提交', 1.5);
            }
        },

    },
    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },
    }
};
