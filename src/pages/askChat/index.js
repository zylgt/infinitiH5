import React, { Component } from 'react'
import { connect } from 'dva';
import { Popover, Modal, Menu, Toast, ListView, InputItem,Button,TextareaItem} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'
import { createForm ,formShape } from 'rc-form';
import Socket from '../../components/webSocket';
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { hostURL } from '../../utils/baseURL'
import { getQueryString } from '../../utils/tools'
import {cookieUtils} from '../../utils/tools'
// const token = cookieUtils.get('token') || '';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE1ODUxODg4MjEsInR5cGUiOiJ1c2VyIiwidWlkIjoiMTI0MjAzMjk2MzQyODgxNDg0OCJ9.dGE0W5jzBUluDhx05zuy-IuUFIo1uLJ_4t9PyKtRiyk';
console.log('token',token)

@connect(({ askChat }) => ({ askChat }))
class AskChat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId:'',
            timestamp:'',
            isShowSend:false,
            isShowButtom:false,
            word:'',
            sendMsg:[]
        }
        this.taskRemindInterval = null;
    }
    componentWillUnmount(){
        this.socket.onclose({
            msg:'关闭页面'
        })
    }
    componentDidUpdate(){
        this.scrollToBottom();
    }
    componentDidMount(){
        const { dispatch } = this.props;
        let that = this;
        let orderId = getQueryString('orderId') || '';
        console.log('orderId',orderId)
        this.setState({
            orderId:orderId
        })
        setTimeout(function () {
            that.linkSocket(orderId)
        },30)

        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })
        //获取appid和签名
        // dispatch({
        //     type:'patientDescribe/getAppid',
        //     payload:{
        //         noncestr: nonceStr,
        //         timestamp: timestamp,
        //         url: pageURL + '/askChat.js'
        //     },
        //     callback: this.getAppidCallback.bind(this)
        // })

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

    //链接socket
    linkSocket(orderId){
        let that = this;
        const { dispatch } = this.props;
        let socketUrl = 'ws://'+ hostURL + '/m/order/' + orderId + '/chat/conn';
        //    判断专家是否登录
        this.socket = new Socket({
            socketUrl: socketUrl,
            timeout: 5000,
            socketMessage: (receive) => {
                console.log('socketMessage',JSON.parse(receive.data));  //后端返回的数据，渲染页面
                const { type, data } = JSON.parse(receive.data)
                if (type === 'ping') {
                    this.socket.sendMessage({ type: 'pong', 'data': data })
                } else if (type === 'history') {
                    dispatch({
                        type: 'askChat/setData',
                        payload: {
                            historyMsg: data
                        }
                    })
                } else if (type === 'message') {

                    let { sendMsg } = this.state;
                    console.log('sendMsg',sendMsg)
                    if(data.sender_type == "doctor"){
                        sendMsg.push(data)
                        that.setState({
                            sendMsg: sendMsg
                        })
                        return false;
                    }
                    sendMsg.reverse();
                    for( let i = 0;i < sendMsg.length ; i++){
                        if(sendMsg[i].content == data.content){
                            sendMsg[i].isSend = true;
                            break;
                        }
                    }
                    sendMsg.reverse();
                    that.setState({
                        sendMsg: sendMsg
                    })

                    // dispatch({
                    //     type: 'initiate/getMessage',
                    //     payload: {
                    //         message: data
                    //     }
                    // })
                } else if (type === 'finished') {
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
                const data = { type: 'auth', 'data': token }
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
            type:"askChat/sendMsg",
            payload:{
                order_id: orderId,
                msg:{
                    type: 'text',
                    content: word
                }
            }
        })
        // dispatch({
        //     type:"askChat/sendMsg",
        //     payload:{
        //         order_id: orderId,
        //         msg:{
        //             type: 'photo',
        //             content: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585632209806&di=d87707f8979ce2a9df1e10fed92ec42f&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F78%2F52%2F01200000123847134434529793168.jpg'
        //         }
        //     }
        // })
       this.setState({
            word:''
        })
    }

    render() {
        const { getFieldProps } = this.props.form;
        const { isShowSend, word, isShowButtom, sendMsg} = this.state;
        const { historyMsg } = this.props.askChat;
        let doctorName = 'xx医生';

        // console.log('historyMsg',historyMsg)

        return (
            <DocumentTitle title={doctorName}>
                <div className={Styles.chat}>

                    <div className={ `${Styles.chat_list} ` }>

                        <div className={Styles.list_time}>14:39</div>

                        <div className={Styles.list_item_right}>
                            <div className={Styles.item_content}>
                                <span className={Styles.item_icon}></span>
                                <p className={Styles.item_user}>用户 男 27岁</p>
                                <p>就诊情况：去医院就诊过</p>
                                <p>确诊疾病：糖尿病</p>
                                <p>糖尿病史：1年</p>
                                <p>药物过敏史：无</p>
                                <p>病情描述：去年去年八月确诊二型糖尿病，现在对血糖的监测以及胰岛素用药频率和剂量有一些疑问</p>
                                <p className={Styles.item_bottom}>(含图片信息，医生可见)</p>
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

                        {
                            historyMsg && historyMsg.length > 0 ?  historyMsg.map((item,index)=>{
                                return(
                                    <div key={index}>

                                        {/*<div className={Styles.list_time}>14:39</div>*/}

                                        {
                                            item.sender_type === "doctor" && item.type === 'text' ?
                                                <div className={Styles.list_item_left}>
                                                    <img className={Styles.item_img} src={require('../../assets/head.png')} />
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
                                                    <img className={Styles.item_img} src={require('../../assets/head.png')} />
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

                                        {/*<div className={Styles.list_time}>14:39</div>*/}

                                        {
                                            item.sender_type === "doctor" && item.type === 'text' ?
                                                <div className={Styles.list_item_left}>
                                                    <img className={Styles.item_img} src={require('../../assets/head.png')} />
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
                                                    <img className={Styles.item_img} src={require('../../assets/head.png')} />
                                                </div>
                                        }
                                    </div>
                                )
                            }):''
                        }

                        {/*<div className={Styles.list_item_left}>*/}
                        {/*<img className={Styles.item_img} src={require('../../assets/head.png')} />*/}
                        {/*<div className={Styles.item_content}>*/}
                        {/*<span className={Styles.item_icon}></span>*/}
                        {/*<span>问一下现在怎么用药的？血糖多少？血肌酐有变化吗？</span>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className={Styles.list_time}>14:39</div>*/}

                        {/*<div className={Styles.list_item_right}>*/}
                        {/*<div className={Styles.item_content}>*/}
                        {/*<img className={Styles.item_loading} src={require('../../assets/loading.gif')} alt=""/>*/}
                        {/*<span className={Styles.item_icon}></span>*/}
                        {/*<span>是的发送地方句句说到附近卡是江东父老了看时间到了附近阿克索德积分卡就是来看风景啊就是风景啊就是地方大家发卡就是到了风景阿斯顿发几阿斯顿减肥了</span>*/}
                        {/*</div>*/}
                        {/*<img className={Styles.item_img} src={require('../../assets/head.png')} />*/}
                        {/*</div>*/}

                        {/*<div className={Styles.list_item_right}>*/}
                        {/*<div className={ `${Styles.item_content} ${Styles.item_content_img}`}>*/}
                        {/*<img className={Styles.item_loading} src={require('../../assets/loading.gif')} alt=""/>*/}
                        {/*<img className={Styles.content_img} src={require('../../assets/home_swipe01.png')} alt=""/>*/}
                        {/*</div>*/}
                        {/*<img className={Styles.item_img} src={require('../../assets/head.png')} />*/}
                        {/*</div>*/}

                        {/*<div className={Styles.list_item_right}>*/}
                        {/*<div className={ `${Styles.item_content} ${Styles.item_content_img}`}>*/}
                        {/*<img className={Styles.item_loading} src={require('../../assets/loading.gif')} alt=""/>*/}
                        {/*<img className={Styles.content_img} src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584617338137&di=c09eadbe5f032bfe209c911c45024398&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fexp%2Fw%3D480%2Fsign%3D6daf5df38235e5dd902ca4d746c7a7f5%2Fb03533fa828ba61e8abe758e4634970a304e593a.jpg' alt=""/>*/}
                        {/*</div>*/}
                        {/*<img className={Styles.item_img} src={require('../../assets/head.png')} />*/}
                        {/*</div>*/}

                        {/*<div className={Styles.list_item_right}>*/}
                        {/*<div className={ `${Styles.item_content} ${Styles.item_content_img}`}>*/}
                        {/*<img className={Styles.item_loading} src={require('../../assets/loading.gif')} alt=""/>*/}
                        {/*<img className={Styles.content_img} src={require('../../assets/head.png')} alt=""/>*/}
                        {/*</div>*/}
                        {/*<img className={Styles.item_img} src={require('../../assets/head.png')} />*/}
                        {/*</div>*/}




                        {/*<div className={Styles.list_start}>*/}
                        {/*<span>医生的回复仅为建议，具体诊疗需要前往医院进行</span>*/}
                        {/*</div>*/}

                        {/*<div className={Styles.list_hint}>*/}
                        {/*<span className={Styles.hint_words}>本次问诊已结束</span>*/}
                        {/*<p className={Styles.hint_line}></p>*/}
                        {/*</div>*/}

                        <div style={{ float:"left", clear: "both" }}
                             ref={(el) => { this.messagesEnd = el; }}>
                        </div>

                    </div>

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
                            <div className={Styles.buttom_item}>
                                <img src={require('../../assets/chat_camera.png')} alt=""/>
                                <p>拍摄</p>
                            </div>
                            <div className={Styles.buttom_item}>
                                <img src={require('../../assets/chat_picture.png')} alt=""/>
                                <p>拍摄</p>
                            </div>

                        </div> : ''
                    }

                </div>
            </DocumentTitle>

        )
    }
}


export default createForm()(AskChat);
