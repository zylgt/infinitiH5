import { uploadImg, submitStory, submitSend } from '../../../services/upload';
import { Toast } from 'antd-mobile';

export default {
    namespace: 'upload',
    state: {
        userInfo:{},
        url:'',
        videoUrl:'',
        side: 0,
        canvasUrl:'',
        codeUrl:'',
        uploadId:'',
        textWord:'',
        isVideo:0,
        username:'',
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
        //上传图片
        *uploadImg({ payload, callback }, { call, put }) {
            const uploadImgInfo = yield call(uploadImg, payload);
            console.log('uploadImgInfo',uploadImgInfo)
            if( uploadImgInfo && uploadImgInfo.data.code === '1'){
                Toast.hide()
                callback && callback( uploadImgInfo.data.msg )
            }else{
                Toast.fail('网络原因上传失败，建议上传9M以内照片并切换网络环境重试', 1.5);
            }
        },
        //提交
        *submitStory({ payload, callback }, { call, put }) {
            const submitStoryInfo = yield call(submitStory, payload);
            console.log('submitStoryInfo',submitStoryInfo)
            if( submitStoryInfo && submitStoryInfo.data.code === '1'){
                Toast.hide()
                yield put({
                    type: 'setData',
                    payload: {
                        codeUrl: submitStoryInfo.data.msg.code_url,
                        uploadId : submitStoryInfo.data.msg.id,
                        isVideo:  submitStoryInfo.video_url ? 1 : 0,
                        username: submitStoryInfo.data.msg.username,
                    }
                });

                callback && callback('1',submitStoryInfo.data.msg)
            }
            if( submitStoryInfo && submitStoryInfo.data.code === '3003'){
                Toast.hide()
                callback && callback('3003')
            }
        }
        ,
        //提交信件
        *submitSend({ payload, callback }, { call, put }) {
            const submitSendInfo = yield call(submitSend, payload);
            console.log('submitSendInfo',submitSendInfo)
            if( submitSendInfo && submitSendInfo.data.code === '1'){
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
