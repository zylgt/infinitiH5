import React, { Component } from 'react'
import { connect } from 'dva';
import { Button,TextareaItem} from 'antd-mobile';
import Styles from './index.less';
import { createForm } from 'rc-form';
import DocumentTitle from 'react-document-title'
import { staticURL } from '../../utils/baseURL'
import { nonceStr,isIOS,isIPhoneX,getQueryString,cookieUtils } from '../../utils/tools'
import wx from 'weixin-js-sdk';
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import linkSocket from '../../components/linkSocket'
import moment from "moment";

moment.locale('zh-cn');

@connect(({ askchat, layout, ask }) => ({ askchat, layout, ask }))
class AskChat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId:'',
            timestamp:'',
            isShowSend:false,
            isShowButtom:false,
            word:'',
            isFinished : false,
            isExpired: false,
            token:'',
            detailInfo:'',
            timeIndex:1,
            isPush: false, //是否是从推送消息进入
            isFocus:true,
            time:0,
            askType:true,
        }
        this.taskRemindInterval = null
        this.scrollBottom = null
        this.setIntervalTime = null
    }
    componentWillUnmount(){
        if(this.socket){
            this.socket.onclose({
                msg:'关闭页面'
            })
        }
        //顶部进度条开启
        NProgress.start()

        clearInterval(this.scrollBottom)
        clearInterval(this.setIntervalTime)
    }
    componentDidUpdate(){
        // this.scrollToBottom();
    }
    componentDidMount(){
        const { dispatch } = this.props;
        const { orderNo } = this.props.layout;
        let that = this;

        // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE1ODcwMzM0MjksInR5cGUiOiJ1c2VyIiwidWlkIjoiMTI1MDczMjg1NTM1NzYwNzkzNiJ9.Ybxm3JTPkp2qSeJxgXwC7lAsmVMC8CAWwrlOPCi7ZOw'
        let token = cookieUtils.get('token') || getQueryString('token') || '';
        // console.log('token',token)
        if(token){
            cookieUtils.set('token',token)
            this.setState({
                token: token
            })
        }
        //判断是否是从推送消息过来
        if(getQueryString('source') != 'list'){
            this.setState({
                isPush: true
            })
        }

        let orderId = getQueryString('order_id') || '';
        // console.log('orderId',orderId)
        this.setState({
            orderId:orderId
        })

        //是否置空数据
        dispatch({
            type:'layout/setData',
            payload:{
                sendMsg:[],
                historyMsg:[]
            }
        })

        //订单详情
        dispatch({
            type:'askchat/orderDetail',
            payload:{
                orderId:orderId
            },
            callback: this.orderDetailCallback.bind(this)
        })
        //患者进入聊天室
        dispatch({
            type:"askchat/patientJoin",
            payload:{
                order_id:orderId,
            }
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

        let i = 0;
        this.scrollBottom = setInterval(function () {
            i++;
            that.scrollToBottom();
            // console.log('i',i)
            if(i==3){
                clearInterval(that.scrollBottom)
            }
        },600)


        //监听页面大小变化
        window.addEventListener('resize', that.resize.bind(this))

        if(isIOS()) {
            document.body.addEventListener('focusin', () => {
                //软键盘弹出的事件处理
                this.scrollToBottom()

            })
            document.body.addEventListener('focusout', () => {
                //软键盘收起的事件处理
                this.scrollToBottom()
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
    //监听页面大小变化
    resize(){
        this.scrollToBottom()
    }
    //订单详情callback
    orderDetailCallback(response){
        // console.log('response1----------',response)
        const { dispatch } = this.props;
        const { isSocket, orderNo } = this.props.layout;
        const that = this;
        this.setState({
            detailInfo:response.data.data
        })
        let data = response.data.data;
        let { orderId } = this.state;

        linkSocket(that, orderId,this.scrollToBottom)

        //判断图文、视频
        if(data.type == 1){
            this.setState({
                askType:false
            })
        }

        if(data.status == 'pending' || data.status == 'inquiring'){

            // 开启计时
            this.setIntervalTime = setInterval(function () {
                const { sendMsg, historyMsg } = that.props.layout;
                const { time } = that.state;
                let newMsg = historyMsg.concat(sendMsg);
                if(time == 0){
                    for(let i = 0;i < newMsg.length; i++){
                        if(newMsg[i].sender_type == 'user' && newMsg[i].type == 'notification'){
                            let nowTime = parseInt( moment().valueOf() / 1000 ) - parseInt( moment(newMsg[i].created_at).valueOf() / 1000 )

                            that.setState({
                                time: nowTime
                            })
                            break;
                        }
                    }
                }else{
                    that.setState({
                        time: time + 1
                    })
                }
            },1000)

        }else if(data.status == 'finished'){
            this.setState({
                isFinished:true,
                time: 0
            })
            setTimeout(function () {
                if(that.socket){
                    that.socket.onclose({
                        msg:'已完成'
                    })
                }
            },5000)

            clearInterval(this.setIntervalTime)
            this.scrollToBottom();

        }else if(data.status == 'expired'){
            this.setState({
                isFinished:true,
                isExpired:true,
                time: 0
            })
            setTimeout(function () {
                if(that.socket){
                    that.socket.onclose({
                        msg:'已逾期'
                    })
                }
            },5000)

            clearInterval(this.setIntervalTime)
            this.scrollToBottom();
        }

    }
    //点击加号
    autoWordFocus(){
        if(this.state.isShowButtom){
            this.setState({
                isShowButtom: false,
            });
            this.customFocusInst.focus()
        }else{
            this.setState({
                isShowButtom: true,
            });
        }
    }
    //输入框内容变化
    changeWord(val){
        let str = val.replace(/[\r\n]/g,"")
        if(str == ''){
            this.setState({
                word: val,
                isShowSend: false
            });
            return
        }
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
            isShowButtom: false
        });
        this.scrollToBottom();
    }
    //滑动到聊天底部
    scrollToBottom = () => {
        let that = this;
        setTimeout(function () {
            if(that.messagesEnd){
                that.messagesEnd.scrollIntoView({ behavior: "auto" });
            }
        },300)
    }
    //点击提交聊天
    submit = () => {
        const { dispatch } = this.props;
        let { word, orderId } = this.state;
        let { sendMsg } = this.props.layout;

        if(word == '' || word.length < 1 ){
            return false
        }
        sendMsg.push({
            type: 'text',
            content: word,
            isSend:false
        })
        dispatch({
            type:'layout/setData',
            payload:{
                sendMsg: sendMsg,
            }
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
        this.customFocusInst.focus()
        this.scrollToBottom();
    }
    //判断消息时间
    showTime(item){

        let time = '';
        let created_time = item.created_at;
        if(created_time){
            let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            let currentTime = Date.parse(new Date(moment().format('L')));
            let d_day = Date.parse(new Date(moment(created_time).format('L')));
            let day = Math.abs(parseInt((d_day - currentTime)/1000/3600/24));//计算日期
            let dateFormat = moment(created_time).format('L'); // 日期
            let index = moment(created_time).format('d'); // 星期
            let date = moment(created_time).format('LT'); // 时分
            let hours = moment(created_time).hours(); //小时

            //判断剩余3分钟
            if(item.showRemain){
                return (
                    <div className={Styles.list_start}>
                        <span>剩余问诊时间：3分钟</span>
                    </div>
                );
            }
            if(item.showTime){

                if(day >= 8){
                    time = dateFormat +' '+ date
                }else if(day <8 && day >= 2){
                    time = weeks[index] +' '+ date
                }else if(day > 0 && day < 2){
                    time = '昨天 ' + date
                }else{
                    if(hours <= 12){
                        time =  '上午 '+date
                    }else{
                        time =  '下午 '+date
                    }
                }

                return (
                    <div className={Styles.list_time}>
                        { time }
                    </div>
                );
            }
        }
    }
    //发送图片
    addPatient(type) {
        const { dispatch } = this.props;
        let that = this;
        let sourceType = [];
        if( type == 'album' ){
            sourceType.push('album')
        }else{
            sourceType.push('camera')
        }
        dispatch({
            type:'askchat/setData',
            payload:{
                patientImg: []
            }
        })
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // console.log('res',res)
                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                that.getPhoneImg(localIds,0,that)
                dispatch({
                    type:'askchat/setData',
                    payload:{
                        patientImg:[]
                    }
                })
            }
        });
    }
    //根据机型获取可展示图片
    getPhoneImg(localIds,index,that){

        const { dispatch } = this.props;
        const { wkwebview } = this.state;
        const { patientImg } = this.props.askchat;
        let { sendMsg } = this.props.layout;

        let patientObj = {};
        patientObj.isUpload = false; // 是否开始上传
        patientObj.serverId = ''; // 上传完成id
        patientObj.localId = localIds[index]; // 图片本地id
        patientObj.type = 'photo';
        patientObj.isSend = false;

        if( wkwebview ){
            patientObj.localUrl = localIds[index]; // 不同机型预览地址

            patientImg.push(patientObj)
            sendMsg.push(patientObj)

            dispatch({
                type:'layout/setData',
                payload:{
                    sendMsg: sendMsg,
                }
            })

            dispatch({
                type:'askchat/setData',
                payload:{
                    patientImg:patientImg
                }
            })
            if(index+1 < localIds.length){
                index++ ;
                that.getPhoneImg(localIds,index,that)

            }else{
                that.uploadImg(0,that)
            }
        }else{
            wx.getLocalImgData({
                localId: localIds[index], // 图片的localID
                success: function (res) {
                    // var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    patientObj.localUrl = res.localData; // 不同机型预览地址

                    patientImg.push(patientObj)
                    sendMsg.push(patientObj)

                    dispatch({
                        type:'layout/setData',
                        payload:{
                            sendMsg: sendMsg,
                        }
                    })

                    dispatch({
                        type:'askchat/setData',
                        payload:{
                            patientImg:patientImg
                        }
                    })
                    if(index+1 < localIds.length){
                        index++ ;
                        that.getPhoneImg(localIds,index,that)
                    }else{
                        that.uploadImg(0,that)
                    }
                },
                fail:function(res){
                    if(index+1 < localIds.length){
                        index++ ;
                        that.getPhoneImg(localIds,index,that)
                    }else{
                        that.uploadImg(0,that)
                    }
                }
            });
        }

    }
    //上传图片
    uploadImg(index,that){
        const { dispatch } = this.props;
        const { patientImg } = this.props.askchat;

        // console.log('patientImg',patientImg)

        //上传图片
        wx.uploadImage({
            localId: patientImg[index].localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                let serverId = res.serverId; // 返回图片的服务器端ID
                // console.log('serverId',serverId)

                patientImg[index].isUpload = true;
                patientImg[index].serverId = serverId;

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

                if(index + 1 < patientImg.length){
                    index++;
                    that.uploadImg(index, that)
                }

            },
            fail:function(res){
                if(index + 1 < patientImg.length){
                    index++;
                    that.uploadImg(index, that)
                }
            }
        });

    }
    //图片上传callback
    uploadCallback(response){
        const { dispatch } = this.props;
        const { patientImg } = this.props.askchat;
        let { sendMsg } = this.props.layout;
        let { orderId } = this.state;
        let imgUrl = response.data.data[0];
        let serverId = response.data.media[0];

        // console.log('uploadCallback-sendMsg',sendMsg)

        for(let i=0;i < patientImg.length;i++){
            if(patientImg[i].serverId == serverId){
                patientImg[i].imgUrl = response.data.data[0];
            }
            for(let k=0;k < sendMsg.length;k++){
                if( sendMsg[k].localId && patientImg[i].localId == sendMsg[k].localId){
                    sendMsg[k].content = response.data.data[0];
                    sendMsg[k].serverId = patientImg[i].serverId;
                    this.scrollToBottom();
                }
            }

        }
        dispatch({
            type:'askchat/setData',
            payload:{
                patientImg: patientImg
            }
        })

        dispatch({
            type:'layout/setData',
            payload:{
                sendMsg: sendMsg,
            }
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
    //患者信息展示
    patientInfo(params){
        let temp = params.split(/[\n,]/g);
        return(
            temp && temp.length >0 ? temp.map((item,index)=>{
                if(item == ''){
                    return('')
                }
                if(index == 0){
                    return(
                        <p className={Styles.item_user} key={index}> {item} </p>
                    )
                }else if(index == temp.length && item.indexOf('含图片信息，医生可见') >= 0){
                    return(
                        <p className={Styles.item_bottom} key={index}> {item} </p>
                    )
                }else{
                    return(
                        <p key={index}>{item}</p>
                    )
                }

            }):''
        )
    }
    //点击聊天界面
    clickChat(){
        if(this.state.isShowButtom){
            this.setState({
                isShowButtom: false,
            });
        }
    }
    render() {
        const { getFieldProps } = this.props.form;
        const {
            isShowSend,
            word,
            isShowButtom,
            isFinished,
            isExpired,
            detailInfo,
            isFocus,
            isPush,
            time,
            askType
        } = this.state;

        let { sendMsg, historyMsg } = this.props.layout;
        // console.log('detailInfo',detailInfo)

        let doctorName = detailInfo.doctor_name ? detailInfo.doctor_name + '医生' : '医生';

        return (
            <DocumentTitle title={doctorName}>
                <div className={Styles.chat}>
                    {
                        time != 0 && !isFinished ?
                            <div className={ `${Styles.chat_time} ${parseInt(time/60) >= 12 ? '' : Styles.chat_time_default }` }>
                                已就诊时间
                                {
                                    parseInt(time/60) < 10 ?
                                        '0' + parseInt(time/60) : parseInt(time/60)
                                }分
                                {
                                    parseInt(time%60) < 10 ?
                                        '0' + parseInt(time%60) : parseInt(time%60)
                                }秒
                            </div> : ''
                    }

                    <div  className={ `my_chat_list ${Styles.chat_list}`} onClick={()=>{this.clickChat()}} ref={el => this.chat_list = el}>

                        { historyMsg && historyMsg.length > 0 ? this.showTime( historyMsg[0] ) : '' }

                        {
                            historyMsg && historyMsg.length > 0 ? <div>
                                <div className={Styles.list_item_right}>
                                    <div className={Styles.item_content}>
                                        <img className={Styles.item_icon} src={require('../../assets/chat_right.png')} alt=""/>
                                        { this.patientInfo(historyMsg[0].content) }
                                    </div>
                                    <img className={Styles.item_img} src={require('../../assets/my_head.png')} />
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
                                                <div>
                                                    {
                                                        item.content == '' ? '' :
                                                            <div className={Styles.list_item_left}>
                                                                {
                                                                    detailInfo.doctor_icon ? <img className={Styles.item_img} src={staticURL + detailInfo.doctor_icon } /> : ''
                                                                }
                                                                <div>
                                                                    {
                                                                        detailInfo.doctor_name?
                                                                            <div className={Styles.item_name}>
                                                                                {detailInfo.doctor_name}-{detailInfo.doctor_title}
                                                                            </div>:''
                                                                    }
                                                                    <div className={Styles.item_content}>
                                                                        <img className={Styles.item_icon} src={require('../../assets/chat_left.png')} alt=""/>
                                                                        <span>{ item.content }</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>
                                                :
                                                <div>
                                                    {
                                                        item.content == '' ? '' :
                                                            <div className={Styles.list_item_right}>
                                                                {
                                                                    item.type === 'photo' ?
                                                                        <div className={ `${Styles.item_content} ${Styles.item_content_img}`}>
                                                                            {
                                                                                item.content ? <img className={Styles.content_img} src={ staticURL + item.content } alt=""/> : ''
                                                                            }
                                                                        </div>
                                                                        :
                                                                        <div className={Styles.item_content}>
                                                                            <img className={Styles.item_icon} src={require('../../assets/chat_right.png')} alt=""/>
                                                                            <span>{ item.content }</span>
                                                                        </div>
                                                                }
                                                                <img className={Styles.item_img} src={require('../../assets/my_head.png')} />
                                                            </div>
                                                    }
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
                                        { this.showTime(item) }
                                        {
                                            item.sender_type === "doctor" && item.type === 'text' ?
                                                <div>
                                                    {
                                                        item.content == '' ? '' :
                                                            <div className={Styles.list_item_left}>
                                                                {
                                                                    detailInfo.doctor_icon ? <img className={Styles.item_img} src={staticURL + detailInfo.doctor_icon } /> : ''
                                                                }
                                                                <div>
                                                                    {
                                                                        detailInfo.doctor_name?
                                                                            <div className={Styles.item_name}>
                                                                                {detailInfo.doctor_name}-{detailInfo.doctor_title}
                                                                            </div>:''
                                                                    }
                                                                    <div className={Styles.item_content}>
                                                                        <img className={Styles.item_icon} src={require('../../assets/chat_left.png')} alt=""/>
                                                                        <span>{ item.content }</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>
                                                :
                                                <div>
                                                    {
                                                        item.content == '' ? '' :
                                                            <div className={Styles.list_item_right}>
                                                                {
                                                                    item.type === 'photo' ?
                                                                        <div className={ `${Styles.item_content} ${Styles.item_content_img}`}>
                                                                            {
                                                                                item.isSend ? '' : <img className={Styles.item_loading} src={require('../../assets/loading.gif')} alt=""/>
                                                                            }
                                                                            <img className={Styles.content_img} src={ item.localUrl } alt=""/>
                                                                        </div>
                                                                        :
                                                                        <div className={Styles.item_content}>
                                                                            {
                                                                                item.isSend ? '' : <img className={Styles.item_loading} src={require('../../assets/loading.gif')} alt=""/>
                                                                            }
                                                                            <img className={Styles.item_icon} src={require('../../assets/chat_right.png')} alt=""/>
                                                                            <span>{ item.content }</span>
                                                                        </div>
                                                                }
                                                                <img className={Styles.item_img} src={require('../../assets/my_head.png')} />
                                                            </div>
                                                    }
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

                        !isFinished && askType ?
                            <div>
                                <div className={ `${Styles.chat_input} ${isFocus && isIOS() && isIPhoneX()  && isPush ? Styles.chat_input_push : ''}` }>

                                    <TextareaItem
                                        {...getFieldProps('word',{
                                            initialValue:word
                                        })}
                                        autoHeight
                                        placeholder="请输入咨询内容"
                                        className={Styles.input}
                                        ref={el => this.customFocusInst = el}
                                        onChange = {(val)=>{this.changeWord(val)}}
                                        onFocus={()=>{this.textareaFocus()}}
                                        // onBlur={()=>{this.textareaBlur()}}
                                    />
                                    {
                                        isShowSend ? <Button type="primary" onClick={()=>{this.submit()}} className={Styles.input_btn}>发送</Button>
                                            :
                                            <img onClick={() => this.autoWordFocus()} className={Styles.input_img} src={require('../../assets/ask_add.png')} alt=""/>

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
