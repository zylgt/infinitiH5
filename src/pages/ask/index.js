import React, { Component } from 'react'
import { connect } from 'dva';
import { SearchBar, Modal, Menu, Toast, List, InputItem,Button,WhiteSpace} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'
import { staticURL, pageURL } from '../../utils/baseURL'
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { getQueryString } from '../../utils/tools'
import {cookieUtils} from '../../utils/tools'

import moment from "moment";
moment.locale('zh-cn');


@connect(({ ask }) => ({ ask }))
class Ask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataArray:[],
            timestamp:''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })

        let token = getQueryString('token') || '';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE1ODUxODg4MjEsInR5cGUiOiJ1c2VyIiwidWlkIjoiMTI0MjAzMjk2MzQyODgxNDg0OCJ9.dGE0W5jzBUluDhx05zuy-IuUFIo1uLJ_4t9PyKtRiyk';
        if( token ){
            cookieUtils.set('token',token)
        }

        dispatch({
            type:'ask/getAskList'
        })

        //获取appid和签名
        // dispatch({
        //     type:'patientDescribe/getAppid',
        //     payload:{
        //         noncestr: nonceStr,
        //         timestamp: timestamp,
        //         url: pageURL + '/ask'
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
    //判断消息内容显示
    infoContent(item){
        if(item.status == 'inquiring'){
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}> {item.last_msg} </p>
                    {
                        item.un_read > 0 ? <p className={Styles.content_number}>{ item.un_read }</p> : ''
                    }
                </div>
            )
        }else if(item.status == 'finished'){
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}>[本次问诊已结束]</p>
                    <img src={require('../../assets/ask_success.png')} alt=""/>
                </div>
            )
        }else if(item.status == 'expired'){
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}>[本次问诊已失效]</p>
                    <img src={require('../../assets/ask_lose.png')} alt=""/>
                </div>
            )
        }else {
            return (
                <div className={Styles.info_content}>在线问诊{item.segment}，请等待就诊通知。</div>
            )
        }
    }

    //点击跳转聊天
    jumpChat(e){
        let orderId = e.currentTarget.getAttribute('data-uid') || '';
        let status = e.currentTarget.getAttribute('data-status') || '';
        let wait = e.currentTarget.getAttribute('data-wait') || '';
        if(status == "pending" && !wait){
            Toast.info('待医生接诊后可进入',1.5)
            return;
        }
        console.log('orderId',orderId);
        router.push('./askchat?order_id=' + orderId)
    }
    //判断消息右上角时间
    rigthTime(item){

        let time = ''
        let created_time = item.created_at;
        if(created_time){
            let weeks = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
            let currentTime = Date.parse(new Date());
            let d_day = Date.parse(new Date(created_time));
            let day = Math.abs(parseInt((d_day - currentTime)/1000/3600/24));//计算日期
            if(day >= 8){
                let date = moment(created_time).format('YYYY/MM/DD')
                time = date;
            }else if(day <8 && day >= 2){
                let index = new Date(created_time).getDay()
                time = weeks[index]
            }else if(day > 0 && day < 2){
                time = '昨天'
            }else{
                let hours = new Date(created_time).getHours();
                let date = moment(created_time).format('LT');
                if(hours <= 12){
                    time = '上午' + date
                }else{
                    time = '下午' + date
                }
            }
        }

      if(item.status == 'inquiring'){
            return (
                <span className={Styles.info_right}>{time}</span>
            )
        }else if(item.status == 'finished'){
            return (
                <span className={Styles.info_right}>{time}</span>
            )
        }else if(item.status == 'expired'){
            return (
                <span className={Styles.info_right}>{time}</span>
            )
        }else {
            return (
                <img className={Styles.info_right} src={require('../../assets/ask_order.png')} alt=""/>
            )
        }
    }

    render() {
        const { askList } = this.props.ask;

        // console.log('askList',askList)

        return (
            <DocumentTitle title='问诊'>
                <div className={Styles.ask}>
                    {
                        askList && askList.length > 0 ?
                            askList.map((item,index)=>{
                                return(
                                    <div className={Styles.ask_item} key={index} data-uid={item.uid} data-status={item.status} data-wait={item.waited_at} onClick={(e)=>{this.jumpChat(e)}}>
                                        <div className={Styles.item}>
                                            {
                                                item.icon ? <img className={Styles.item_head} src={ staticURL + item.icon } alt=""/> : ''
                                            }
                                            <div className={Styles.item_info}>
                                                <div className={Styles.info}>
                                                    <span className={Styles.info_name}>{item.doctor_name}</span>
                                                    <span>{item.dept}</span>
                                                    {this.rigthTime(item)}
                                                </div>
                                                {this.infoContent(item)}
                                                <div className={Styles.info_ill}>
                                                    {
                                                        item.disease.map((item,index)=>{
                                                            return(
                                                                <div className={Styles.ill} key={index}>{item}</div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className={Styles.ask_no}>
                                <img src={require('../../assets/no_ask.png')} alt=""/>
                                <p>暂无问诊记录</p>
                            </div>
                    }
                </div>
            </DocumentTitle>

        )
    }
}


export default Ask;
