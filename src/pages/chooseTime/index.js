import React, { Component } from 'react'
import { connect } from 'dva';
import { Button, Toast } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { getQueryString, nonceStr,isIOS } from '../../utils/tools'
import { staticURL } from '../../utils/baseURL'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import moment from "moment";
moment.locale('zh-cn');

@connect(({ chooseTime, management,doctorInfo }) => ({ chooseTime, management,doctorInfo }))
class ChooseTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp:'',
            doctor_id:''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        let id = getQueryString('id') || '';
        // console.log('id',id)
        this.setState({
            doctor_id: id
        })
        dispatch({
            type:'chooseTime/getDoctorTime',
            payload:{
                doctor_id: id
            }
        })

        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })
        if(isIOS()){
            wx.ready(function(){
                wx.hideAllNonBaseMenuItem();
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
        }else{
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
    componentWillUnmount(){
        //顶部进度条开启
        NProgress.start()
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
    //点击时间段选择
    chooseTime (e){
        const { dispatch } = this.props;
        let segment = e.target.getAttribute('data-segment');
        let key = e.target.getAttribute('data-key');
        dispatch({
            type:'chooseTime/setData',
            payload:{
                selectTime: {
                    key,
                    segment
                }
            }
        })
    }
    //点击预约
    appointment(){
        const { dispatch } = this.props;
        const { selectTime } = this.props.chooseTime;
        const { name, card_id } = this.props.management;
        const { doctor_id } = this.state;
        let params = {
            doctor_id: doctor_id,
            price: 0,
            segment: selectTime.segment,
            patient_name: name,
            card_id: card_id
        }
        // console.log('params', params)
        dispatch({
            type:'chooseTime/appointment',
            payload:{
                ...params
            },
            callback:this.appointmentCallback.bind(this)
        })


    }
    //预约回调
    appointmentCallback(response){
        // console.log('response',response)
        const { dispatch } = this.props;
        let code = response.data.code;
        if(code == 417){
            dispatch({
                type:'chooseTime/getDoctorTime',
                payload:{
                    doctor_id: this.state.doctor_id
                }
            })
        }else if(code == 411){
            Toast.info('操作失败',1.2)
        }else if(code == 418){
            Toast.info('只可预约30分钟之后的时段',1.2)
        }else if(code == 419){
            Toast.info('只可预约30分钟之后的时段',1.2)
        }else if(code == 200){
            let set = getQueryString('set') || '';
            if(set == 'reset'){
                router.goBack()
            }else{
                router.push('./apply')
            }
        }


    }
    //比较时分的大小
    compareDate(t1,t2){
        var date = new Date();
        var a = t1.split(":");
        var b = t2.split(":");
        return date.setHours(a[0],a[1]) > date.setHours(b[0],b[1]);
    }

    render() {
        const { timeData, selectTime } = this.props.chooseTime;
        const { doctorInfo } = this.props.doctorInfo;

        return (
            <DocumentTitle title='选择问诊时段'>
                <div className={Styles.time}>
                    <img className={Styles.time_bgc} src={require('../../assets/time_bgc.png')} alt=""/>
                    <div className={Styles.time_info} >
                        {
                            doctorInfo.icon ? <img className={Styles.info_img} src={ staticURL + doctorInfo.icon } alt=""/> : ''
                        }
                        <div>
                            <p className={Styles.info_name}>{doctorInfo.name}</p>
                            <p className={Styles.info_office}>{doctorInfo.title}｜{doctorInfo.dept}</p>
                        </div>
                    </div>
                    <div className={Styles.time_content}>
                        <p className={Styles.choose_now}>今日</p>
                        {
                            timeData.forenoon && timeData.forenoon.length > 0 ?
                                <div className={Styles.choose_time}>
                                    <p className={Styles.choose_title}>上午</p>
                                    <div className={Styles.choose_contetn}>
                                        {
                                            timeData.forenoon.map((item,index)=>{
                                                let start_time = item.segment.substr(0,5);
                                                if(this.compareDate( moment().format('LT'),start_time)){
                                                    return(
                                                        <div key={index} className={ `${Styles.choose_dot} ${Styles.choose_dot_full}` }>{item.segment}</div>
                                                    )
                                                }
                                                if(item.number <= 0){
                                                    return(
                                                        <div key={index} className={ `${Styles.choose_dot} ${Styles.choose_dot_full}` }>{item.segment} 约满</div>
                                                    )
                                                }else{
                                                    if(selectTime.segment && selectTime.segment == item.segment){
                                                        return(
                                                            <div key={index} className={`${Styles.choose_dot} ${Styles.choose_dot_select}`} data-key='forenoon' data-segment={item.segment} onClick={(e)=>{this.chooseTime(e)}}>
                                                                {item.segment}
                                                                <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                                            </div>
                                                        )
                                                    }else{
                                                        return(
                                                            <div key={index} className={Styles.choose_dot} data-key='forenoon' data-segment={item.segment} onClick={(e)=>{this.chooseTime(e)}}>{item.segment}</div>
                                                        )
                                                    }
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                                :''
                        }
                        {
                            timeData.afternoon && timeData.afternoon.length > 0 ?
                                <div className={Styles.choose_time}>
                                    <p className={Styles.choose_title}>下午</p>
                                    <div className={Styles.choose_contetn}>
                                        {
                                            timeData.afternoon.map((item,index)=>{
                                                let start_time = item.segment.substr(0,5);
                                                if(this.compareDate( moment().format('LT'),start_time)){
                                                    return(
                                                        <div key={index} className={ `${Styles.choose_dot} ${Styles.choose_dot_full}` }>{item.segment}</div>
                                                    )
                                                }
                                                if(item.number <= 0){
                                                    return(
                                                        <div key={index} className={ `${Styles.choose_dot} ${Styles.choose_dot_full}` }>{item.segment} 约满</div>
                                                    )
                                                }else{
                                                    if(selectTime.segment && selectTime.segment == item.segment){
                                                        return(
                                                            <div key={index} className={`${Styles.choose_dot} ${Styles.choose_dot_select}`} data-key='afternoon' data-segment={item.segment} onClick={(e)=>{this.chooseTime(e)}}>
                                                                {item.segment}
                                                                <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                                            </div>
                                                        )
                                                    }else{
                                                        return(
                                                            <div key={index} className={Styles.choose_dot} data-key='afternoon' data-segment={item.segment} onClick={(e)=>{this.chooseTime(e)}}>{item.segment}</div>
                                                        )
                                                    }
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                                :''
                        }
                    </div>
                    {
                        selectTime && selectTime.key
                            ?
                            <Button className={Styles.time_btn} onClick={()=>{this.appointment()}} >预约</Button>
                            :
                            <Button className={Styles.time_btn_disabled} >预约</Button>
                    }
                </div>
            </DocumentTitle>
        )
    }
}
export default ChooseTime;
