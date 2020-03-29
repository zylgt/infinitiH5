import React, { Component } from 'react'
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'

@connect(({ chooseTime }) => ({ chooseTime }))
class ApplySubmit extends Component {
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
        //         url: pageURL + '/applySubmit'
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
        const { selectTime } = this.props.chooseTime;
        let key = ''
        if(selectTime && selectTime.key == 'forenoon'){
            key='上午'
        }
        if(selectTime && selectTime.key == 'afternoon'){
            key='下午'
        }

        return (
            <DocumentTitle title='问诊申请'>
                <div className={Styles.apply_submit}>
                    <img className={Styles.submit_img} src={require('../../assets/apply_submit.png')} alt=""/>
                    <p className={Styles.submit_title} >已提交问诊</p>
                    <div className={Styles.submit_content} >
                        <p className={Styles.content_time} >
                            就诊时间：{key}
                            {selectTime && selectTime.segment ? selectTime.segment : ''}
                        </p>
                        <p className={Styles.content} >具体时间请以就诊通知为准，<span>通知后5分钟未响应，预约视为作废，需重新申请。</span>请实时关注「天津医大代谢病」微信公众号提醒</p>
                    </div>
                    <Button className={Styles.submit_btn} onClick={()=>{router.push('./ask')}}>知道了</Button>
                </div>
            </DocumentTitle>

        )
    }
}
export default ApplySubmit;
