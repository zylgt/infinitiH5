import React, { Component } from 'react'
import { connect } from 'dva';
import { Popover, Modal, Menu, Toast, ListView, InputItem,Button,TextareaItem} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'
import { createForm ,formShape } from 'rc-form';
import Socket from '../../components/webSocket';
import DocumentTitle from 'react-document-title'
import { hostURL } from '../../utils/baseURL'
import { getQueryString } from '../../utils/tools'
import {cookieUtils} from '../../utils/tools'
import moment from "moment";
import { pageURL,staticURL } from '../../utils/baseURL'
import { nonceStr,isIOS } from '../../utils/tools'
import wx from 'weixin-js-sdk';

moment.locale('zh-cn');

@connect(({ askchat }) => ({ askchat }))
class AskChat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId:'',
            timestamp:'',
            isShowSend:false,
            isShowButtom:false,
            word:'',
            sendMsg:[],
            historyMsg:[],
            isFinished : false,
            isExpired: false,
            token:'',
            detailInfo:''
        }
        this.taskRemindInterval = null;
    }
    componentWillUnmount(){
        if(this.socket){
            this.socket.onclose({
                msg:'关闭页面'
            })
        }
    }
    componentDidUpdate(){
        this.scrollToBottom();
    }
    componentDidMount(){
        const { dispatch } = this.props;
        let that = this;


        let token = cookieUtils.get('token') || getQueryString('token') || '';
        console.log('token',token)
        if(token){
            cookieUtils.set('token',token)
            this.setState({
                token: token
            })
        }

        let orderId = getQueryString('order_id') || '';
        console.log('orderId',orderId)
        this.setState({
            orderId:orderId
        })

        dispatch({
            type:'askchat/orderDetail',
            payload:{
                orderId:orderId
            },
            callback: this.orderDetailCallback.bind(this)
        })

        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })
        if(isIOS()){
            //     console.log('IOS手机')
            //     alert(window.__wxjs_is_wkwebview)
            //     if (window && window.__wxjs_is_wkwebview == true) {
            //         // this.setState({
            //         //     wkwebview: true
            //         // })
            //     }

            wx.ready(function(){
                wx.hideAllNonBaseMenuItem();
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
            if( getQueryString('token') ){
                //获取appid和签名
                dispatch({
                    type:'patientDescribe/getAppid',
                    payload:{
                        noncestr: nonceStr,
                        timestamp: timestamp,
                        url: window.location.href.split('#')[0]
                    },
                    callback: this.getAppidCallback.bind(this)
                })
            }
        } else {
            console.log('安卓手机')
            this.setState({
                wkwebview:true
            })

            //获取appid和签名
            dispatch({
                type:'patientDescribe/getAppid',
                payload:{
                    noncestr: nonceStr,
                    timestamp: timestamp,
                    url: window.location.href.split('#')[0]
                },
                callback: this.getAppidCallback.bind(this)
            })

        }
    }
    //获取appidcallback
    getAppidCallback(response){
        const { timestamp } = this.state;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: timestamp , // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['chooseImage','uploadImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function(){
            wx.hideAllNonBaseMenuItem();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }
    //订单详情callback
    orderDetailCallback(response){
        console.log('response1----------',response)
        this.setState({
            detailInfo:response.data.data
        })
        let data = response.data.data;
        let { orderId } = this.state;
        this.linkSocket(orderId)
        if(data.status == 'inquiring'){
            // this.linkSocket(orderId)
        }else if(data.status == 'finished'){
            this.setState({
                isFinished:true
            })
        }else if(data.status == 'expired'){
            this.setState({
                isFinished:true,
                isExpired:true
            })
        }

    }

    //链接socket
    linkSocket = (orderId) => {
        console.log('orderId',orderId)
        let that = this;
        let socketUrl = 'ws://'+ hostURL + '/m/order/' + orderId + '/chat/conn';
        //    判断专家是否登录
        this.socket = new Socket({
            socketUrl: socketUrl,
            timeout: 5000,
            socketMessage: (receive) => {
                console.log('socketMessage',JSON.parse(receive.data));  //后端返回的数据，渲染页面
                const { type, data } = JSON.parse(receive.data)
                const { dispatch } = this.props;
                let { sendMsg, historyMsg } = this.state;

                if (type === 'ping') {
                    this.socket.sendMessage({ type: 'pong', 'data': data })
                } else if (type === 'history') {
                    that.setState({
                        historyMsg: data
                    })
                } else if (type === 'message') {

                    if(data.sender_type == "doctor"){
                        historyMsg.push(data)
                        that.setState({
                            historyMsg: historyMsg
                        })
                        return false;
                    }

                    for( let i = 0;i < sendMsg.length ; i++){
                        if(sendMsg[i].content == data.content){
                            sendMsg[i].isSend = true;
                            sendMsg.splice( i ,1);
                            that.setState({
                                sendMsg: sendMsg
                            })
                            historyMsg.push(data)
                            that.setState({
                                historyMsg: historyMsg
                            })
                            break;
                        }
                    }

                } else if (type === 'finished') {
                    that.setState({
                        isFinished: true
                    })
                    this.socket.onclose({
                        msg:'结束问诊'
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
                const data = { type: 'auth', 'data': that.state.token }
                console.log('data', data)
                this.socket.sendMessage(data)
                // 心跳机制 定时向后端发数据
                this.taskRemindInterval = setInterval(() => {
                    // this.socket.sendMessage({ "msgType": 0 })
                }, 30000)
            }
        });
        // 重试创建socket连接
        try {
            this.socket.connection();
        } catch (e) {
            console.log('socket异常')
            // 捕获异常，防止js error
            // donothing
        }
        // this.scrollToBottom();
    }
    //点击加号
    autoWordFocus(){
        this.setState({
            isShowButtom: true,
        });
    }
    //输入框内容变化
    changeWord(val){
        this.setState({
            word: val,
            isShowSend: true
        });
        if(val == ''){
            this.setState({
                isShowSend: false,
            });
        }
    }
    //输入框聚焦
    textareaFocus(){
        this.setState({
            isShowButtom: false,
        });
    }
    //滑动到聊天底部
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }
    //点击提交聊天
    submit = () => {
        const { dispatch } = this.props;
        let { word, orderId, sendMsg } = this.state;

        sendMsg.push({
            type: 'text',
            content: word,
            isSend:false
        })
        this.setState({
            sendMsg: sendMsg
        })
        dispatch({
            type:"askchat/sendMsg",
            payload:{
                order_id: orderId,
                msg:{
                    type: 'text',
                    content: word
                }
            }
        })
        this.setState({
            word:'',
            isShowSend: false
        })
    }
    //判断消息右上角时间
    showTime(item){
        let time = ''
        if(item.updated_at){
            let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            let currentTime = Date.parse(new Date());
            let d_day = Date.parse(new Date(item.updated_at));
            let day = Math.abs(parseInt((d_day - currentTime)/1000/3600/24));//计算日期
            let dateFormat = moment(item.updated_at).format('L') // 日期
            let index = new Date(item.updated_at).getDay() // 星期
            let date = moment(item.updated_at).format('LT'); // 时分
            let hours = new Date(item.updated_at).getHours(); //小时
            //当前时间6分钟前
            let newTime = moment().subtract(6, 'minute');
            if(moment(item.updated_at) < newTime){
                if(day >= 8){
                    time = dateFormat + date
                }else if(day <8 && day >= 2){
                    time = weeks[index] + date
                }else if(day > 0 && day < 2){
                    time = '昨天' + date
                }else{
                    if(hours <= 12){
                        time = '上午' + date
                    }else{
                        time = '下午' + date
                    }
                }
            }
        }
        return (<div className={Styles.list_time}>
            { time }
        </div>);
    }
    //发送图片
    addPatient(type) {
        let that = this;
        let sourceType = [];
        if( type == 'album' ){
            sourceType.push('album')
        }else{
            sourceType.push('camera')
        }
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log('res',res)
                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                that.getPhoneImg(localIds,0,that)
            }
        });
    }
    //根据机型获取可展示图片
    getPhoneImg(localIds,val,that){
        const { dispatch } = this.props;
        const { wkwebview } = this.state;
        const { patientImg } = this.props.askchat;
        let index = val;

        let patientObj = {}
        patientObj.isUpload = false;
        patientObj.serverId = '';
        patientObj.localIds = localIds[index];
        if( wkwebview ){
            patientObj.localUrl = localIds[index];
            patientImg.push(patientObj)
            dispatch({
                type:'askchat/setData',
                payload:{
                    patientImg:patientImg
                }
            })
            this.uploadImg(patientObj)
            if(index + 1 < localIds.length){
                index ++;
                that.getPhoneImg(localIds, index, that)
            }
        }else{
            wx.getLocalImgData({
                localId: localIds[index], // 图片的localID
                success: function (res) {
                    // var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    patientObj.localUrl = res.localData;
                    patientImg.push(patientObj)
                    dispatch({
                        type:'askchat/setData',
                        payload:{
                            patientImg:patientImg
                        }
                    })
                    that.uploadImg(patientObj)
                    if(index + 1 < localIds.length){
                        index ++;
                        that.getPhoneImg(localIds, index, that)
                    }
                }
            });
        }
    }
    //上传图片
    uploadImg(patientObj){
        const { dispatch } = this.props;
        const { patientImg } = this.props.askchat;
        let that = this;
        console.log('patientImg0------',patientImg)
        //上传图片
        wx.uploadImage({
            localId: patientObj.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                let serverId = res.serverId; // 返回图片的服务器端ID
                console.log('serverId',serverId)
                console.log('patientObj',patientObj)
                console.log('patientImg',patientImg)
                for( let index in patientImg ){
                    if(patientObj.localIds == patientImg[index].localIds){
                        patientObj.isUpload = true;
                        patientObj.serverId = serverId;
                        dispatch({
                            type:'askchat/setData',
                            payload:{
                                patientImg: patientImg
                            }
                        })

                        dispatch({
                            type:'askchat/uploadImg',
                            payload:{
                                cat: 'patient_info',
                                media:[ serverId ]
                            },
                            callback: that.uploadCallback.bind(that)
                        })


                    }
                }
            },
            fail:function(res){
                Toast.info('上传失败，请重试',1.5)
            }
        });
    }
    //图片上传callback
    uploadCallback(response){
        const { dispatch } = this.props;
        let { sendMsg, orderId } = this.state;
        let imgUrl = staticURL + response.data.data;
        sendMsg.push({
            type: 'photo',
            content: imgUrl,
            isSend:false
        })
        this.setState({
            sendMsg: sendMsg
        })
        dispatch({
            type:"askchat/sendMsg",
            payload:{
                order_id:orderId,
                msg:{
                    type: 'photo',
                    content: imgUrl
                }
            }
        })
    }

    render() {
        const { getFieldProps } = this.props.form;
        const {
            isShowSend,
            word,
            isShowButtom,
            sendMsg,
            historyMsg,
            isFinished,
            isExpired,
            detailInfo
        } = this.state;

        let doctorName = detailInfo.doctor_name ? detailInfo.doctor_name + '医生' : '医生';

        return (
            <DocumentTitle title={doctorName}>
                <div className={Styles.chat}>

                    <div className={ `${Styles.chat_list} ` }>

                        <div className={Styles.list_time}>14:39</div>

                        {
                            historyMsg && historyMsg.length > 0 ? <div>
                                <div className={Styles.list_item_right}>
                                    <div className={Styles.item_content}>
                                        <span className={Styles.item_icon}></span>
                                        <p>
                                            { historyMsg[0].content }
                                        </p>
                                        {/*<p className={Styles.item_user}>用户 男 27岁</p>*/}
                                        {/*<p>就诊情况：去医院就诊过</p>*/}
                                        {/*<p>确诊疾病：糖尿病</p>*/}
                                        {/*<p>糖尿病史：1年</p>*/}
                                        {/*<p>药物过敏史：无</p>*/}
                                        {/*<p>病情描述：去年去年八月确诊二型糖尿病，现在对血糖的监测以及胰岛素用药频率和剂量有一些疑问</p>*/}
                                        {/*<p className={Styles.item_bottom}>(含图片信息，医生可见)</p>*/}
                                    </div>
                                    <img className={Styles.item_img} src={require('../../assets/head.png')} />
                                </div>

                                <div className={Styles.list_hint}>
                                    <span className={Styles.hint_words}>问诊已开始，本次问诊时间为15分钟</span>
                                    <p className={Styles.hint_line}></p>
                                </div>

                                <div className={Styles.list_start}>
                                    <span>问诊已开始，医生将在这15分钟内只为您一人解答问题，建议不要离开对话框，保持实时沟通。医生的回复仅为建议，具体诊疗需要前往医院进行</span>
                                </div>
                            </div>:''
                        }
                        {
                            historyMsg && historyMsg.length > 0 ?  historyMsg.map((item,index)=>{
                                if( item.type == "notification" || index == 0){
                                    return
                                }
                                return(
                                    <div key={index}>

                                        { this.showTime(item) }

                                        {
                                            item.sender_type === "doctor" && item.type === 'text' ?
                                                <div className={Styles.list_item_left}>
                                                    <img className={Styles.item_img} src={staticURL + detailInfo.icon } />
                                                    <div className={Styles.item_content}>
                                                        <span className={Styles.item_icon}></span>
                                                        <span>{ item.content }</span>
                                                    </div>
                                                </div>
                                                :
                                                <div className={Styles.list_item_right}>
                                                    {
                                                        item.type === 'photo' ?
                                                            <div className={ `${Styles.item_content} ${Styles.item_content_img}`}>
                                                                <img className={Styles.content_img} src={ item.content } alt=""/>
                                                            </div>
                                                            :
                                                            <div className={Styles.item_content}>
                                                                <span className={Styles.item_icon}></span>
                                                                <span>{ item.content }</span>
                                                            </div>
                                                    }
                                                    <img className={Styles.item_img} src={require('../../assets/my_head.png')} />
                                                </div>
                                        }
                                    </div>
                                )
                            }):''
                        }
                        {
                            sendMsg && sendMsg.length > 0 ?  sendMsg.map((item,index)=>{
                                return(
                                    <div key={index}>
                                        {
                                            item.sender_type === "doctor" && item.type === 'text' ?
                                                <div className={Styles.list_item_left}>
                                                    <img className={Styles.item_img} src={staticURL + detailInfo.icon } />
                                                    <div className={Styles.item_content}>
                                                        <span className={Styles.item_icon}></span>
                                                        <span>{ item.content }</span>
                                                    </div>
                                                </div>
                                                :
                                                <div className={Styles.list_item_right}>
                                                    {
                                                        item.type === 'photo' ?
                                                            <div className={ `${Styles.item_content} ${Styles.item_content_img}`}>
                                                                <img className={Styles.content_img} src={ item.content } alt=""/>
                                                            </div>
                                                            :
                                                            <div className={Styles.item_content}>
                                                                {
                                                                    item.isSend ? '' : <img className={Styles.item_loading} src={require('../../assets/loading.gif')} alt=""/>
                                                                }
                                                                <span className={Styles.item_icon}></span>
                                                                <span>{ item.content }</span>
                                                            </div>
                                                    }
                                                    <img className={Styles.item_img} src={require('../../assets/my_head.png')} />
                                                </div>
                                        }
                                    </div>
                                )
                            }):''
                        }

                        {
                            isFinished ? <div>
                                {
                                    isExpired ? <div className={Styles.list_start}>
                                            <span>由于就诊通知后5分钟内您未响应，导致此次就诊作废，请你重新进行预约</span>
                                        </div>
                                        :
                                        <div className={Styles.list_start}>
                                            <span>医生的回复仅为建议，具体诊疗需要前往医院进行</span>
                                        </div>
                                }

                                <div className={Styles.list_hint}>
                                    <span className={Styles.hint_words}>本次问诊已结束</span>
                                    <p className={Styles.hint_line}></p>
                                </div>
                            </div> : ''
                        }


                        <div style={{ float:"left", clear: "both" }}
                             ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    {
                        !isFinished ? <div>
                            <div className={Styles.chat_input}>
                                <TextareaItem
                                    {...getFieldProps('word',{
                                        initialValue:word
                                    })}
                                    autoHeight
                                    placeholder="请输入咨询内容"
                                    className={Styles.input}
                                    ref={el => this.wordFocus = el}
                                    onChange = {(val)=>{this.changeWord(val)}}
                                    onFocus={()=>{this.textareaFocus()}}
                                />
                                {
                                    isShowSend ? <Button type="primary" onClick={()=>{this.submit()}} className={Styles.input_btn}>发送</Button>
                                        :
                                        <img onClick={()=>{this.autoWordFocus()}} className={Styles.input_img} src={require('../../assets/ask_add.png')} alt=""/>

                                }
                            </div>
                            {
                                isShowButtom ? <div className={Styles.chat_buttom}>
                                    <div className={Styles.buttom_item} onClick={()=>{this.addPatient('camera')}}>
                                        <img src={require('../../assets/chat_camera.png')} alt=""/>
                                        <p>拍摄</p>
                                    </div>
                                    <div className={Styles.buttom_item} onClick={()=>{this.addPatient('album')}}>
                                        <img src={require('../../assets/chat_picture.png')} alt=""/>
                                        <p>图片</p>
                                    </div>

                                </div> : ''
                            }
                        </div>:''
                    }

                </div>
            </DocumentTitle>

        )
    }
}


export default createForm()(AskChat);
