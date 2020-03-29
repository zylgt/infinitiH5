import React, { Component } from 'react'
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'

@connect(({ login }) => ({ login }))
class Apply extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        //获取appid和签名
        // dispatch({
        //     type:'patientDescribe/getAppid',
        //     payload:{
        //         noncestr: nonceStr,
        //         timestamp: timestamp,
        //         url: pageURL + '/apply'
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

        return (
            <DocumentTitle title='问诊申请'>
                <div className={Styles.apply}>
                    <p className={Styles.apply_title} >就诊说明</p>
                    <img className={Styles.apply_img} src={require('../../assets/apply_flow.png')} alt=""/>
                    <p className={Styles.apply_content}>1.申请问诊后需等候就诊通知，请在您预约时段内实时关注微信公众号的就诊提醒。</p>
                    <p className={ `${Styles.apply_content} ${Styles.apply_content_strong}`}>2.通知后5分钟未响应，预约视为作废，需重新申请。</p>
                    <p className={Styles.apply_content}>3.就诊时间为15分钟，以进入问诊对话开始计时（建议就诊时间内不退出对话，因为该时段医生会1对1的为解答）。</p>
                    <p className={Styles.apply_content}>4.危重病患者请立即到医院进行治疗。</p>
                    <p className={Styles.apply_content}>5.医生的咨询服务仅提供相关就诊建议，不作为医嘱。</p>
                    <p className={Styles.apply_fill}></p>
                    <div className={Styles.apply_bottom}>
                        <p className={Styles.apply_word}>开始问诊即代表您已阅读并同意<span onClick={()=>{router.push('./informed')}}>《知情同意书》</span></p>
                        <Button className={Styles.apply_btn} onClick={()=>{router.push('./applyList?step=1')}} >开始问诊</Button>
                    </div>
                </div>
            </DocumentTitle>
        )
    }
}
export default Apply;
