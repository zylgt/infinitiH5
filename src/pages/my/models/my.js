import { getUser, getUserStory, deleteStory, setUser,addWin } from '../../../services/my';
import { Toast } from 'antd-mobile';
import {submitStory} from "../../../services/upload";
import {cookieUtils} from "../../../utils/tools";

export default {
    namespace: 'my',
    state: {
        userInfo:{},
        userStory:{},
        story:{},
        isSelect: 1,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/my') {
                    const cookieToken = cookieUtils.get('token') || '';
                    dispatch({
                        type:'getUser',
                        payload:{
                            token: cookieToken
                        }
                    })
                    dispatch({
                        type:'getUserStory',
                        payload:{
                            token: cookieToken
                        }
                    })
                }
            });
        },
    },
    effects: {
        //获取用户信息
        *getUser({ payload, callback }, { call, put }) {
            const getUserInfo = yield call(getUser, payload);
            console.log('getUserInfo',getUserInfo)
            if( getUserInfo && getUserInfo.data.code === '1'){
                yield put({
                    type: 'setData',
                    payload: {
                        userInfo: getUserInfo.data.msg,
                    }
                });
                Toast.hide()
            }
        },
        //获取用户故事
        *getUserStory({ payload, callback }, { call,select, put }) {
            const getUserStoryInfo = yield call(getUserStory, payload);
            console.log('getUserStoryInfo',getUserStoryInfo)
            const isSelect = yield select(state => state.my.isSelect)
            if( getUserStoryInfo && getUserStoryInfo.data.code === '1'){
                let select = getUserStoryInfo.data.msg.myStory
                if(isSelect === 2){
                    select = getUserStoryInfo.data.msg.myVotedStory
                }
                yield put({
                    type: 'setData',
                    payload: {
                        userStory: getUserStoryInfo.data.msg,
                        story: select
                    }
                });
                Toast.hide()
            }
        },
        //删除用户故事
        *deleteStory({ payload, callback }, { call, put }) {
            const deleteStoryInfo = yield call(deleteStory, payload);
            console.log('deleteStoryInfo',deleteStoryInfo)
            if( deleteStoryInfo && deleteStoryInfo.data.code === '1'){
                const cookieToken = cookieUtils.get('token') || '';
                yield put({
                    type:'getUser',
                    payload:{
                        token: cookieToken
                    }
                })
                yield put({
                    type:'getUserStory',
                    payload:{
                        token: cookieToken
                    }
                });
                Toast.hide()
                callback && callback()
            }
        },
    //    修改用户昵称
        *setUser({ payload, callback }, { call, put }) {
            const setUserInfo = yield call(setUser, payload);
            console.log('setUserInfo',setUserInfo)
            if( setUserInfo && setUserInfo.data.code === '1'){
                const cookieToken = cookieUtils.get('token') || '';
                yield put({
                    type:'getUser',
                    payload:{
                        token: cookieToken
                    }
                })
                Toast.hide()
                callback && callback()
            }
        //    昵称重复
            if( setUserInfo && setUserInfo.data.code === '3007'){
                Toast.hide()
                Toast.info('昵称已被占用，请重新输入', 1.5);
            }
        },
    //    提交获奖信息
        *addWin({ payload, callback }, { call, put }) {
            const addWinInfo = yield call(addWin, payload);
            console.log('addWinInfo',addWinInfo)
            if( addWinInfo && addWinInfo.data.code === '1'){
                const cookieToken = cookieUtils.get('token') || '';
                yield put({
                    type:'getUser',
                    payload:{
                        token: cookieToken
                    }
                })
                Toast.hide()
                callback && callback()
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
