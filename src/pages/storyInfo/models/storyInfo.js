import {getStory, getComment, setPoint, setComment, setShare} from '../../../services/storyInfo';
import { Toast } from 'antd-mobile';
import {submitStory} from "../../../services/upload";
import {cookieUtils} from "../../../utils/tools";

export default {
    namespace: 'info',
    state: {
        storyInfo:{},
        comment:{},
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/storyInfo') {
                    dispatch({
                        type: 'setData',
                        payload: {
                            storyInfo: {}
                        }
                    })
                }
            });
        },
    },
    effects: {
        //获取用户信息
        *getStory({ payload, callback }, { call,select, put }) {
            const getStoryInfo = yield call(getStory, payload);
            console.log('getStoryInfo-----',getStoryInfo)
            if( getStoryInfo && getStoryInfo.data.code === '1'){
                Toast.hide()
                yield put({
                    type: 'setData',
                    payload: {
                        storyInfo: getStoryInfo.data.msg,
                    }
                });
                callback && callback(getStoryInfo.data.msg)
            }
        },
    //    获取评论
        *getComment({ payload, callback }, { call, put }) {
            const getCommentInfo = yield call(getComment, payload);
            console.log('getCommentInfo',getCommentInfo)
            if( getCommentInfo && getCommentInfo.data.code === '1'){
                Toast.hide()
                yield put({
                    type: 'setData',
                    payload: {
                        comment: getCommentInfo.data.msg,
                    }
                });
                callback && callback()
            }
        },
        // 点赞
        *setPoint({ payload, callback }, { call, select, put }) {
            const setPointInfo = yield call(setPoint, payload);
            const storyInfo = yield select(state => state.info.storyInfo)
            console.log('setPointInfo',setPointInfo)
            console.log('storyInfo',storyInfo)
            if( setPointInfo && setPointInfo.data.code === '1'){
                Toast.hide()
                storyInfo.vote_count++
                yield put({
                    type: 'setData',
                    payload: {
                        storyInfo: storyInfo
                    }
                });
                callback && callback(1)
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
            if( setCommentInfo && setCommentInfo.data.code === '1'){
                Toast.hide()
                yield put({
                    type:'info/getComment',
                    payload:{
                        token: payload.token,
                        poster_id: payload.poster_id,
                        page:1,
                        page_size:100
                    },
                    callback: callback
                })
                yield put({
                    type:'info/getStory',
                    payload:{
                        id: payload.poster_id
                    },
                })
                // callback && callback()
            }
            if(setCommentInfo && setCommentInfo.data.code === '3008'){
                Toast.hide()
                Toast.info('您提交的内容不符合法律法规，请修改后再提交', 1.5);
            }
        },
        //    记录分享
        *setShare({ payload, callback }, { call, select, put }) {
            const setShareInfo = yield call(setShare, payload);
            console.log('setShareInfo',setShareInfo)
            let swiperItem = yield select(state => state.hot.swiperItem)
            if( setShareInfo && setShareInfo.data.code === '1'){

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
