import React, {Component} from 'react'
import {connect} from 'dva';
import {Toast} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import {staticURL} from '../../utils/baseURL'
import {cookieUtils, nonceStr, isIOS, getQueryString} from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import moment from "moment";

moment.locale('zh-cn');


@connect(({ask, layout, my}) => ({ask, layout, my}))
class Ask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataArray: [],
            timestamp: ''
        }
    }

    componentDidMount() {

        const {dispatch} = this.props;
        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp: timestamp,
        })

        let token = getQueryString('token') || '';

        if (token) {
            cookieUtils.set('token', token)
        }

        dispatch({
            type: 'ask/getAskList'
        })

        if (isIOS()) {
            wx.ready(function () {
                wx.hideAllNonBaseMenuItem();
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
        } else {
            //获取appid和签名
            dispatch({
                type: 'patientDescribe/getAppid',
                payload: {
                    noncestr: nonceStr,
                    timestamp: timestamp,
                    url: window.location.href.split('#')[0]
                },
                callback: this.getAppidCallback.bind(this)
            })
        }
    }

    componentWillUnmount() {
        //顶部进度条开启
        NProgress.start()
    }

    //获取appidcallback
    getAppidCallback(response) {
        const {timestamp} = this.state;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['chooseImage', 'uploadImage', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
            wx.hideAllNonBaseMenuItem();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }

    //判断消息内容显示
    infoContent(item) {
        const {sendMsg, historyMsg} = this.props.layout;
        let array = historyMsg.concat(sendMsg);
        let index = 0;
        for (let k = 0; k < array.length; k++) {
            if (array[k].type == "notification") {
                array.splice(k, 1)
            }
        }
        for (let i = 0; i < array.length; i++) {
            if (!array[i].readed_at && array[i].type != "notification" && array[i].sender_type == "doctor") {
                index++;
            }
        }
        if (item.status == 'pending' && item.waited_at || item.status == 'inquiring') {
            return (
                <div className={Styles.info_content}>
                    {
                        item.type == 1 ?
                            <div className={Styles.content_video}>
                                <img className={Styles.content_list_img} src={require('../../assets/list_video.png')}
                                     alt=""/>
                                [正在发起视频]
                            </div>
                            :
                            <div>
                                {
                                    array.length > 0 ?
                                        <p className={Styles.content_word}>
                                            {array[array.length - 1].content}
                                        </p> : ''
                                }
                                {
                                    index > 0 ? <p className={Styles.content_number}>{index}</p> : ''
                                }
                            </div>
                    }
                </div>
            )
        } else if (item.status == 'finished') {
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}>[本次问诊已结束]</p>
                    <img className={Styles.content_img} src={require('../../assets/ask_success.png')} alt=""/>
                </div>
            )
        } else if (item.status == 'expired') {
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}>[本次问诊已失效]</p>
                    <img className={Styles.content_img} src={require('../../assets/ask_lose.png')} alt=""/>
                </div>
            )
        } else {
            return (
                <div className={Styles.info_content}>
                    {
                        item.type == 1 ?
                            <img className={Styles.content_list_img} src={require('../../assets/list_video.png')}
                                 alt=""/>
                            : ''
                    }
                    {
                        item.type == 0 ?
                            <img className={Styles.content_list_img} src={require('../../assets/list_img.png')} alt=""/>
                            : ''
                    }
                    {moment(item.created_at).format('MM月DD日')}{item.segment}，请等待就诊通知。
                </div>
            )
        }
    }

    //点击跳转聊天
    jumpChat(e) {
        let orderId = e.currentTarget.getAttribute('data-uid') || '';
        let status = e.currentTarget.getAttribute('data-status') || '';
        let wait = e.currentTarget.getAttribute('data-wait') || '';
        if (status == "pending" && !wait) {
            Toast.info('待医生接诊后可进入', 1.5)
            return;
        }
        // console.log('orderId',orderId);
        router.push('./askchat?source=list&order_id=' + orderId)
    }

    //判断消息右上角时间
    rigthTime(item) {

        let time = ''
        let created_time = item.last_time;
        if (!created_time) {
            created_time = item.created_at;
        }
        if (created_time) {
            let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            let currentTime = Date.parse(new Date(moment().format('L')));
            let d_day = Date.parse(new Date(moment(created_time).format('L')));
            let day = Math.abs(parseInt((d_day - currentTime) / 1000 / 3600 / 24));//计算日期

            if (day >= 8) {
                let date = moment(created_time).format('YYYY/MM/DD')
                time = date;
            } else if (day < 8 && day >= 2) {
                let index = moment(created_time).format('d'); // 星期
                time = weeks[index]
            } else if (day > 0 && day < 2) {
                time = '昨天'
            } else {
                let date = moment(created_time).format('LT'); // 时分
                let hours = moment(created_time).hours(); //小时
                if (hours <= 12) {
                    time = '上午 ' + date
                } else {
                    time = '下午 ' + date
                }
            }
        }

        if (item.status == 'pending' && item.waited_at) {
            return (
                <span className={Styles.info_right}>{time}</span>
            )
        } else if (item.status == 'inquiring') {
            return (
                <span className={Styles.info_right}>{time}</span>
            )
        } else if (item.status == 'finished') {
            return (
                <span className={Styles.info_right}>{time}</span>
            )
        } else if (item.status == 'expired') {
            return (
                <span className={Styles.info_right}>{time}</span>
            )
        } else {
            return (
                <img className={Styles.info_right} src={require('../../assets/ask_order.png')} alt=""/>
            )
        }
    }

    render() {
        const {askList} = this.props.ask;
        // console.log('askList',askList)

        return (
            <DocumentTitle title='问诊'>
                <div className={Styles.ask}>
                    {
                        askList && askList.length > 0 ?
                            askList.map((item, index) => {
                                return (
                                    <div className={Styles.ask_item} key={index} data-uid={item.uid}
                                         data-status={item.status} data-wait={item.waited_at} onClick={(e) => {
                                        this.jumpChat(e)
                                    }}>
                                        <div className={Styles.item}>
                                            {
                                                item.icon ?
                                                    <img className={Styles.item_head} src={staticURL + item.icon}
                                                         alt=""/> : ''
                                            }
                                            <div className={Styles.item_info}>
                                                <div className={Styles.info}>
                                                    <span className={Styles.info_name}>{item.doctor_name}</span>
                                                    <span>{item.dept}</span>
                                                    {this.rigthTime(item)}
                                                </div>
                                                {this.infoContent(item)}
                                                <div
                                                    className={` ${Styles.info_ill}  ${item.status == 'pending' || item.status == 'inquiring' ? '' : Styles.info_ill_expire}`}>
                                                    {
                                                        item.type == 0 ?
                                                            <div
                                                                className={`${Styles.ill} ${Styles.ill_img}`}>图文轻问诊</div>
                                                            :
                                                            <div
                                                                className={`${Styles.ill} ${Styles.ill_video}`}>视频轻问诊</div>
                                                    }
                                                    <div className={Styles.ill}>就诊人：{item.patient_name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className={Styles.ask_no}>
                                <img className={Styles.ask_no_img} src={require('../../assets/no_ask.png')} alt=""/>
                                <p>暂无问诊记录</p>
                            </div>
                    }
                </div>
            </DocumentTitle>

        )
    }
}


export default Ask;
