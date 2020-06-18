import Socket from '../webSocket';
import { hostURL } from '../../utils/baseURL'
import { getQueryString,cookieUtils } from '../../utils/tools'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import moment from "moment";
moment.locale('zh-cn');

export default function linkSocket(that, status, orderId, callback) {

    let remain_time='', created_time='';
//判断是否展示时间
    const isShowTime = (type) => {

        const { dispatch } = that.props;
        const { historyMsg, sendMsg } = that.props.layout;

        if(historyMsg.length > 0){
            if(created_time == ''){
                created_time = historyMsg[0].created_at;
            }
            if(remain_time == ''){
                remain_time = historyMsg[0].created_at;
            }
        }else{
            if(created_time == ''){
                created_time = sendMsg[0].created_at;
            }
            if(remain_time == ''){
                remain_time = sendMsg[0].created_at;
            }
        }


        if(type == 'message' && sendMsg.length > 0){

            for(let i = 0 ;i< sendMsg.length;i++){

                let newTime = (moment(created_time).valueOf())/1000 ;
                let showThree = (moment(remain_time).valueOf())/1000 ;

                if( (moment(sendMsg[i].created_at).valueOf())/1000 - showThree >= 720 ){
                    remain_time = moment(sendMsg[i].created_at).add(1,'year').format('YYYY-MM-DD HH:mm:ss');
                    sendMsg[i].showRemain = true;
                    continue
                }

                if( (moment(sendMsg[i].created_at).valueOf())/1000 - newTime >= 360 ){

                    created_time =  sendMsg[i].created_at  ;
                    sendMsg[i].showTime = true;

                    callback && callback()
                }
            }
            dispatch({
                type:'layout/setData',
                payload:{
                    sendMsg:sendMsg
                }
            })
        }
        if(type == 'history' && historyMsg.length > 0){

            historyMsg[0].showTime = true;

            for(let i = 1 ;i<historyMsg.length;i++){

                let newTime = (moment(created_time).valueOf())/1000 ;
                let showThree = (moment(remain_time).valueOf())/1000 ;

                if( (moment(historyMsg[i].created_at).valueOf())/1000 - showThree >= 720 ){
                    remain_time = moment(historyMsg[i].created_at).add(1,'year').format('YYYY-MM-DD HH:mm:ss');
                    historyMsg[i].showRemain = true;
                    continue
                }

                if( (moment(historyMsg[i].created_at).valueOf())/1000 - newTime >= 360 ){

                    created_time = historyMsg[i].created_at  ;
                    historyMsg[i].showTime = true

                }

            }

            dispatch({
                type:'layout/setData',
                payload:{
                    historyMsg:historyMsg
                }
            })

        }

    }

    //链接socket
    // console.log('orderId',orderId)
    let socketUrl = hostURL + '/m/order/'+ orderId +'/chat/conn';
    //    判断专家是否登录
    that.socket = new Socket({
        socketUrl: socketUrl,
        timeout: 5000,
        socketMessage: (receive) => {
            console.log('socketMessage',JSON.parse(receive.data));  //后端返回的数据，渲染页面
            const { type, data } = JSON.parse(receive.data)
            const { dispatch } = that.props;
            let { sendMsg, historyMsg, orderNo } = that.props.layout;
            const { askList } = that.props.ask;

            if(window.location.pathname == '/askchat') {
                let array = historyMsg.concat(sendMsg);
                let readArray = [];
                for (let i = 0; i < array.length; i++) {
                    if (!array[i].readed_at && array[i].type != "notification" && array[i].sender_type == "doctor") {
                        readArray.push(array[i].uid)
                        array[i].readed_at = moment().format('YYYY-MM-DD HH:mm:ss');
                    }
                }
                if (readArray.length > 0) {
                    that.socket.sendMessage({type: 'read_message', 'data': readArray})
                }
            }

            if (type === 'ping') {
                that.socket.sendMessage({ type: 'pong', 'data': data })

                if(window.location.pathname == '/askchat'){

                    let newTime = Date.parse(remain_time) ;
                    if(data - newTime > 730000){
                        sendMsg.push({
                            uid: "",
                            sender_type: "user",
                            type: "text",
                            content: "",
                            readed_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                            showRemain:false,
                            showTime:false
                        })
                        dispatch({
                            type:'layout/setData',
                            payload:{
                                sendMsg: sendMsg
                            }
                        })
                        setTimeout(function () {
                            isShowTime('message')
                        },300)
                    }

                }

            } else if (type === 'history') {
                dispatch({
                    type:'layout/setData',
                    payload:{
                        historyMsg: data
                    }
                })

                isShowTime('history')

                callback && callback()

            } else if (type === 'message') {

                if(window.location.pathname != '/askchat'){
                    if(data.sender_type == "user"){
                        data.isSend = true;
                        sendMsg.push(data)
                        dispatch({
                            type:'layout/setData',
                            payload:{
                                sendMsg: sendMsg
                            }
                        })
                        callback && callback()
                    }
                    for(let i = 0;i< askList.length; i++){
                        if(orderNo == askList[i].uid){
                            askList[i].waited_at = moment().format('YYYY-MM-DD HH:mm:ss');
                            dispatch({
                                type:'ask/setData',
                                payload:{
                                    askList: askList
                                }
                            })
                            break;
                        }
                    }
                }

                if(data.sender_type == "doctor"){
                    if(window.location.pathname == '/askchat'){
                        that.socket.sendMessage({ type: 'read_message', 'data': [data.uid] })
                        data.readed_at = moment().format('YYYY-MM-DD HH:mm:ss');
                    }
                    data.isSend = true;
                    sendMsg.push(data)
                    dispatch({
                        type:'layout/setData',
                        payload:{
                            sendMsg: sendMsg
                        }
                    })
                    if(status){
                        dispatch({
                            type:'layout/setData',
                            payload:{
                                playStatus:'PLAYING',
                            }
                        })
                    }
                    if (window.navigator.vibrate) {
                        //vibrate 1 second
                        window.navigator.vibrate([300]);
                    } else if (window.navigator.webkitVibrate) {
                        window.navigator.webkitVibrate([300]);
                    }

                    setTimeout(function () {
                        isShowTime('message')
                    },300)

                    callback && callback()



                    return false;
                }

                for( let i = 0;i < sendMsg.length ; i++){

                    if( sendMsg[i].content == data.content){
                        sendMsg[i].isSend = true;
                        sendMsg[i].created_at = data.created_at;
                        dispatch({
                            type:'layout/setData',
                            payload:{
                                sendMsg: sendMsg
                            }
                        })
                    }
                }

                setTimeout(function () {
                    isShowTime('message')
                },300)



            } else if (type === 'finished') {
                that.setState({
                    isFinished: true
                })
                that.socket.onclose({
                    msg:'结束问诊'
                })
                dispatch({
                    type:'ask/getAskList'
                })

                callback && callback()

            }else if(type == 'expired'){
                dispatch({
                    type:'ask/getAskList'
                })
                dispatch({
                    type:'layout/setData',
                    payload:{
                        sendMsg:[],
                        historyMsg:[]
                    }
                })
            }
        },
        socketClose: (msg) => {
            console.log('socketClose',msg);//关闭连接
        },
        socketError: () => {
            console.log('连接建立失败');
        },
        socketOpen: () => {
            console.log('连接建立成功');
            let token = cookieUtils.get('token') || getQueryString('token') || '';
            const data = { type: 'auth', 'data': token }

            // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE1OTE4NjA2ODAsInR5cGUiOiJ1c2VyIiwidWlkIjoiMTI3MDk4MTkyOTkyNzE4NDM4NCJ9.9Z7647_Aqq3FGRsWqV91Ep7NeKohH-cW8mF7lJ7URlo'
            // const data = { type: 'auth', 'data': token }
            that.socket.sendMessage(data)
            // 心跳机制 定时向后端发数据
            that.taskRemindInterval = setInterval(() => {
                // this.socket.sendMessage({ "msgType": 0 })
            }, 30000)
        }
    });
    // 重试创建socket连接
    try {
        that.socket.connection();
    } catch (e) {
        console.log('socket异常')
        // 捕获异常，防止js error
        // donothing
    }

}
