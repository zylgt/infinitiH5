import React, { Component } from 'react';
import { connect } from 'dva';
import Styles from './index.less';
import { getQueryString,nonceStr } from '../../utils/tools'
import { staticURL,pageURL } from '../../utils/baseURL'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import moment from "moment";
moment.locale('zh-cn');

@connect(({ doctorInfo }) => ({ doctorInfo }))
class DoctorInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timestamp:''
        }
    }

    componentDidMount(){
        const { dispatch } = this.props;
        let id = getQueryString('id') || '';
        console.log('id',id)
        dispatch({
            type: 'doctorInfo/getDoctorInfo',
            payload:{
                doctor_id: id
            }
        });

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
        //         url: pageURL + '/doctorDetail'
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

    render() {

        const { doctorInfo } = this.props.doctorInfo;

        let date = '今日出诊';
        let isOpen = true;
        if(moment().format('d') != doctorInfo.week){
            let weeks = new Array("日", "一", "二", "三", "四", "五", "六");
            let num = weeks[ doctorInfo.week ] || '';
            date = '周' + num + '出诊';
            isOpen = false;
        }

        let doctorName = '医生简介'
        if(doctorInfo.name){
            doctorName = doctorInfo.name + '医生简介'
        }
        return (
            <DocumentTitle title={doctorName}>
                <div className={Styles.doctor_info}>
                    <div className={Styles.info}>
                        <img className={Styles.info_img} src={ staticURL + doctorInfo.icon } alt=""/>
                        <div className={Styles.info_right}>
                            <p className={Styles.info_name}>
                                <span>{doctorInfo.name}</span>
                                <span className={`${Styles.date} ${isOpen ? '':Styles.date_no}`}>{date}</span>
                            </p>
                            <p className={Styles.info_rank}>
                                <span>{doctorInfo.title}</span>
                                <span>{doctorInfo.dept}</span>
                            </p>
                        </div>
                    </div>
                    <div className={Styles.introducer}>
                        <img className={Styles.introducer_img} src={require('../../assets/strong.png')} alt=""/>
                        <div className={Styles.introducer_word}>
                            <span className={Styles.introducer_word_key}>擅长：</span>{doctorInfo.skill}
                        </div>
                    </div>
                    <div className={Styles.introducer}>
                        <img className={Styles.introducer_img} src={require('../../assets/introduce.png')} alt=""/>
                        <div className={Styles.introducer_word}>
                            <span className={Styles.introducer_word_key}>简介：</span>{doctorInfo.info}
                        </div>
                    </div>


                </div>
            </DocumentTitle>

        )
    }
}


export default DoctorInfo;
