import React, { Component } from 'react'
import { connect } from 'dva';
import Styles from './index.less';
// import wx from 'weixin-js-sdk';
import router from 'umi/router';
import { pageURL } from '../../utils/baseURL'
import { nonceStr, isIOS,getQueryString } from '../../utils/tools'

@connect(({ empty }) => ({ empty }))
class Empty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp:'',
        }
    }
    componentDidMount() {
        let code = getQueryString('code')
        console.log('code',code)
        const { dispatch } = this.props;
        dispatch({
            type: 'empty/isBind',
            payload: {
                code: code
            }
        });

        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })
        // if(isIOS()){
        //     //获取appid和签名
        //     dispatch({
        //         type:'patientDescribe/getAppid',
        //         payload:{
        //             noncestr: nonceStr,
        //             timestamp: timestamp,
        //             url: pageURL + '/empty'
        //         },
        //         callback: this.getAppidCallback.bind(this)
        //     })
        // }

    }
    //获取appidcallback
    // getAppidCallback(response){
    //     const { timestamp } = this.state;
    //     wx.config({
    //         debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //         appId: response.data.data.app_id, // 必填，公众号的唯一标识
    //         timestamp: timestamp , // 必填，生成签名的时间戳
    //         nonceStr: nonceStr, // 必填，生成签名的随机串
    //         signature: response.data.data.signature,// 必填，签名
    //         jsApiList: ['chooseImage','uploadImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
    //     });
    //     wx.ready(function(){
    //         wx.hideAllNonBaseMenuItem();
    //         // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    //     });
    // }


    render() {

        return (
            <div className={Styles.empty}></div>
        )
    }
}
export default Empty;
